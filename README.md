# Natwest Track - GoodNest

## Aim

To help demystify investing and financial education for everyone. Specifically we want to decrease the gaps in gender and race in terms of stock ownership/investing. We aim to do this by providing clear information about ISAs and HYSAs (high-yield savings accounts), as well as gamifying/clearly modelling different aspects of investing/managing finances to make it more approachable.

## Run locally

Install Node.js 20 or newer, then run `npm start` and open [http://localhost:3000](http://localhost:3000). The server reads secrets from the ignored `.env` file. Set `ANTHROPIC_API_KEY` there to enable the Insights chat; the key is used only by the backend and must not be added to source code or committed.

The Insights page lets visitors enter spending categories and approximate monthly amounts themselves. Those category names and amounts, together with the chat message, are sent to Anthropic to generate a reply. The page explains this before users chat. No bank connection or transaction import is used.