import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Divider,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterAlt as FilterIcon,
  ClearAll as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { deleteTransaction } from '../../store/slices/transactionSlice';
import { Transaction } from '../../types/transaction';

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Salary',
  'Investments',
  'Other',
];

const TransactionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { transactions } = useSelector((state: RootState) => state.transactions) as {
    transactions: Transaction[];
  };

  const [filters, setFilters] = useState({
    category: '',
    type: '',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });

  const [activeFilters, setActiveFilters] = useState(0);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.type) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.searchTerm) count++;
    setActiveFilters(count);
  }, [filters]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/transactions/edit/${id}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      startDate: '',
      endDate: '',
      searchTerm: '',
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesStartDate = !filters.startDate || new Date(transaction.date) >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || new Date(transaction.date) <= new Date(filters.endDate);
    const matchesSearch = !filters.searchTerm || 
      transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesStartDate && matchesEndDate && matchesSearch;
  });

  // Calculate summary of filtered transactions
  const summary = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/transactions/add')}
          startIcon={<AddIcon />}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1 }} /> Filters
            {activeFilters > 0 && (
              <Chip 
                label={activeFilters} 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
          {activeFilters > 0 && (
            <Button 
              startIcon={<ClearIcon />} 
              onClick={clearFilters}
              size="small"
            >
              Clear All
            </Button>
          )}
        </Box>
        
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by description or category..."
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>

            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Summary Cards */}
      {filteredTransactions.length > 0 && (
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Card sx={{ flex: 1, bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">${summary.income.toFixed(2)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4">${summary.expenses.toFixed(2)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Net</Typography>
              <Typography 
                variant="h4" 
                color={summary.income - summary.expenses >= 0 ? 'success.main' : 'error.main'}
              >
                ${(summary.income - summary.expenses).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Transactions Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                <TableCell sx={{ color: 'white' }}>Category</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Amount</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1">No transactions found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Try adjusting your filters or add a new transaction
                    </Typography>
                    <Button 
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/transactions/add')}
                    >
                      Add Transaction
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id} hover>
                    <TableCell>
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Chip label={transaction.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type === 'income' ? 'Income' : 'Expense'} 
                        color={transaction.type === 'income' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
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
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(transaction._id)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(transaction._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredTransactions.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="body2">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              {activeFilters > 0 ? ' with applied filters' : ''}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionList; 