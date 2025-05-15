const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// @route   GET /api/transactions
// @route   POST /api/transactions
router.route('/')
  .get(transactionController.getTransactions)
  .post(transactionController.addTransaction);

// @route   GET /api/transactions/:id
// @route   PUT /api/transactions/:id
// @route   DELETE /api/transactions/:id
router.route('/:id')
  .get(transactionController.getTransactionById)
  .put(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

// @route   GET /api/transactions/summary/balance
router.get('/summary/balance', transactionController.getBalanceSummary);

// @route   GET /api/transactions/summary/categories
router.get('/summary/categories', transactionController.getCategorySummary);

module.exports = router; 