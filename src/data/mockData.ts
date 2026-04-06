export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  categoryIcon: string;
  account: string;
  accountColor: string;
  amount: number;
  type: 'income' | 'expense';
};

export type Account = {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  change: number;
  color: string;
  institution: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
};

export type NetWorthPoint = {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
};

export const transactions: Transaction[] = [
  { id: '1', date: '2026-04-02', merchant: 'Whole Foods Market', category: 'Groceries', categoryIcon: '🛒', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -127.43, type: 'expense' },
  { id: '2', date: '2026-04-02', merchant: 'Netflix', category: 'Entertainment', categoryIcon: '🎬', account: 'Chase Visa', accountColor: '#E74C3C', amount: -15.99, type: 'expense' },
  { id: '3', date: '2026-04-01', merchant: 'Employer Direct Deposit', category: 'Salary', categoryIcon: '💰', account: 'Chase Checking', accountColor: '#0D5C4F', amount: 4250.00, type: 'income' },
  { id: '4', date: '2026-04-01', merchant: 'Starbucks', category: 'Coffee & Dining', categoryIcon: '☕', account: 'Chase Visa', accountColor: '#E74C3C', amount: -6.45, type: 'expense' },
  { id: '5', date: '2026-03-31', merchant: 'Shell Gas Station', category: 'Auto & Transport', categoryIcon: '⛽', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -52.30, type: 'expense' },
  { id: '6', date: '2026-03-30', merchant: 'Amazon', category: 'Shopping', categoryIcon: '📦', account: 'Chase Visa', accountColor: '#E74C3C', amount: -89.99, type: 'expense' },
  { id: '7', date: '2026-03-29', merchant: 'Rent Payment', category: 'Housing', categoryIcon: '🏠', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -1850.00, type: 'expense' },
  { id: '8', date: '2026-03-28', merchant: 'Gym Membership', category: 'Health & Fitness', categoryIcon: '💪', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -49.99, type: 'expense' },
  { id: '9', date: '2026-03-27', merchant: 'Freelance Payment', category: 'Side Income', categoryIcon: '💻', account: 'Chase Checking', accountColor: '#0D5C4F', amount: 850.00, type: 'income' },
  { id: '10', date: '2026-03-26', merchant: 'Uber Eats', category: 'Coffee & Dining', categoryIcon: '🍔', account: 'Chase Visa', accountColor: '#E74C3C', amount: -34.50, type: 'expense' },
  { id: '11', date: '2026-03-25', merchant: 'Electric Company', category: 'Bills & Utilities', categoryIcon: '⚡', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -142.00, type: 'expense' },
  { id: '12', date: '2026-03-24', merchant: 'T-Mobile', category: 'Bills & Utilities', categoryIcon: '📱', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -85.00, type: 'expense' },
  { id: '13', date: '2026-03-23', merchant: 'Target', category: 'Shopping', categoryIcon: '🎯', account: 'Chase Visa', accountColor: '#E74C3C', amount: -67.82, type: 'expense' },
  { id: '14', date: '2026-03-22', merchant: 'Dividend - VTSAX', category: 'Investment Income', categoryIcon: '📈', account: 'Vanguard', accountColor: '#2AA08A', amount: 125.40, type: 'income' },
  { id: '15', date: '2026-03-20', merchant: 'Costco', category: 'Groceries', categoryIcon: '🛒', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -215.67, type: 'expense' },
  { id: '16', date: '2026-03-18', merchant: 'Spotify', category: 'Entertainment', categoryIcon: '🎵', account: 'Chase Visa', accountColor: '#E74C3C', amount: -10.99, type: 'expense' },
  { id: '17', date: '2026-03-17', merchant: 'Employer Direct Deposit', category: 'Salary', categoryIcon: '💰', account: 'Chase Checking', accountColor: '#0D5C4F', amount: 4250.00, type: 'income' },
  { id: '18', date: '2026-03-15', merchant: 'Delta Airlines', category: 'Travel', categoryIcon: '✈️', account: 'Chase Visa', accountColor: '#E74C3C', amount: -342.00, type: 'expense' },
  { id: '19', date: '2026-03-14', merchant: 'Auto Insurance', category: 'Insurance', categoryIcon: '🛡️', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -156.00, type: 'expense' },
  { id: '20', date: '2026-03-12', merchant: 'Trader Joe\'s', category: 'Groceries', categoryIcon: '🛒', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -78.34, type: 'expense' },
  { id: '21', date: '2026-03-10', merchant: 'Apple', category: 'Shopping', categoryIcon: '🍎', account: 'Chase Visa', accountColor: '#E74C3C', amount: -29.99, type: 'expense' },
  { id: '22', date: '2026-03-08', merchant: 'Water Bill', category: 'Bills & Utilities', categoryIcon: '💧', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -45.00, type: 'expense' },
  { id: '23', date: '2026-03-05', merchant: 'Etsy Shop Sales', category: 'Side Income', categoryIcon: '🎨', account: 'Ally Savings', accountColor: '#27AE60', amount: 320.00, type: 'income' },
  { id: '24', date: '2026-03-03', merchant: 'Employer Direct Deposit', category: 'Salary', categoryIcon: '💰', account: 'Chase Checking', accountColor: '#0D5C4F', amount: 4250.00, type: 'income' },
  { id: '25', date: '2026-03-01', merchant: 'Rent Payment', category: 'Housing', categoryIcon: '🏠', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -1850.00, type: 'expense' },
  { id: '26', date: '2026-02-28', merchant: 'Chipotle', category: 'Coffee & Dining', categoryIcon: '🌯', account: 'Chase Visa', accountColor: '#E74C3C', amount: -12.75, type: 'expense' },
  { id: '27', date: '2026-02-25', merchant: 'Internet Bill', category: 'Bills & Utilities', categoryIcon: '🌐', account: 'Chase Checking', accountColor: '#0D5C4F', amount: -79.99, type: 'expense' },
  { id: '28', date: '2026-02-20', merchant: 'Employer Direct Deposit', category: 'Salary', categoryIcon: '💰', account: 'Chase Checking', accountColor: '#0D5C4F', amount: 4250.00, type: 'income' },
];

