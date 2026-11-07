# Natwest Track - GoodNest

## Aim

To help demystify investing and financial education for everyone. Specifically we want to decrease the gaps in gender and race in terms of stock ownership/investing. We aim to do this by providing clear information about ISAs and HYSAs (high-yield savings accounts), as well as gamifying/clearly modelling different aspects of investing/managing finances to make it more approachable. A small, dependency-free savings guide. The frontend is served by a Node.js backend, which also provides the account recommendations and illustrative savings projections.

## Run locally

Install Node.js 22.13 or newer, then run:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000). Set `PORT` to use another port, for example `PORT=8080 npm start`.

For automatic server restarts while editing, run `npm run dev`.

## Project layout

- `frontend/` contains the separate landing, questionnaire, and recommendations pages, along with shared styles and browser code.
- `backend/server.js` serves the frontend and provides `POST /api/recommendations`, `POST /api/projection`, and `GET /api/health`.
- `backend/database.js` creates a local SQLite database at `backend/data/savings.sqlite` and loads or refreshes it from `backend/seed-accounts.sql` each time the server starts. The generated database file is ignored by Git.

The supplied account list can become outdated. Check rates, access rules, eligibility, and product terms with each provider before opening an account. Projections are illustrations based on the listed rates and do not account for tax or future rate changes.

The server reads secrets from the ignored `.env` file. Set `ANTHROPIC_API_KEY` there to enable the Insights chat; the key is used only by the backend and must not be added to source code or committed.

The Insights page lets visitors enter spending categories and approximate monthly amounts themselves. Those category names and amounts, together with the chat message, are sent to Anthropic to generate a reply. The page explains this before users chat. No bank connection or transaction import is used.