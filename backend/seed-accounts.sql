INSERT INTO uk_savings_accounts (
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
)
VALUES

-- =========================================
-- EASY ACCESS
-- =========================================

(
    'Cahoot',
    'Sunny Day Saver Issue 6',
    'Easy access',
    5.00, 1.00, 12, 12, 'Variable',
    '5% AER for 12 months on balances up to £3,000. Instant penalty-free withdrawals. At maturity funds transfer to a standard Cahoot savings account.',
    1, 3000, NULL,
    'Subject to account eligibility.',
    'https://www.cahoot.com/',
    '2026-11-06'
),

(
    'Cahoot',
    'Simple Saver Issue 20',
    'Easy access',
    4.52, 1.00, 12, 12, 'Variable',
    '4.52% AER for 12 months on eligible balances up to £500,000. Instant penalty-free withdrawals. Matures into a standard savings account.',
    1, 500000, NULL,
    'Subject to account eligibility.',
    'https://www.cahoot.com/products-and-services/compare-our-accounts',
    '2026-11-06'
),

(
    'Zopa Bank',
    'Limited Access Savings',
    'Easy access',
    4.56, NULL, NULL, NULL, 'Variable',
    'Includes an introductory bonus. Limited to three withdrawals per year. Maximum balance £250,000.',
    1, 250000, NULL,
    'Subject to Zopa account terms.',
    'https://www.zopa.com/',
    '2026-11-06'
),

(
    'Chase',
    'Chase Saver',
    'Easy access',
    4.50, NULL, NULL, NULL, 'Variable',
    'Introductory boosted rate for the first 12 months. App-based account management.',
    0, NULL, NULL,
    'Requires a Chase current account. Introductory offer eligibility applies.',
    'https://www.chase.co.uk/',
    '2026-11-06'
),

(
    'Sainsburys Bank',
    'Instant Access Saver',
    'Easy access',
    4.35, NULL, NULL, NULL, 'Variable',
    '4.35% AER for Nectar members; non-Nectar rate is 4.25%. Introductory bonus included in headline rate.',
    0, NULL, NULL,
    'Higher rate requires Nectar membership.',
    'https://www.sainsburysbank.co.uk/',
    '2026-11-06'
),

(
    'Oxbury Bank',
    'Easy Access Savings',
    'Easy access',
    4.57, NULL, NULL, NULL, 'Variable',
    'Competitive variable rate. Maximum balance £120,000.',
    NULL, 120000, NULL,
    'Check current account opening requirements with Oxbury.',
    'https://www.oxbury.com/',
    '2026-11-06'
),

(
    'Charter Savings Bank',
    'Easy Access Issue 79',
    'Easy access',
    4.25, NULL, NULL, NULL, 'Variable',
    'Online account with monthly or annual interest payment options.',
    1, NULL, NULL,
    'Subject to issue availability and account conditions.',
    'https://www.chartersavingsbank.co.uk/',
    '2026-11-06'
),

(
    'Ford Money',
    'Flexible Saver',
    'Easy access',
    4.21, NULL, NULL, NULL, 'Variable',
    'Flexible access to savings with online account management.',
    1, NULL, NULL,
    'Subject to Ford Money eligibility conditions.',
    'https://www.fordmoney.co.uk/',
    '2026-11-06'
),

(
    'Hampshire Trust Bank',
    'Easy Access Online Saver Issue 36',
    'Easy access',
    4.18, NULL, NULL, NULL, 'Variable',
    'Online savings account with variable interest.',
    1, NULL, NULL,
    'Subject to issue availability.',
    'https://www.htb.co.uk/',
    '2026-10-30'
),

-- =========================================
-- FIXED TERM
-- =========================================

(
    'Afin Bank',
    '1-Year Fixed Term Account Issue 8',
    'Fixed-term',
    5.15, NULL, NULL, 12, 'Fixed',
    'Interest paid yearly. No ordinary instant access during the fixed term.',
    1000, NULL, NULL,
    'Online/app application. Subject to issue availability.',
    'https://www.afinbank.com/',
    '2026-10-30'
),

(
    'Chetwood Bank',
    '1 Year Fixed Rate Savings Account',
    'Fixed-term',
    5.13, NULL, NULL, 12, 'Fixed',
    'Interest paid at maturity. Guaranteed fixed rate for the term.',
    1000, NULL, NULL,
    'Online application. Subject to issue availability.',
    'https://www.chetwoodbank.com/',
    '2026-10-30'
),

(
    'OakNorth Bank',
    'Fixed Term Savings Account',
    'Fixed-term',
    5.12, NULL, NULL, 12, 'Fixed',
    'Minimum investment £1. Interest paid at maturity.',
    1, NULL, NULL,
    'Online or mobile application. Subject to issue availability.',
    'https://www.oaknorth.co.uk/',
    '2026-10-30'
),

(
    'Union Bank of India UK',
    'Union Premier Bond',
    'Fixed-term',
    5.12, NULL, NULL, 12, 'Fixed',
    'One-year fixed savings product. Interest paid at maturity.',
    1000, NULL, NULL,
    'Subject to account eligibility.',
    'https://www.unionbankofindiauk.co.uk/',
    '2026-10-30'
),

(
    'GB Bank',
    '1 Year Fixed Rate Bond',
    'Fixed-term',
    5.11, NULL, NULL, 12, 'Fixed',
    'Fixed return over one year. Monthly or maturity interest options may be available.',
    1000, NULL, NULL,
    'Subject to account availability.',
    'https://www.gbbank.co.uk/',
    '2026-10-30'
),

