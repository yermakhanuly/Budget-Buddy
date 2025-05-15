const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = new Transaction({
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
      user: req.user.id,
    });

    const savedTransaction = await transaction.save();
    return res.status(201).json(savedTransaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    // Find transaction
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    
    // Save updated transaction
    const updatedTransaction = await transaction.save();
    return res.json(updatedTransaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Transaction.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Transaction removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get balance summary (total balance, income, expenses)
// @route   GET /api/transactions/summary/balance
// @access  Private
exports.getBalanceSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });
    
    const balance = income - expenses;
    
    return res.json({
      balance,
      income,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get category summary
// @route   GET /api/transactions/summary/categories
// @access  Private
exports.getCategorySummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    const categories = {};
    
    transactions.forEach(transaction => {
      const { category, type, amount } = transaction;
      
      if (!categories[category]) {
        categories[category] = {
          income: 0,
          expenses: 0,
        };
      }
      
      if (type === 'income') {
        categories[category].income += amount;
      } else {
        categories[category].expenses += amount;
      }
    });
    
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 