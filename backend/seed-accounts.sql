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
),

-- =========================================
-- NATWEST
-- =========================================

(
    'NatWest',
    'Digital Regular Saver',
    'Regular saver',
    5.25, 1.00, NULL, NULL, 'Variable',
    '5.25% AER on first £5,000 and 1.00% above £5,000. Save £1-£150 monthly. Instant access. Supports round-ups and savings goals.',
    1, NULL, 150,
    'Requires NatWest current account and eligible digital banking access.',
    'https://www.natwest.com/savings/digital-regular-saver.html',
    '2026-11-07'
),

(
    'NatWest',
    'Flexible Saver',
    'Easy access',
    1.00, NULL, NULL, NULL, 'Variable',
    'Instant access. Interest paid monthly. Rate applies to balances up to £24,999.',
    1, NULL, NULL,
    'Subject to NatWest account eligibility.',
    'https://www.natwest.com/savings.html',
    '2026-11-07'
),

(
    'NatWest',
    'Defined Access Saver',
    'Easy access',
    2.50, NULL, NULL, NULL, 'Variable',
    '2.50% AER with 0-3 withdrawals per calendar year. Lower rate applies after 3 withdrawals.',
    1, 3000000, NULL,
    'Subject to NatWest eligibility.',
    'https://www.natwest.com/savings.html',
    '2026-11-07'
),

(
    'NatWest',
    'Fixed Term Savings Account',
    'Fixed-term',
    4.11, NULL, NULL, 12, 'Fixed',
    '4.11% AER for balances £1-£99,999. 4.20% AER for balances £100,000-£3m. Monthly interest and maturity payment. Early closure charges may apply.',
    1, 3000000, NULL,
    'UK residents aged 16 or over. Existing NatWest customers can apply.',
    'https://www.natwest.com/savings/fixed-term-savings-account.html',
    '2026-11-07'
),

(
    'NatWest',
    'Fixed Rate ISA',
    'Cash ISA',
    4.72, NULL, NULL, 12, 'Fixed',
    'Tax-free interest. One-year fixed term. ISA transfers accepted subject to terms. Early closure may incur a charge.',
    1000, NULL, NULL,
    'Must be 18 or over and UK resident for tax purposes.',
    'https://www.natwest.com/savings.html',
    '2026-11-07'
),

(
    'NatWest',
    'Cash ISA',
    'Cash ISA',
    1.15, 2.45, NULL, NULL, 'Variable',
    'Instant access and tax-free interest. 1.15% AER on balances below £25,000 and 2.45% on balances £25,000 or above.',
    1, NULL, NULL,
    'Must be 18 or over, UK resident for tax purposes and an existing NatWest current account customer.',
    'https://www.natwest.com/savings/isa-overview/cash-isa.html',
    '2026-11-07'
),

-- =========================================
-- LLOYDS
-- =========================================

(
    'Lloyds Bank',
    'Club Lloyds Monthly Saver',
    'Regular saver',
    6.25, NULL, NULL, 12, 'Fixed',
    'Fixed rate for 12 months. Deposit £25-£250 monthly. Unlimited withdrawals without interest penalty. Converts to Standard Saver after maturity.',
    25, NULL, 250,
    'Requires qualifying Club Lloyds current account. UK resident aged 18 or over. One account per customer.',
    'https://www.lloydsbank.com/savings/club-lloyds-monthly-saver.html',
    '2026-11-07'
),

(
    'Lloyds Bank',
    'Club Lloyds Advantage Saver',
    'Easy access',
    3.00, 0.65, 12, 12, 'Variable',
    '3.00% AER with two or fewer withdrawals. 0.65% AER from the third withdrawal onwards during the account year. Instant access.',
    1, NULL, NULL,
    'Requires qualifying Club Lloyds current account.',
    'https://www.lloydsbank.com/savings/club-lloyds.html',
    '2026-11-07'
),

(
    'Lloyds Bank',
    'Club Lloyds Saver',
    'Easy access',
    0.95, NULL, NULL, 12, 'Variable',
    'Tiered interest: 0.95% on balances below £25,000; 1.10% on £25,000-£99,999; 1.20% on £100,000 or more. Instant withdrawals.',
    1, NULL, NULL,
    'Requires qualifying Club Lloyds current account.',
    'https://www.lloydsbank.com/savings/club-lloyds.html',
    '2026-11-07'
),

