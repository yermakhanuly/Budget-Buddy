import React from 'react';
import { useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { RootState } from '../store';
import { Transaction, BalanceSummary, CategorySummary } from '../types/transaction';

const Dashboard: React.FC = () => {
  const { transactions, balance, categories, loading, error } = useSelector(
    (state: RootState) => state.transactions
  ) as {
    transactions: Transaction[];
    balance: BalanceSummary;
    categories: CategorySummary;
    loading: boolean;
    error: string | null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Balance Summary */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Balance
            </Typography>
            <Typography component="p" variant="h4">
              ${balance.balance.toFixed(2)}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Income
            </Typography>
            <Typography component="p" variant="h4">
              ${balance.income.toFixed(2)}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'error.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography component="p" variant="h4">
              ${balance.expenses.toFixed(2)}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Category Summary */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Category Summary
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {Object.entries(categories).map(([category, data]) => (
          <Box key={category} sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {category}
              </Typography>
              <Typography color="success.main">
                Income: ${data.income.toFixed(2)}
              </Typography>
              <Typography color="error.main">
                Expenses: ${data.expenses.toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Recent Transactions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Transactions
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {transactions.slice(0, 5).map((transaction) => (
          <Box key={transaction._id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1">{transaction.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.category}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="subtitle1"
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard; 