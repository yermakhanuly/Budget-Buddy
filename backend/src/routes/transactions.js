const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Get all transactions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new transaction
router.post('/',
  auth,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, type, category, description, date } = req.body;

      const transaction = new Transaction({
        amount,
        type,
        category,
        description,
        date: date || Date.now(),
        user: req.user._id,
      });

      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update transaction
router.put('/:id',
  auth,
  [
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
    body('category').optional().notEmpty().withMessage('Category is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const { amount, type, category, description, date } = req.body;

      if (amount) transaction.amount = amount;
      if (type) transaction.type = type;
      if (category) transaction.category = category;
      if (description) transaction.description = description;
      if (date) transaction.date = date;

      await transaction.save();
      res.json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get balance summary
router.get('/summary/balance', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    
    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });

    summary.balance = summary.income - summary.expenses;
    
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category summary
router.get('/summary/categories', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    
    const categorySummary = transactions.reduce((acc, transaction) => {
      const { category, amount, type } = transaction;
      
      if (!acc[category]) {
        acc[category] = { income: 0, expenses: 0 };
      }
      
      if (type === 'income') {
        acc[category].income += amount;
      } else {
        acc[category].expenses += amount;
      }
      
      return acc;
    }, {});

    res.json(categorySummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 