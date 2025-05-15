export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceSummary {
  balance: number;
  income: number;
  expenses: number;
}

export interface CategorySummary {
  [key: string]: {
    income: number;
    expenses: number;
  };
} 