import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Paper,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { RootState } from '../store';
import { Transaction, BalanceSummary, CategorySummary } from '../types/transaction';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { deleteTransaction } from '../store/slices/transactionSlice';

const Dashboard: React.FC = () => {
  const { transactions, balance, categories } = useSelector(
    (state: RootState) => state.transactions
  ) as {
    transactions: Transaction[];
    balance: BalanceSummary;
    categories: CategorySummary;
  };
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const recentTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);
  
  const handleEdit = (id: string) => {
    navigate(`/transactions/edit/${id}`);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Balance Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 275, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Balance
            </Typography>
            <Typography variant="h4">${balance.balance.toFixed(2)}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, flex: 1, bgcolor: 'success.light' }}>
          <CardContent>
            <Typography variant="h6" color="white" gutterBottom>
              Total Income
            </Typography>
            <Typography variant="h4" color="white">
              ${balance.income.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, flex: 1, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography variant="h6" color="white" gutterBottom>
              Total Expenses
            </Typography>
            <Typography variant="h4" color="white">
              ${balance.expenses.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      {/* Top Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Top Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(categories)
            .sort((a, b) => 
              (b[1].income + b[1].expenses) - (a[1].income + a[1].expenses)
            )
            .slice(0, 4)
            .map(([category, amounts]) => (
              <Card key={category} sx={{ minWidth: 200, flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {category}
                  </Typography>
                  <Typography color="success.main">
                    Income: ${amounts.income.toFixed(2)}
                  </Typography>
                  <Typography color="error.main">
                    Expenses: ${amounts.expenses.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>
      
      {/* Recent Transactions */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Recent Transactions
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/transactions/add')}
          >
            Add Transaction
          </Button>
        </Box>
        
        {transactions.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No transactions found. Add your first transaction!</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: transaction.type === 'income' ? 'success.main' : 'error.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(transaction._id)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(transaction._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {transactions.length > 5 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => navigate('/transactions')}>
              View All Transactions
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 