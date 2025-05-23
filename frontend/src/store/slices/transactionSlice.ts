import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, BalanceSummary, CategorySummary } from '../../types/transaction';

// Helper functions for user-specific data
const getCurrentUserId = (): string => {
  return localStorage.getItem('currentUserId') || 'guest';
};

const getUserTransactions = (): Transaction[] => {
  const userId = getCurrentUserId();
  const storedTransactions = localStorage.getItem(`transactions_${userId}`);
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

const saveUserTransactions = (transactions: Transaction[]) => {
  const userId = getCurrentUserId();
  localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
};

// Sample initial data
const getSampleTransactions = (userId: string): Transaction[] => {
  // Only create sample data for new users
  const storedTransactions = localStorage.getItem(`transactions_${userId}`);
  if (storedTransactions) {
    return JSON.parse(storedTransactions);
  }

  return [
    {
      _id: '1',
      amount: 5000,
      type: 'income',
      category: 'Salary',
      description: 'Monthly Salary',
      date: new Date().toISOString(),
      user: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      amount: 100,
      type: 'expense',
      category: 'Food',
      description: 'Grocery Shopping',
      date: new Date().toISOString(),
      user: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      amount: 200,
      type: 'expense',
      category: 'Transportation',
      description: 'Bus Fare',
      date: new Date().toISOString(),
      user: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// Initialize with current user's transactions
const userId = getCurrentUserId();
const initialTransactions = userId === 'guest' ? [] : getSampleTransactions(userId);

// Save initial transactions if they're sample data
if (userId !== 'guest' && !localStorage.getItem(`transactions_${userId}`)) {
  saveUserTransactions(initialTransactions);
}

interface TransactionState {
  transactions: Transaction[];
  balance: BalanceSummary;
  categories: CategorySummary;
  loading: boolean;
  error: string | null;
}

// Calculate initial balance
const calculateBalance = (transactions: Transaction[]): BalanceSummary => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );
};

const initialBalance = calculateBalance(initialTransactions);
initialBalance.balance = initialBalance.income - initialBalance.expenses;

// Calculate initial categories
const calculateCategories = (transactions: Transaction[]): CategorySummary => {
  const categories: CategorySummary = {};
  
  transactions.forEach((transaction) => {
    if (!categories[transaction.category]) {
      categories[transaction.category] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      categories[transaction.category].income += transaction.amount;
    } else {
      categories[transaction.category].expenses += transaction.amount;
    }
  });
  
  return categories;
};

const initialCategories = calculateCategories(initialTransactions);

const initialState: TransactionState = {
  transactions: initialTransactions,
  balance: initialBalance,
  categories: initialCategories,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Add a new transaction
    addTransaction: (state, action: PayloadAction<Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>>) => {
      const newTransaction: Transaction = {
        ...action.payload,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to transactions list
      state.transactions.unshift(newTransaction);
      
      // Update balance
      if (newTransaction.type === 'income') {
        state.balance.income += newTransaction.amount;
        state.balance.balance += newTransaction.amount;
      } else {
        state.balance.expenses += newTransaction.amount;
        state.balance.balance -= newTransaction.amount;
      }
      
      // Update categories
      if (!state.categories[newTransaction.category]) {
        state.categories[newTransaction.category] = { income: 0, expenses: 0 };
      }
      
      if (newTransaction.type === 'income') {
        state.categories[newTransaction.category].income += newTransaction.amount;
      } else {
        state.categories[newTransaction.category].expenses += newTransaction.amount;
      }
      
      // Save to localStorage
      saveUserTransactions(state.transactions);
    },
    
    // Update an existing transaction
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const { _id } = action.payload;
      const index = state.transactions.findIndex(t => t._id === _id);
      
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        
        // Revert old transaction's effect
        if (oldTransaction.type === 'income') {
          state.balance.income -= oldTransaction.amount;
          state.balance.balance -= oldTransaction.amount;
          state.categories[oldTransaction.category].income -= oldTransaction.amount;
        } else {
          state.balance.expenses -= oldTransaction.amount;
          state.balance.balance += oldTransaction.amount;
          state.categories[oldTransaction.category].expenses -= oldTransaction.amount;
        }
        
        // Apply new transaction's effect
        if (action.payload.type === 'income') {
          state.balance.income += action.payload.amount;
          state.balance.balance += action.payload.amount;
          
          if (!state.categories[action.payload.category]) {
            state.categories[action.payload.category] = { income: 0, expenses: 0 };
          }
          
          state.categories[action.payload.category].income += action.payload.amount;
        } else {
          state.balance.expenses += action.payload.amount;
          state.balance.balance -= action.payload.amount;
          
          if (!state.categories[action.payload.category]) {
            state.categories[action.payload.category] = { income: 0, expenses: 0 };
          }
          
          state.categories[action.payload.category].expenses += action.payload.amount;
        }
        
        // Update the transaction
        state.transactions[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        
        // Save to localStorage
        saveUserTransactions(state.transactions);
      }
    },
    
    // Delete a transaction
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(t => t._id === action.payload);
      
      if (transaction) {
        // Update balance
        if (transaction.type === 'income') {
          state.balance.income -= transaction.amount;
          state.balance.balance -= transaction.amount;
          state.categories[transaction.category].income -= transaction.amount;
        } else {
          state.balance.expenses -= transaction.amount;
          state.balance.balance += transaction.amount;
          state.categories[transaction.category].expenses -= transaction.amount;
        }
        
        // Remove from transactions list
        state.transactions = state.transactions.filter(t => t._id !== action.payload);
        
        // Save to localStorage
        saveUserTransactions(state.transactions);
      }
    },
    
    // Clear any errors
    clearTransactionError: (state) => {
      state.error = null;
    },
    
    // Load user transactions
    loadUserTransactions: (state) => {
      const transactions = getUserTransactions();
      state.transactions = transactions;
      
      // Recalculate balance and categories
      const balance = calculateBalance(transactions);
      balance.balance = balance.income - balance.expenses;
      state.balance = balance;
      
      state.categories = calculateCategories(transactions);
    },
  },
});

export const { 
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
  clearTransactionError,
  loadUserTransactions
} = transactionSlice.actions;
export default transactionSlice.reducer; 