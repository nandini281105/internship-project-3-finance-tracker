const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatsSummary,
  exportCSV,
  getCategories,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// Public route for category list
router.get('/categories', getCategories);

// Protected routes
router.use(protect);

router.get('/stats/summary', getStatsSummary);
router.get('/export/csv', exportCSV);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