(
    'Lloyds Bank',
    'Cash ISA Saver',
    'Cash ISA',
    0.75, NULL, NULL, 12, 'Variable',
    'Tax-free interest. Tiered rates: 0.75%, 0.90% and 1.00% according to balance. Additional 0.20% for qualifying Club Lloyds, Premier or Private Banking customers.',
    1, NULL, NULL,
    'UK resident and eligible ISA customer.',
    'https://www.lloydsbank.com/savings/club-lloyds.html',
    '2026-11-07'
),

-- =========================================
-- HALIFAX
-- =========================================

(
    'Halifax',
    'Reward Bonus Saver',
    'Easy access',
    3.00, 0.65, NULL, 12, 'Variable',
    '3.00% AER if no more than two withdrawals are made in 12 months. 0.65% applies from the month of the third withdrawal. Monthly interest.',
    1, NULL, NULL,
    'Requires qualifying Halifax current account. UK resident aged 18 or over.',
    'https://www.halifax.co.uk/savings/easy-access/reward-bonus-saver.html',
    '2026-11-07'
),

(
    'Halifax',
    'Regular Saver',
    'Regular saver',
    NULL, NULL, NULL, NULL, NULL,
    'Regular monthly savings product. Current rate and monthly deposit limits require verification against Halifax rate sheet.',
    NULL, NULL, NULL,
    'Check Halifax eligibility and current product terms.',
    'https://www.halifax.co.uk/savings/help-guidance/interest-rates.html',
    '2026-11-07'
),

(
    'Halifax',
    'Fixed Saver',
    'Fixed-term',
    NULL, NULL, NULL, NULL, 'Fixed',
    'Fixed interest for an agreed term. Current issue rate requires verification against Halifax rate sheet.',
    NULL, NULL, NULL,
    'Check current Halifax issue availability and eligibility.',
    'https://www.halifax.co.uk/savings/help-guidance/interest-rates.html',
    '2026-11-07'
),

(
    'Halifax',
    'ISA Saver Fixed',
    'Cash ISA',
    NULL, NULL, NULL, NULL, 'Fixed',
    'Tax-free fixed-rate savings. Current issue rate requires verification against Halifax rate sheet.',
    NULL, NULL, NULL,
    'Must meet ISA eligibility requirements.',
    'https://www.halifax.co.uk/savings/help-guidance/interest-rates.html',
    '2026-11-07'
),

-- =========================================
-- HSBC
-- =========================================

(
    'HSBC',
    'Regular Saver',
    'Regular saver',
    5.00, NULL, NULL, 12, 'Fixed',
    '5.00% fixed AER for 12 months. Deposit £25-£250 monthly. No partial withdrawals. Unused monthly allowance can be carried forward. Maturity balance transfers to Flexible Saver or Premier Savings.',
    25, 3000, 250,
    'Must be aged 18 or over and hold an HSBC current account throughout the term.',
    'https://www.hsbc.co.uk/savings/products/regular-saver/',
    '2026-11-07'
),

(
    'HSBC',
    'Flexible Saver',
    'Easy access',
    NULL, NULL, NULL, NULL, 'Variable',
    'Easy-access savings product. Current rate needs verification against HSBC published rate sheet.',
    NULL, NULL, NULL,
    'Subject to HSBC account eligibility.',
    'https://www.hsbc.co.uk/savings/',
    '2026-11-07'
),

(
    'HSBC',
    'Fixed Rate Saver',
    'Fixed-term',
    NULL, NULL, NULL, NULL, 'Fixed',
    'Fixed interest savings product. Current issue rates and terms require verification.',
    NULL, NULL, NULL,
    'Subject to HSBC product eligibility and issue availability.',
    'https://www.hsbc.co.uk/savings/',
    '2026-11-07'
),

(
    'HSBC',
    'Cash ISA',
    'Cash ISA',
    NULL, NULL, NULL, NULL, 'Variable',
    'Tax-free savings. Current easy-access rate requires verification against HSBC published rate sheet.',
    NULL, NULL, NULL,
    'Must meet UK ISA eligibility requirements.',
    'https://www.hsbc.co.uk/savings/isas/',
    '2026-11-07'
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