import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSpendingInsight } from "./api.js";
import { getRecommendedAccounts, getSavingsAccount, getSavingsAccountCount } from "./database.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(backendDirectory, "..", "frontend");
const port = Number(process.env.PORT) || 3000;

const ageGroups = new Set(["under18", "18-24", "25-34", "35-49", "50-64", "65plus", "prefer-not-to-say"]);
const banks = new Set(["Barclays", "HSBC", "Lloyds", "NatWest", "Nationwide", "Santander", "Monzo", "Starling", "Other", "none", "prefer-not-to-say"]);
const childAnswers = new Set(["yes", "no", "prefer-not-to-say"]);
const timeframes = new Set(["soon", "later"]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

class BadRequestError extends Error {}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new BadRequestError("Request body is too large.");
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new BadRequestError("Please send valid JSON.");
  }
}

function validateProfile(profile) {
  return profile && typeof profile === "object"
    && ageGroups.has(profile.age)
    && banks.has(profile.bank)
    && Number.isFinite(profile.amount)
    && profile.amount >= 1
    && profile.amount <= 1_000_000
    && childAnswers.has(profile.children)
    && timeframes.has(profile.timeframe);
}

function normalizeBankName(bank) {
  return bank.toLowerCase() === "lloyds" ? "lloyds bank" : bank.toLowerCase();
}

function describeMatch(profile, account) {
  const reasons = [];
  if (profile.timeframe === "soon" && account.account_type === "Easy access") {
    reasons.push("Easy access may suit your plans to use the money soon.");
  } else if (profile.timeframe === "later" && account.account_type === "Fixed-term") {
    reasons.push("A fixed term may suit money you can leave untouched for a while.");
  } else if (account.account_type === "Cash ISA") {
    reasons.push("A cash ISA may be worth comparing for your savings timeframe.");
  } else {
    reasons.push("Matched using your starting amount and savings timeframe.");
  }
  if (account.minimum_deposit !== null && account.minimum_deposit !== undefined) {
    reasons.push(`Minimum starting deposit: £${account.minimum_deposit}.`);
  }
  if (account.eligibility_conditions) reasons.push(account.eligibility_conditions);
  if (account.interest_rate_1_year === null) {
    reasons.push("The current rate hasn’t been confirmed, so check it with the provider.");
  }
  return reasons.join(" ");
}

function projectSavings(account, amount) {
  const mentionsIntroductoryRate = /introductory|first 12 months|first year/i.test(account.additional_perks || "");
  const horizonMonths = account.account_term_months
    || (mentionsIntroductoryRate && account.interest_rate_2 === null ? 12 : 120);
  const annualPoints = [{ year: 0, balance: Number(amount.toFixed(2)) }];
  let balance = amount;

  for (let month = 1; month <= horizonMonths; month += 1) {
    const usesSecondRate = account.rate_change_after_months
      && month > account.rate_change_after_months
      && account.interest_rate_2 !== null;
    const annualRate = usesSecondRate ? account.interest_rate_2 : account.interest_rate_1_year;
    balance *= (1 + annualRate / 100) ** (1 / 12);
    if (month % 12 === 0 || month === horizonMonths) {
      annualPoints.push({ year: Number((month / 12).toFixed(2)), balance: Number(balance.toFixed(2)) });
    }
  }

  return {
    horizonYears: horizonMonths / 12,
    yearlyBalances: annualPoints
  };
}

