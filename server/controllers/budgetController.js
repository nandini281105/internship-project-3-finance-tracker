const Budget = require('../models/Budget');
const { Transaction } = require('../models/Transaction');

// @desc    Get user category budgets and progress for a month/year
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // Fetch user defined budgets for the month
    const budgets = await Budget.find({ user: userId, month, year }).lean();

    // Fetch actual expenses for each category in this month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const actualExpenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const expenseMap = {};
    actualExpenses.forEach((item) => {
      expenseMap[item._id] = item.totalSpent;
    });

    // Merge budgets with actual spent
    const budgetProgress = budgets.map((b) => {
      const spent = expenseMap[b.category] || 0;
      const remaining = b.monthlyLimit - spent;
      const percentUsed = Math.min(Math.round((spent / b.monthlyLimit) * 100), 999);

      let status = 'normal'; // < 75%
      if (percentUsed >= 100) {
        status = 'exceeded';
      } else if (percentUsed >= 75) {
        status = 'warning';
      }

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent: Number(spent.toFixed(2)),
        remaining: Number(remaining.toFixed(2)),
        percentUsed,
        status,
        month: b.month,
        year: b.year,
      };
    });

    // Calculate overall budget total
    const totalBudgetLimit = budgets.reduce((acc, curr) => acc + curr.monthlyLimit, 0);
    const totalBudgetSpent = Object.values(expenseMap).reduce((acc, curr) => acc + curr, 0);

    res.json({
      success: true,
      data: {
        month,
        year,
        totalBudgetLimit,
        totalBudgetSpent: Number(totalBudgetSpent.toFixed(2)),
        budgets: budgetProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update category budget
// @route   POST /api/budgets
// @access  Private
const upsertBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;

    if (!category || !monthlyLimit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category and monthly limit',
      });
    }

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        month: targetMonth,
        year: targetYear,
      },
      {
        monthlyLimit: Number(monthlyLimit),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: budget,
      message: `Budget for ${category} saved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
  deleteBudget,
};
