const formatMoney = (value) => new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0
}).format(value);

async function requestJson(path, data) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
  return result;
}

function setupQuestionnaire() {
  const form = document.querySelector("#profile-form");
  const panels = [...form.querySelectorAll(".question-panel")];
  const error = document.querySelector("#form-error");
  let currentStep = 1;
  let transitionBusy = false;

  async function showStep(step) {
    if (transitionBusy || step === currentStep) return;
    transitionBusy = true;
    const outgoingPanel = panels[currentStep - 1];
    const incomingPanel = panels[step - 1];
    if (outgoingPanel && !outgoingPanel.hidden && typeof outgoingPanel.animate === "function") {
      await outgoingPanel.animate(
        [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-8px)" }],
        { duration: 140, easing: "ease-in", fill: "forwards" }
      ).finished.catch(() => {});
    }
    if (outgoingPanel) outgoingPanel.hidden = true;
    currentStep = step;
    panels.forEach((panel) => { panel.hidden = panel !== incomingPanel; });
    if (typeof incomingPanel.animate === "function") {
      incomingPanel.animate(
        [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 280, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    }
    document.querySelector("#progress-count").textContent = `${step} of ${panels.length}`;
    document.querySelector("#progress-bar").style.width = `${(step / panels.length) * 100}%`;
    error.hidden = true;
    document.querySelector("#back-link").href = step === 1 ? "/" : "#";
    document.querySelector("#back-link").textContent = step === 1 ? "Home" : "Back";
    transitionBusy = false;
  }

  document.querySelector("#back-link").addEventListener("click", (event) => {
    if (currentStep === 1) return;
    event.preventDefault();
    showStep(currentStep - 1);
  });

  form.addEventListener("click", (event) => {
    if (!event.target.closest(".next-button")) return;
    const panel = panels[currentStep - 1];
    const field = panel.querySelector("input:required, select:required");
    const valid = field.type === "radio"
      ? Boolean(panel.querySelector(`input[name="${field.name}"]:checked`))
      : field.checkValidity();
    if (!valid) {
      error.hidden = false;
      if (field.type !== "radio") field.focus();
      return;
    }
    showStep(Math.min(currentStep + 1, panels.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const panel = panels[currentStep - 1];
    const field = panel.querySelector("input:required, select:required");
    const valid = field.type === "radio"
      ? Boolean(panel.querySelector(`input[name="${field.name}"]:checked`))
      : field.checkValidity();
    if (!valid) {
      error.hidden = false;
      return;
    }
    const data = new FormData(form);
    const profile = {
      age: data.get("age"),
      bank: data.get("bank"),
      amount: Number(data.get("amount")),
      children: data.get("children"),
      timeframe: data.get("timeframe")
    };
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = "Finding your options…";
    try {
      await requestJson("/api/recommendations", profile);
      localStorage.setItem("goodnest-profile", JSON.stringify(profile));
      window.location.assign("/recommendations");
    } catch (requestError) {
      error.textContent = requestError.message;
      error.hidden = false;
      submit.disabled = false;
      submit.textContent = "Show me my options";
    }
  });
}

function renderChart(yearlyBalances) {
  const width = 400;
  const height = 180;
  const left = 58;
  const right = 392;
  const top = 14;
  const bottom = 159;
  const max = Math.max(yearlyBalances.at(-1).balance * 1.08, yearlyBalances[0].balance * 1.08, 1);
  const x = (year) => left + (year / 10) * (right - left);
  const y = (value) => bottom - (value / max) * (bottom - top);
  const points = yearlyBalances.map(({ year, balance }) => `${x(year)},${y(balance)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${right},${bottom} L ${left},${bottom} Z`;
  const grid = [0, max / 2, max].map((value) =>
    `<line class="chart-grid" x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}"></line><text class="chart-y-label" x="0" y="${y(value) + 3}">${formatMoney(value)}</text>`
  ).join("");
  const marks = [0, 5, 10].map((year) => {
    const balance = yearlyBalances[year].balance;
    return `<circle class="chart-point" cx="${x(year)}" cy="${y(balance)}" r="4"></circle>`;
  }).join("");
  const initial = formatMoney(yearlyBalances[0].balance);
  const final = formatMoney(yearlyBalances.at(-1).balance);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Illustrative savings projection from ${initial} to ${final} over 10 years`);
  svg.innerHTML = `${grid}<path class="chart-area" d="${areaPath}"></path><path class="chart-line" d="${linePath}"></path>${marks}`;
  document.querySelector("#chart-wrap").replaceChildren(svg);
}

function setupRecommendations() {
  let profile;
  try {
    profile = JSON.parse(localStorage.getItem("goodnest-profile"));
  } catch {
    localStorage.removeItem("goodnest-profile");
  }
  if (!profile) {
    window.location.replace("/questionnaire");
    return;
  }

  const list = document.querySelector("#account-list");
  requestJson("/api/recommendations", profile).then(({ bankMessage, accounts }) => {
    document.querySelector("#results-summary").textContent = `${bankMessage} Based on your answers, here are a few account types worth exploring.`;
    for (const account of accounts) {
      const button = document.createElement("button");
      button.className = "account-card";
      button.type = "button";
      button.setAttribute("aria-pressed", "false");

      const top = document.createElement("div");
      top.className = "account-card-top";
      const title = document.createElement("h3");
      title.textContent = account.name;
      const rate = document.createElement("span");
      rate.className = "rate-pill";
      rate.textContent = `${account.rate.toFixed(1)}% example rate`;
      top.append(title, rate);

      const description = document.createElement("p");
      description.textContent = account.description;
      const match = document.createElement("span");
      match.className = "account-match";
      match.textContent = account.reason || account.match;
      const open = document.createElement("span");
      open.className = "account-open";
      open.textContent = "See a savings example";
      button.append(top, description, match, open);
      button.addEventListener("click", () => selectAccount(button, account));
      list.append(button);
    }
  }).catch((error) => {
    document.querySelector("#results-summary").textContent = error.message;
  });

  async function selectAccount(button, account) {
    try {
      const { yearlyBalances, account: selected } = await requestJson("/api/projection", {
        amount: profile.amount,
        accountId: account.id
      });
      list.querySelectorAll(".account-card").forEach((card) => card.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      document.querySelector("#projection-title").textContent = selected.name;
      document.querySelector("#projection-lead").textContent = `Starting with ${formatMoney(profile.amount)} at an example rate of ${selected.rate.toFixed(1)}% a year.`;
      document.querySelector("#projection-total").textContent = formatMoney(yearlyBalances.at(-1).balance);
      renderChart(yearlyBalances);
      document.querySelector("#projection-card").hidden = false;
      document.querySelector("#projection-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      document.querySelector("#results-summary").textContent = error.message;
    }
  }

  document.querySelector("#close-projection").addEventListener("click", () => {
    document.querySelector("#projection-card").hidden = true;
    list.querySelectorAll(".account-card").forEach((card) => card.setAttribute("aria-pressed", "false"));
  });
}

function setupInsights() {
  const form = document.querySelector("#chat-form");
  const input = document.querySelector("#chat-input");
  const sendButton = document.querySelector("#send-button");
  const messages = document.querySelector("#chat-messages");
  const welcome = document.querySelector(".chat-welcome");
  const categories = [];
  let history = [];
  let sending = false;

  const colors = ["#214d3c", "#b37550", "#d9b677", "#78966e", "#967d9f", "#688b9b", "#cf8d70", "#9caa78"];
  const formatCompactMoney = (value) => new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(value);

  function addMessage(role, text, typing = false) {
    const bubble = document.createElement("article");
    bubble.className = `chat-message chat-message-${role}${typing ? " chat-message-typing" : ""}`;
    if (role === "assistant") {
      const mark = document.createElement("span");
      mark.className = "message-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✳";
      bubble.append(mark);
    }
    const content = document.createElement("p");
    content.textContent = text;
    bubble.append(content);
    messages.append(bubble);
    document.querySelector("#chat-scroll").scrollTop = document.querySelector("#chat-scroll").scrollHeight;
    return bubble;
  }

  function renderSpending() {
    const total = categories.reduce((sum, item) => sum + item.amount, 0);
    const summary = document.querySelector("#activity-summary");
    const empty = document.querySelector("#activity-empty");
    summary.hidden = categories.length === 0;
    empty.hidden = categories.length > 0;
    if (!categories.length) return;

    document.querySelector("#monthly-total").textContent = formatCompactMoney(total);
    const stops = [];
    let offset = 0;
    categories.forEach((item, index) => {
      const end = offset + (item.amount / total) * 100;
      stops.push(`${colors[index % colors.length]} ${offset}% ${end}%`);
      offset = end;
    });
    const donut = document.querySelector("#donut-chart");
    donut.style.background = `conic-gradient(${stops.join(", ")})`;
    donut.setAttribute("aria-label", `Monthly spending of ${formatCompactMoney(total)} across ${categories.length} categories`);

    const breakdown = document.querySelector("#spending-breakdown");
    breakdown.replaceChildren();
    categories.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "spending-row";
      const label = document.createElement("div");
      label.className = "spending-row-label";
      const swatch = document.createElement("span");
      swatch.className = "spending-swatch";
      swatch.style.backgroundColor = colors[index % colors.length];
      const name = document.createElement("span");
      name.textContent = item.category;
      const amount = document.createElement("strong");
      amount.textContent = formatCompactMoney(item.amount);
      label.append(swatch, name, amount);
      const track = document.createElement("div");
      track.className = "spending-bar-track";
      const bar = document.createElement("span");
      bar.style.backgroundColor = colors[index % colors.length];
      bar.style.width = `${Math.max((item.amount / total) * 100, 2)}%`;
      track.append(bar);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-spending";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.category}`);
      remove.addEventListener("click", () => {
        categories.splice(index, 1);
        renderSpending();
      });
      row.append(label, track, remove);
      breakdown.append(row);
    });
  }

  async function sendMessage(message) {
    if (sending || !message.trim()) return;
    sending = true;
    welcome.hidden = true;
    addMessage("user", message);
    const waiting = addMessage("assistant", "Thinking through it…", true);
    input.disabled = true;
    sendButton.disabled = true;
    try {
      const result = await requestJson("/api/insights", {
        message,
        spending: categories.map(({ category, amount }) => ({ category, amount })),
        history: history.slice(-12)
      });
      waiting.remove();
      addMessage("assistant", result.reply);
      history = [...history, { role: "user", content: message }, { role: "assistant", content: result.reply }].slice(-12);
    } catch (error) {
      waiting.remove();
      addMessage("assistant", error.message);
    } finally {
      sending = false;
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  document.querySelector("#opening-choices").addEventListener("click", (event) => {
    const choice = event.target.closest("button");
    if (choice) sendMessage(choice.textContent.trim());
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    input.style.height = "";
    sendMessage(message);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  });

  document.querySelector("#new-chat").addEventListener("click", () => {
    history = [];
    messages.replaceChildren();
    welcome.hidden = false;
    input.value = "";
    document.querySelector("#chat-scroll").scrollTop = 0;
  });

  document.querySelector("#spending-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const categoryInput = document.querySelector("#spending-category");
    const amountInput = document.querySelector("#spending-amount");
    const category = categoryInput.value;
    const amount = Number(amountInput.value);
    if (!category || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return;
    const existing = categories.find((item) => item.category === category);
    if (existing) {
      existing.amount = Math.min(existing.amount + amount, 1_000_000);
    } else if (categories.length < 8) {
      categories.push({ category, amount });
    } else {
      addMessage("assistant", "You can compare up to eight spending categories at a time. Remove one to add another.");
      return;
    }
    categoryInput.value = "";
    amountInput.value = "";
    renderSpending();
  });

  document.querySelector("#ask-insights").addEventListener("click", () => {
    sendMessage("Looking at my spending, where could I make one small, sustainable change without giving up what matters to me?");
  });
}

if (document.body.dataset.page === "questionnaire") setupQuestionnaire();
if (document.body.dataset.page === "recommendations") setupRecommendations();
if (document.body.dataset.page === "insights") setupInsights();