async function serveFrontend(pathname, response) {
  const routes = {
    "/": "index.html",
    "/questionnaire": "questionnaire.html",
    "/recommendations": "recommendations.html",
    "/insights": "insights.html",
    "/insights.html": "insights.html",
    "/streak": "streak.html"
  };
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Invalid path");
    return;
  }
  const normalizedPath = requestedPath.replace(/\/+$/, "") || "/";
  const frontendPath = normalizedPath.replace(/^\/frontend(?=\/)/, "");
  const relativePath = routes[normalizedPath]
    || routes[frontendPath]
    || frontendPath.replace(/^\/+/, "");
  const filePath = path.resolve(frontendDirectory, relativePath);
  if (!filePath.startsWith(`${frontendDirectory}${path.sep}`) && filePath !== path.join(frontendDirectory, "index.html")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (!(await stat(filePath)).isFile()) throw new Error("Not a file");
    let body = await readFile(filePath, "utf8");
    if (body.includes("<!-- SITE_HEADER -->")) {
      const header = await readFile(path.join(frontendDirectory, "header.html"), "utf8");
      const currentPage = {
        "/": "home",
        "/questionnaire": "questionnaire",
        "/recommendations": "recommendations",
        "/insights": "insights",
        "/insights.html": "insights",
        "/streak": "streak"
      }[normalizedPath] || path.basename(filePath, ".html");
      body = body.replace("<!-- SITE_HEADER -->", header.replace(/\{\{([A-Z_]+)_CURRENT\}\}/g, (_match, page) =>
        page.toLowerCase() === currentPage ? ' aria-current="page"' : ""
      ));
    }
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Page not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (url.pathname === "/api/health" && request.method === "GET") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/api/recommendations" && request.method === "POST") {
    try {
      const profile = await readJson(request);
      if (!validateProfile(profile)) {
        sendJson(response, 400, { error: "Please check your answers and try again." });
        return;
      }
      const accounts = (profile.age === "under18" ? [] : getRecommendedAccounts(profile)).map((account) => ({
        id: account.id,
        bank: account.bank,
        name: account.account_name,
        accountType: account.account_type,
        rate: account.interest_rate_1_year,
        secondRate: account.interest_rate_2,
        rateChangeAfterMonths: account.rate_change_after_months,
        accountTermMonths: account.account_term_months,
        rateType: account.rate_type,
        description: account.additional_perks,
        minimumDeposit: account.minimum_deposit,
        maximumBalance: account.maximum_balance,
        maximumMonthlyDeposit: account.maximum_monthly_deposit,
        eligibility: account.eligibility_conditions,
        sourceUrl: account.source_url,
        lastUpdated: account.last_updated,
        reason: describeMatch(profile, account)
      }));
      sendJson(response, 200, {
        bankMessage: profile.bank === "none"
          ? "Not banking anywhere yet? That’s okay — we’ll focus on account types rather than your current bank."
          : profile.bank === "prefer-not-to-say"
            ? "We’ll focus on account types, so your current bank doesn’t need to be part of the decision."
            : "You can compare options from different providers; you don’t have to save with your current bank.",
        hasCurrentBankOptions: accounts.some((account) => normalizeBankName(account.bank) === normalizeBankName(profile.bank)),
        accounts,
        totalAccounts: getSavingsAccountCount(),
        recommendationNote: profile.age === "under18"
          ? "The supplied account list has no under-18 eligibility details, so we can’t safely match an account. Ask a parent or guardian to check providers’ youth savings options."
          : profile.children === "yes"
            ? "The supplied account list has no child-specific accounts, so these options are for your own savings."
            : null
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        sendJson(response, 400, { error: error.message });
      } else {
        console.error("Savings recommendations failed:", error.message);
        sendJson(response, 500, { error: "Savings options aren’t available right now. Please try again." });
      }
    }
    return;
  }

  if (url.pathname === "/api/projection" && request.method === "POST") {
    try {
      const { amount, accountId } = await readJson(request);
      if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000 || !Number.isSafeInteger(accountId) || accountId < 1) {
        sendJson(response, 400, { error: "Choose an account and enter a starting amount between £1 and £1,000,000." });
        return;
      }
      const account = getSavingsAccount(accountId);
      if (!account) {
        sendJson(response, 404, { error: "That savings account is no longer available. Please refresh your options." });
        return;
      }
      if (account.interest_rate_1_year === null || account.rate_type === null) {
        sendJson(response, 400, { error: "A current rate for this account hasn’t been confirmed, so we can’t make a savings projection yet. Check the provider’s details." });
        return;
      }
      if (account.minimum_deposit !== null && amount < account.minimum_deposit) {
        sendJson(response, 400, { error: `This account needs at least £${account.minimum_deposit} to start.` });
        return;
      }
      if (account.maximum_balance !== null && amount > account.maximum_balance) {
        sendJson(response, 400, { error: "This account’s maximum balance is lower than your starting amount." });
        return;
      }
      const { yearlyBalances, horizonYears } = projectSavings(account, amount);
      sendJson(response, 200, {
        account: {
          id: account.id,
          bank: account.bank,
          name: account.account_name,
          rate: account.interest_rate_1_year,
          secondRate: account.interest_rate_2,
          rateChangeAfterMonths: account.rate_change_after_months,
          rateType: account.rate_type,
          termMonths: account.account_term_months
        },
        yearlyBalances,
        horizonYears
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        sendJson(response, 400, { error: error.message });
      } else {
        console.error("Savings projection failed:", error.message);
        sendJson(response, 500, { error: "This savings example isn’t available right now. Please try again." });
      }
    }
    return;
  }

  if (url.pathname === "/api/insights" && request.method === "POST") {
    try {
      const { message, spending, history = [] } = await readJson(request);
      if (typeof message !== "string" || message.trim().length === 0 || message.length > 800) {
        sendJson(response, 400, { error: "Write a message of up to 800 characters." });
        return;
      }
      if (!Array.isArray(spending) || spending.length > 15 || spending.some((item) =>
        !item
        || typeof item.category !== "string"
        || item.category.trim().length === 0
        || item.category.length > 50
        || !Number.isFinite(item.amount)
        || item.amount < 0
        || item.amount > 1_000_000
      )) {
        sendJson(response, 400, { error: "Add up to 15 spending categories with valid monthly amounts." });
        return;
      }
      if (!Array.isArray(history) || history.length > 12 || history.some((item) =>
        !item
        || !["user", "assistant"].includes(item.role)
        || typeof item.content !== "string"
        || item.content.length > 800
      )) {
        sendJson(response, 400, { error: "The conversation has grown too long. Start a new chat to continue." });
        return;
      }
      if (!process.env.ANTHROPIC_API_KEY) {
        sendJson(response, 503, { error: "The chat assistant is not configured. Set ANTHROPIC_API_KEY in .env and restart the app." });
        return;
      }
      const reply = await getSpendingInsight({ message: message.trim(), spending, history });
      sendJson(response, 200, { reply });
    } catch (error) {
      console.error("Insights request failed:", error.message);
      sendJson(response, 502, { error: "The chat assistant couldn’t reply just now. Please try again." });
    }
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }
  await serveFrontend(url.pathname, response);
});

server.listen(port, () => {
  console.log(`Goodnest is running at http://localhost:${port}`);
});
