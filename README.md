# Natwest Track - GoodNest

## Aim

To help demystify investing and financial education for everyone. Specifically we want to decrease the gaps in gender and race in terms of stock ownership/investing. We aim to do this by providing clear information about ISAs and HYSAs (high-yield savings accounts), as well as gamifying/clearly modelling different aspects of investing/managing finances to make it more approachable. A small, dependency-free savings guide. The frontend is served by a Node.js backend, which also provides the account recommendations and illustrative savings projections.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000). Set `PORT` to use another port, for example `PORT=8080 npm start`.

For automatic server restarts while editing, run `npm run dev`.

## Project layout

- `frontend/` contains the separate landing, questionnaire, and recommendations pages, along with shared styles and browser code.
- `backend/server.js` serves the frontend and provides `POST /api/recommendations`, `POST /api/projection`, and `GET /api/health`.

All account rates are example figures for demonstration, not live offers or financial advice.