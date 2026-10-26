const { Transaction, CATEGORIES } = require('../models/Transaction');

// @desc    Get all transactions with filtering, search, and pagination
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { user: req.user._id };

    // Filter by type (income or expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Include up to end of the selected day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Search keyword in title or notes
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Run query + count
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, paymentMethod, notes } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type, and category',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Debit Card',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    const { title, amount, type, category, date, paymentMethod, notes } = req.body;

    if (title) transaction.title = title;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (date) transaction.date = new Date(date);
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (notes !== undefined) transaction.notes = notes;

    const updated = await transaction.save();

    res.json({
      success: true,
      data: updated,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard financial stats, category breakdown, monthly trends
// @route   GET /api/transactions/stats/summary
// @access  Private
const getStatsSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregation for totals (Income and Expense)
    const totalsAgg = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    totalsAgg.forEach((item) => {
      totalTransactions += item.count;
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

    // Category breakdown for expenses
    const categoryAgg = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const expenseCategoryBreakdown = categoryAgg.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage: totalExpense > 0 ? Number(((item.total / totalExpense) * 100).toFixed(1)) : 0,
    }));

    // Monthly trends (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Format months array for last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const monthLabel = `${monthNames[m - 1]} ${y.toString().slice(-2)}`;

      const inc = monthlyAgg.find((item) => item._id.year === y && item._id.month === m && item._id.type === 'income');
      const exp = monthlyAgg.find((item) => item._id.year === y && item._id.month === m && item._id.type === 'expense');

      const incomeAmt = inc ? inc.total : 0;
      const expenseAmt = exp ? exp.total : 0;

      monthlyTrends.push({
        name: monthLabel,
        month: m,
        year: y,
        income: Number(incomeAmt.toFixed(2)),
        expense: Number(expenseAmt.toFixed(2)),
        savings: Number((incomeAmt - expenseAmt).toFixed(2)),
      });
    }

    // Recent 5 transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Current month totals (for monthly budget tracking)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentMonthAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    currentMonthAgg.forEach((item) => {
      if (item._id === 'income') currentMonthIncome = item.total;
      if (item._id === 'expense') currentMonthExpense = item.total;
    });

    res.json({
      success: true,
      data: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netBalance: Number(netBalance.toFixed(2)),
        savingsRate: Number(savingsRate),
        totalTransactions,
        currentMonth: {
          income: Number(currentMonthIncome.toFixed(2)),
          expense: Number(currentMonthExpense.toFixed(2)),
          balance: Number((currentMonthIncome - currentMonthExpense).toFixed(2)),
        },
        expenseCategoryBreakdown,
        monthlyTrends,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to CSV
// @route   GET /api/transactions/export/csv
// @access  Private
const exportCSV = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .lean();

    // Header row
    let csv = 'ID,Date,Title,Type,Category,Amount,Payment Method,Notes\n';

    transactions.forEach((tx) => {
      const formattedDate = new Date(tx.date).toISOString().split('T')[0];
      const safeTitle = `"${(tx.title || '').replace(/"/g, '""')}"`;
      const safeCategory = `"${(tx.category || '').replace(/"/g, '""')}"`;
      const safeNotes = `"${(tx.notes || '').replace(/"/g, '""')}"`;
      const safeMethod = `"${(tx.paymentMethod || '').replace(/"/g, '""')}"`;

      csv += `${tx._id},${formattedDate},${safeTitle},${tx.type},${safeCategory},${tx.amount},${safeMethod},${safeNotes}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available categories
// @route   GET /api/transactions/categories
// @access  Public or Private
const getCategories = (req, res) => {
  res.json({
    success: true,
    data: CATEGORIES,
  });
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatsSummary,
  exportCSV,
  getCategories,
};
