import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, BalanceSummary, CategorySummary } from '../../types/transaction';

// Sample initial data
const initialTransactions: Transaction[] = [
  {
    _id: '1',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    date: new Date().toISOString(),
    user: '1',
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
    user: '1',
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
    user: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface TransactionState {
  transactions: Transaction[];
  balance: BalanceSummary;
  categories: CategorySummary;
  loading: boolean;
  error: string | null;
}

// Calculate initial balance
const initialBalance = initialTransactions.reduce(
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
initialBalance.balance = initialBalance.income - initialBalance.expenses;

// Calculate initial categories
const initialCategories: CategorySummary = {};
initialTransactions.forEach((transaction) => {
  if (!initialCategories[transaction.category]) {
    initialCategories[transaction.category] = { income: 0, expenses: 0 };
  }
  
  if (transaction.type === 'income') {
    initialCategories[transaction.category].income += transaction.amount;
  } else {
    initialCategories[transaction.category].expenses += transaction.amount;
  }
});

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
      }
    },
    
    // Clear any errors
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction, clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer; 