(
    'MBNA',
    'Fixed Saver 1 Year',
    'Fixed-term',
    5.10, NULL, NULL, 12, 'Fixed',
    'Fixed interest with payment at maturity.',
    1000, NULL, NULL,
    'Subject to account eligibility.',
    'https://www.mbna.co.uk/',
    '2026-10-30'
),

(
    'Recognise Bank',
    '1 Year Fixed Rate Account',
    'Fixed-term',
    5.10, NULL, NULL, 12, 'Fixed',
    'Fixed return with monthly or annual interest payment options.',
    1000, NULL, NULL,
    'Subject to account availability.',
    'https://www.recognisebank.co.uk/',
    '2026-10-30'
),

(
    'Vanquis Bank',
    '1 Year Fixed Rate Bond',
    'Fixed-term',
    5.08, NULL, NULL, 12, 'Fixed',
    'Fixed interest with monthly or annual payment options.',
    1000, NULL, NULL,
    'Subject to account eligibility.',
    'https://www.vanquissavings.co.uk/',
    '2026-10-30'
),

(
    'Cahoot',
    'Fixed Rate Bond 1 Year',
    'Fixed-term',
    4.20, NULL, NULL, 12, 'Fixed',
    'No additional deposits or withdrawals during the fixed term.',
    500, 2000000, NULL,
    'Subject to Cahoot account conditions.',
    'https://www.cahoot.com/products-and-services/compare-our-accounts',
    '2026-11-06'
),

-- =========================================
-- REGULAR SAVERS
-- =========================================

(
    'Santander',
    'Regular Saver',
    'Regular saver',
    8.00, 3.00, 12, 12, 'Variable',
    'Includes a 5% bonus rate for the first 12 months. Save up to £200 per month from a Santander current account.',
    NULL, NULL, 200,
    'Requires a qualifying Santander current account.',
    'https://www.santander.co.uk/personal/savings-and-isas',
    '2026-11-06'
),

(
    'Co-operative Bank',
    'Regular Saver Issue 1',
    'Regular saver',
    7.00, NULL, NULL, 12, 'Variable',
    'Maximum monthly deposit £250. Regular monthly saving facility.',
    NULL, NULL, 250,
    'Existing customer eligibility conditions apply.',
    'https://www.co-operativebank.co.uk/',
    '2026-10-30'
),

(
    'First Direct',
    'Regular Saver Account',
    'Regular saver',
    7.00, NULL, NULL, 12, 'Fixed',
    'Maximum monthly deposit £300. Minimum monthly deposit £25. Interest earned on monthly contributions.',
    NULL, NULL, 300,
    'Requires a First Direct current account.',
    'https://www.firstdirect.com/',
    '2026-10-30'
),

(
    'Chase',
    'Regular Saver',
    'Regular saver',
    6.50, NULL, NULL, 12, 'Fixed',
    'Maximum monthly deposit £300. Missed monthly contributions permitted. Penalty-free withdrawals.',
    NULL, NULL, 300,
    'Requires a Chase current account.',
    'https://www.chase.co.uk/',
    '2026-10-30'
),

(
    'Lloyds Bank',
    'Club Lloyds Monthly Saver',
    'Regular saver',
    6.25, NULL, NULL, 12, 'Fixed',
    'Maximum monthly deposit £250. Missed months permitted. Penalty-free withdrawals.',
    NULL, NULL, 250,
    'Requires a qualifying Club Lloyds current account.',
    'https://www.lloydsbank.com/',
    '2026-10-30'
),

-- =========================================
-- CASH ISAS
-- =========================================

(
    'Shawbrook Bank',
    '1 Year Fixed Rate Cash ISA Plus Issue 2',
    'Cash ISA',
    5.02, NULL, NULL, 12, 'Fixed',
    'Tax-free interest. ISA transfers accepted. Early access subject to account terms.',
    10000, NULL, NULL,
    'Minimum investment £10,000.',
    'https://www.shawbrook.co.uk/',
    '2026-11-06'
),

(
    'Castle Trust Bank',
    'Fixed Rate e-Cash ISA',
    'Cash ISA',
    5.16, NULL, NULL, 24, 'Fixed',
    'Tax-free interest. ISA transfers accepted.',
    1000, 500000, NULL,
    'Minimum investment £1,000.',
    'https://www.castletrust.co.uk/',
    '2026-11-06'
),

(
    'Santander',
    'Easy Access ISA',
    'Cash ISA',
    2.00, NULL, NULL, NULL, 'Variable',
    'Tax-free interest. Instant access. Maximum balance £2 million.',
    500, 2000000, NULL,
    'Minimum opening deposit £500.',
    'https://www.santander.co.uk/personal/savings-and-isas',
    '2026-11-06'
)

ON CONFLICT (bank, account_name)
DO UPDATE SET
    account_type = EXCLUDED.account_type,
    interest_rate_1_year = EXCLUDED.interest_rate_1_year,
    interest_rate_2 = EXCLUDED.interest_rate_2,
    rate_change_after_months = EXCLUDED.rate_change_after_months,
    account_term_months = EXCLUDED.account_term_months,
    rate_type = EXCLUDED.rate_type,
    additional_perks = EXCLUDED.additional_perks,
    minimum_deposit = EXCLUDED.minimum_deposit,
    maximum_balance = EXCLUDED.maximum_balance,
    maximum_monthly_deposit = EXCLUDED.maximum_monthly_deposit,
    eligibility_conditions = EXCLUDED.eligibility_conditions,
    source_url = EXCLUDED.source_url,
    last_updated = EXCLUDED.last_updated;