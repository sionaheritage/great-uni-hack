import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(backendDirectory, "..", "frontend");
const port = Number(process.env.PORT) || 3000;

const accounts = {
  easy: {
    id: "easy",
    name: "Easy-access savings",
    rate: 3.6,
    description: "A handy place for savings you may need to reach without much notice. You can usually add or take out money when you need to.",
    match: "A flexible place to start"
  },
  cashIsa: {
    id: "cashIsa",
    name: "Cash ISA",
    rate: 4.0,
    description: "A savings account where the interest is usually tax-free. You can normally take money out, but check whether the account has any limits or charges.",
    match: "Worth a look for longer-term saving"
  },
  fixed: {
    id: "fixed",
    name: "Fixed-term savings",
    rate: 4.2,
    description: "You agree to leave your money untouched for a set time. The rate may be higher, but getting your money early can be difficult or cost extra.",
    match: "For money you can leave alone"
  },
  junior: {
    id: "junior",
    name: "Children’s savings account",
    rate: 4.0,
    description: "A way to put money aside for a child. Some accounts are easy to access; others are locked away until the child turns 18.",
    match: "An option for a child’s future"
  },
  juniorIsa: {
    id: "juniorIsa",
    name: "Junior ISA",
    rate: 4.1,
    description: "A tax-free savings account for a child, opened by a parent or guardian. The money belongs to the child and they can usually access it at 18.",
    match: "Made for a child’s longer-term future"
  },
  starter: {
    id: "starter",
    name: "Getting-started savings",
    rate: 3.5,
    description: "A simple account to help you build a savings habit. Some providers offer options with a low minimum deposit.",
    match: "A simple first step"
  }
};

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

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("Request body is too large.");
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Please send valid JSON.");
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

function recommend(profile) {
  const recommendations = [];
  if (profile.age === "under18") {
    recommendations.push({
      ...accounts.starter,
      reason: "Some accounts for under-18s need an adult to open them, so check the rules with a parent or guardian."
    });
    if (profile.children === "yes") {
      recommendations.push({
        ...accounts.junior,
        reason: "You mentioned children. A parent or guardian usually needs to open this type of account."
      });
    }
    recommendations.push({ ...accounts.easy, reason: "A flexible account can be useful if you might need your savings soon." });
    return recommendations;
  }

  if (profile.timeframe === "soon") {
    recommendations.push({ ...accounts.easy, reason: "You may want this money soon, so being able to access it matters." });
    recommendations.push({ ...accounts.cashIsa, reason: "Could suit money you want to save while keeping access. Check the withdrawal rules." });
    recommendations.push({ ...accounts.fixed, reason: "Only consider this for an amount you’re sure you won’t need during the fixed period." });
  } else {
    recommendations.push({ ...accounts.cashIsa, reason: "A tax-free option to explore for money you’re happy to leave for a while." });
    recommendations.push({ ...accounts.fixed, reason: "Leaving money untouched for a set time may offer a different rate." });
    recommendations.push({ ...accounts.easy, reason: "A flexible option if having access still matters to you." });
  }

  if (profile.children === "yes") {
    recommendations.push({ ...accounts.juniorIsa, reason: "You mentioned children. A parent or guardian opens this, and the child gets access at 18." });
  }
  if (profile.amount < 25) {
    recommendations.unshift({ ...accounts.starter, reason: "Some providers let you begin with a small amount. Check minimum deposits before choosing." });
  }
  return recommendations.slice(0, 4);
}

async function serveFrontend(pathname, response) {
  const routes = {
    "/": "index.html",
    "/questionnaire": "questionnaire.html",
    "/recommendations": "recommendations.html"
  };
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Invalid path");
    return;
  }
  const relativePath = routes[requestedPath] || requestedPath.replace(/^\/+/, "");
  const filePath = path.resolve(frontendDirectory, relativePath);
  if (!filePath.startsWith(`${frontendDirectory}${path.sep}`) && filePath !== path.join(frontendDirectory, "index.html")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (!(await stat(filePath)).isFile()) throw new Error("Not a file");
    const body = await readFile(filePath);
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
      sendJson(response, 200, {
        bankMessage: profile.bank === "none"
          ? "Not banking anywhere yet? That’s okay — we’ll focus on account types rather than your current bank."
          : profile.bank === "prefer-not-to-say"
            ? "We’ll focus on account types, so your current bank doesn’t need to be part of the decision."
            : "You can compare options from different providers; you don’t have to save with your current bank.",
        accounts: recommend(profile)
      });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (url.pathname === "/api/projection" && request.method === "POST") {
    try {
      const { amount, accountId } = await readJson(request);
      const account = accounts[accountId];
      if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000 || !account) {
        sendJson(response, 400, { error: "Choose an account and enter a starting amount between £1 and £1,000,000." });
        return;
      }
      const yearlyBalances = Array.from({ length: 11 }, (_, year) => ({
        year,
        balance: Number((amount * (1 + account.rate / 100) ** year).toFixed(2))
      }));
      sendJson(response, 200, { account, yearlyBalances });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
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