export const accounts: Account[] = [
  { id: '1', name: 'Chase Checking', type: 'checking', balance: 8432.50, change: 2.3, color: '#0D5C4F', institution: 'Chase' },
  { id: '2', name: 'Ally Savings', type: 'savings', balance: 24150.00, change: 1.8, color: '#27AE60', institution: 'Ally Bank' },
  { id: '3', name: 'Chase Visa', type: 'credit', balance: -2847.32, change: -5.2, color: '#E74C3C', institution: 'Chase' },
  { id: '4', name: 'Vanguard Brokerage', type: 'investment', balance: 67230.00, change: 4.1, color: '#2AA08A', institution: 'Vanguard' },
];

export const budgets: BudgetCategory[] = [
  { id: '1', name: 'Housing', budgeted: 1900, spent: 1850, icon: '🏠' },
  { id: '2', name: 'Groceries', budgeted: 500, spent: 421.44, icon: '🛒' },
  { id: '3', name: 'Dining Out', budgeted: 200, spent: 253.70, icon: '🍔' },
  { id: '4', name: 'Entertainment', budgeted: 100, spent: 76.98, icon: '🎬' },
  { id: '5', name: 'Transportation', budgeted: 250, spent: 208.30, icon: '⛽' },
];

export const goals: Goal[] = [
  { id: '1', name: 'Emergency Fund', target: 25000, saved: 24150, icon: '🛡️' },
  { id: '2', name: 'Vacation to Japan', target: 5000, saved: 2340, icon: '✈️' },
  { id: '3', name: 'Retirement (Yearly)', target: 23000, saved: 14200, icon: '🏖️' },
];

export const netWorthHistory: NetWorthPoint[] = [
  { month: 'Nov', assets: 89500, liabilities: 3200, netWorth: 86300 },
  { month: 'Dec', assets: 91200, liabilities: 3100, netWorth: 88100 },
  { month: 'Jan', assets: 93800, liabilities: 2900, netWorth: 90900 },
  { month: 'Feb', assets: 94100, liabilities: 3400, netWorth: 90700 },
  { month: 'Mar', assets: 96500, liabilities: 3000, netWorth: 93500 },
  { month: 'Apr', assets: 99812, liabilities: 2847, netWorth: 96965 },
];

export const investments = [
  { ticker: 'VTSAX', name: 'Total Stock Market', shares: 142.5, price: 312.40, change: 1.24 },
  { ticker: 'VXUS', name: 'Intl Stock Market', shares: 85.0, price: 62.18, change: -0.45 },
  { ticker: 'BND', name: 'Total Bond Market', shares: 50.0, price: 72.30, change: 0.12 },
  { ticker: 'VNQ', name: 'Real Estate ETF', shares: 30.0, price: 89.50, change: -0.78 },
];

export const spendingByCategory = [
  { name: 'Housing', value: 1850, color: 'hsl(var(--chart-1))' },
  { name: 'Groceries', value: 421, color: 'hsl(var(--chart-2))' },
  { name: 'Dining', value: 254, color: 'hsl(var(--chart-3))' },
  { name: 'Shopping', value: 188, color: 'hsl(var(--chart-4))' },
  { name: 'Bills', value: 352, color: 'hsl(var(--chart-5))' },
  { name: 'Transport', value: 208, color: 'hsl(var(--chart-6))' },
];

export const monthlyIncome = [
  { month: 'Nov', income: 9120, expenses: 5890 },
  { month: 'Dec', income: 9450, expenses: 6320 },
  { month: 'Jan', income: 8950, expenses: 5450 },
  { month: 'Feb', income: 9250, expenses: 6100 },
  { month: 'Mar', income: 9670, expenses: 5780 },
  { month: 'Apr', income: 5100, expenses: 2276 },
];
