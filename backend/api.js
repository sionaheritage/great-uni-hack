const apiEndpoint = "https://api.anthropic.com/v1/messages";

export async function getSpendingInsight({ message, spending, history }) {
  const spendingSummary = spending.length
    ? spending.map(({ category, amount }) => `- ${category}: £${amount.toFixed(2)} per month`).join("\n")
    : "The user has not added any spending categories yet.";
  const conversation = [
    ...history.map(({ role, content }) => ({ role, content })),
    {
      role: "user",
      content: `Their answer: ${message}\n\nMonthly spending they chose to share:\n${spendingSummary}`
    }
  ];

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-opus-5-5",
      max_tokens: 700,
      system: "You are Goodnest Insights, a kind, practical guide helping people reflect on everyday spending and find lower-cost, sustainable alternatives. Never shame the user or assume spending is wasteful. First ask whether their spending feels important to them if they have not answered yet. Suggest small, realistic alternatives (repair, reuse, borrowing, public transport, meal planning, refill or second-hand options) only when relevant. Do not invent savings or claim an alternative is always cheaper or more sustainable; encourage comparing local prices and personal needs. If no spending categories were supplied, invite them to add a few approximate monthly totals. Keep replies warm, concise, and in plain English. You are not a financial adviser.",
      messages: conversation
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API returned HTTP ${response.status}`);
  }

  const result = await response.json();
  const reply = result.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!reply) {
    throw new Error("Anthropic API returned no text reply.");
  }

  return reply;
}
