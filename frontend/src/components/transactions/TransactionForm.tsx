import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { addTransaction, updateTransaction } from '../../store/slices/transactionSlice';

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Salary',
  'Investments',
  'Other',
];

const TransactionForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const [formErrors, setFormErrors] = useState({
    amount: '',
    type: '',
    category: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the transaction by id and populate the form
      // For local state, you could optionally prefill with dummy data
    }
  }, [id]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      amount: '',
      type: '',
      category: '',
      description: '',
      date: '',
    };

    if (!formData.amount) {
      errors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
      isValid = false;
    }

    if (!formData.type) {
      errors.type = 'Type is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.description) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const transactionData = {
        amount: Number(formData.amount),
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        description: formData.description,
        date: formData.date,
        user: 'local-user',
      };
      if (id) {
        dispatch(updateTransaction({ _id: id, ...transactionData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
      } else {
        dispatch(addTransaction(transactionData));
      }
      navigate('/transactions');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Transaction' : 'Add Transaction'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={!!formErrors.amount}
            helperText={formErrors.amount}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={!!formErrors.type}
            helperText={formErrors.type}
            sx={{ mb: 2 }}
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!formErrors.category}
            helperText={formErrors.category}
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={!!formErrors.date}
            helperText={formErrors.date}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {id ? 'Update' : 'Add'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/transactions')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionForm; 