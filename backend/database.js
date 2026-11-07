import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const databaseDirectory = path.join(backendDirectory, "data");
mkdirSync(databaseDirectory, { recursive: true });

const database = new DatabaseSync(path.join(databaseDirectory, "savings.sqlite"));
database.exec(`
  CREATE TABLE IF NOT EXISTS uk_savings_accounts (
    id INTEGER PRIMARY KEY,
    bank TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    interest_rate_1_year REAL NOT NULL CHECK (interest_rate_1_year >= 0),
    interest_rate_2 REAL CHECK (interest_rate_2 IS NULL OR interest_rate_2 >= 0),
    rate_change_after_months INTEGER CHECK (rate_change_after_months IS NULL OR rate_change_after_months > 0),
    account_term_months INTEGER CHECK (account_term_months IS NULL OR account_term_months > 0),
    rate_type TEXT NOT NULL,
    additional_perks TEXT,
    minimum_deposit REAL CHECK (minimum_deposit IS NULL OR minimum_deposit >= 0),
    maximum_balance REAL CHECK (maximum_balance IS NULL OR maximum_balance > 0),
    maximum_monthly_deposit REAL CHECK (maximum_monthly_deposit IS NULL OR maximum_monthly_deposit > 0),
    eligibility_conditions TEXT,
    source_url TEXT,
    last_updated TEXT NOT NULL,
    UNIQUE (bank, account_name)
  );
  CREATE INDEX IF NOT EXISTS idx_savings_account_type ON uk_savings_accounts(account_type);
  CREATE INDEX IF NOT EXISTS idx_savings_account_rate ON uk_savings_accounts(interest_rate_1_year DESC);
`);

database.exec("BEGIN");
try {
  database.exec(readFileSync(path.join(backendDirectory, "seed-accounts.sql"), "utf8"));
  database.exec("COMMIT");
} catch (error) {
  database.exec("ROLLBACK");
  database.close();
  throw new Error(`Could not load savings account seed data: ${error.message}`);
}

const recommendationsQuery = database.prepare(`
  SELECT
    id,
    bank,
    account_name,
    account_type,
    interest_rate_1_year,
    interest_rate_2,
    rate_change_after_months,
    account_term_months,
    rate_type,
    additional_perks,
    minimum_deposit,
    maximum_balance,
    maximum_monthly_deposit,
    eligibility_conditions,
    source_url,
    last_updated,
    (
      CASE
        WHEN :timeframe = 'soon' AND account_type = 'Easy access' THEN 5
        WHEN :timeframe = 'soon' AND account_type = 'Cash ISA' AND rate_type = 'Variable' THEN 3
        WHEN :timeframe = 'soon' AND account_type = 'Cash ISA' THEN 1
        WHEN :timeframe = 'soon' AND account_type = 'Fixed-term' THEN -5
        WHEN :timeframe = 'soon' AND account_type = 'Regular saver' THEN -2
        WHEN :timeframe = 'later' AND account_type = 'Fixed-term' THEN 5
        WHEN :timeframe = 'later' AND account_type = 'Cash ISA' THEN 4
        WHEN :timeframe = 'later' AND account_type = 'Regular saver' THEN 1
        ELSE 0
      END
      + CASE
          WHEN LOWER(COALESCE(eligibility_conditions, '')) LIKE '%requires%'
            AND LOWER(COALESCE(eligibility_conditions, '')) LIKE '%' || LOWER(:bank) || '%' THEN 3
          WHEN LOWER(COALESCE(eligibility_conditions, '')) LIKE '%requires%' THEN -2
          ELSE 0
        END
      + CASE WHEN :amount < 100 AND COALESCE(minimum_deposit, 0) <= :amount THEN 1 ELSE 0 END
    ) AS match_score
  FROM uk_savings_accounts
  WHERE (minimum_deposit IS NULL OR minimum_deposit <= :amount)
    AND (maximum_balance IS NULL OR maximum_balance >= :amount)
    -- The questionnaire asks for a starting amount, not a monthly contribution.
    AND account_type != 'Regular saver'
  ORDER BY match_score DESC, interest_rate_1_year DESC, last_updated DESC, id
  LIMIT 6
`);

const accountByIdQuery = database.prepare(`
  SELECT
    id,
    bank,
    account_name,
    account_type,
    interest_rate_1_year,
    interest_rate_2,
    rate_change_after_months,
    account_term_months,
    rate_type,
    additional_perks,
    minimum_deposit,
    maximum_balance,
    maximum_monthly_deposit,
    eligibility_conditions,
    source_url,
    last_updated
  FROM uk_savings_accounts
  WHERE id = ?
`);

export function getRecommendedAccounts(profile) {
  return recommendationsQuery.all({
    amount: profile.amount,
    bank: profile.bank,
    timeframe: profile.timeframe
  });
}

export function getSavingsAccount(id) {
  return accountByIdQuery.get(id);
}

export function getSavingsAccountCount() {
  return database.prepare("SELECT COUNT(*) AS count FROM uk_savings_accounts").get().count;
}
