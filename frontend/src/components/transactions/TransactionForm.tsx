import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  FormHelperText,
  FormControl,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addTransaction, updateTransaction } from '../../store/slices/transactionSlice';
import { Transaction } from '../../types/transaction';

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
  const dispatch = useAppDispatch();
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
    // In a real app with API you would fetch transaction by ID
    // For local state demo, we'll just set default values for now
    if (id) {
      setFormData({
        amount: '0',
        type: 'expense',
        category: 'Food',
        description: 'Default description',
        date: new Date().toISOString().slice(0, 10),
      });
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

  const handleTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'income' | 'expense' | null
  ) => {
    if (newType !== null) {
      setFormData({
        ...formData,
        type: newType,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const transactionData = {
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        user: 'local-user',
      };
      
      if (id) {
        dispatch(updateTransaction({
          _id: id,
          ...transactionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
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
          <Stack spacing={3}>
            <FormControl fullWidth error={!!formErrors.type}>
              <Typography variant="subtitle1" gutterBottom>
                Transaction Type
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={formData.type}
                exclusive
                onChange={handleTypeChange}
                fullWidth
              >
                <ToggleButton 
                  value="income" 
                  sx={{ 
                    py: 1.5,
                    '&.Mui-selected': { bgcolor: 'success.light', color: 'white' },
                    '&.Mui-selected:hover': { bgcolor: 'success.main', color: 'white' }
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Income
                </ToggleButton>
                <ToggleButton 
                  value="expense"
                  sx={{ 
                    py: 1.5,
                    '&.Mui-selected': { bgcolor: 'error.light', color: 'white' },
                    '&.Mui-selected:hover': { bgcolor: 'error.main', color: 'white' }
                  }}
                >
                  <RemoveIcon sx={{ mr: 1 }} />
                  Expense
                </ToggleButton>
              </ToggleButtonGroup>
              {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
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
              />
            </Box>
            
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!formErrors.category}
              helperText={formErrors.category || "Select the transaction category"}
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
              helperText={formErrors.description || "Brief description of the transaction"}
              multiline
              rows={2}
            />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/transactions')}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color={formData.type === 'income' ? 'success' : 'primary'}
                startIcon={<SaveIcon />}
              >
                {id ? 'Update' : 'Add'} Transaction
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionForm; 