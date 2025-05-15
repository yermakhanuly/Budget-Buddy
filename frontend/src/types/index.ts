export interface User {
  id: string;
  email: string;
  name: string;
}

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
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySummary {
  [key: string]: {
    income: number;
    expenses: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  balance: BalanceSummary;
  categories: CategorySummary;
  loading: boolean;
  error: string | null;
} 