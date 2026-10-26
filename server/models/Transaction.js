const mongoose = require('mongoose');

const CATEGORIES = [
  // Income categories
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gifts',
  'Rental Income',
  'Other Income',
  // Expense categories
  'Food & Dining',
  'Groceries',
  'Housing & Rent',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Health & Fitness',
  'Shopping',
  'Education',
  'Travel',
  'Personal Care',
  'Bills & Fees',
  'Other Expense',
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a transaction title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (must be income or expense)',
      },
      required: [true, 'Transaction type is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI / Digital Wallet', 'Other'],
      default: 'Debit Card',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast filtered lookups
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = {
  Transaction: mongoose.model('Transaction', transactionSchema),
  CATEGORIES,
};
