const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const { Transaction } = require('../models/Transaction');
const Budget = require('../models/Budget');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_tracker';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clean up existing demo user
    const demoEmail = 'demo@financetracker.com';
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Transaction.deleteMany({ user: existingUser._id });
      await Budget.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('Cleaned up previous demo data.');
    }

    // Create demo user
    const user = await User.create({
      name: 'Alex Morgan',
      email: demoEmail,
      password: 'password123',
      currency: 'USD',
      monthlyBudgetGoal: 3500,
    });
    console.log(`Demo user created: ${user.email} (Password: password123)`);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Generate dates relative to today
    const daysAgo = (d) => {
      const date = new Date();
      date.setDate(date.getDate() - d);
      return date;
    };

    const monthsAgo = (m, day = 15) => {
      const date = new Date();
      date.setMonth(date.getMonth() - m);
      date.setDate(day);
      return date;
    };

    const transactions = [
      // Current Month Income
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5200.0,
        type: 'income',
        category: 'Salary',
        date: daysAgo(3),
        paymentMethod: 'Bank Transfer',
        notes: 'Monthly direct deposit from tech employer',
      },
      {
        user: user._id,
        title: 'Freelance UI/UX Client Project',
        amount: 1450.0,
        type: 'income',
        category: 'Freelance',
        date: daysAgo(10),
        paymentMethod: 'Bank Transfer',
        notes: 'Redesign client e-commerce dashboard',
      },
      {
        user: user._id,
        title: 'Stock Dividend Payout',
        amount: 220.5,
        type: 'income',
        category: 'Investments',
        date: daysAgo(16),
        paymentMethod: 'Bank Transfer',
        notes: 'Quarterly index fund dividend',
      },

      // Current Month Expenses
      {
        user: user._id,
        title: 'Apartment Monthly Rent',
        amount: 1550.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: daysAgo(2),
        paymentMethod: 'Bank Transfer',
        notes: 'Downtown 1-bedroom apartment rent',
      },
      {
        user: user._id,
        title: 'Whole Foods Organic Groceries',
        amount: 185.4,
        type: 'expense',
        category: 'Groceries',
        date: daysAgo(1),
        paymentMethod: 'Credit Card',
        notes: 'Weekly fresh produce & kitchen essentials',
      },
      {
        user: user._id,
        title: 'Fine Dining & Sushi Night',
        amount: 124.0,
        type: 'expense',
        category: 'Food & Dining',
        date: daysAgo(4),
        paymentMethod: 'Credit Card',
        notes: 'Dinner with college friends',
      },
      {
        user: user._id,
        title: 'City Power & Electric Bill',
        amount: 92.5,
        type: 'expense',
        category: 'Utilities',
        date: daysAgo(5),
        paymentMethod: 'Debit Card',
        notes: 'Monthly electric & heating',
      },
      {
        user: user._id,
        title: 'Gigabit Fiber Internet',
        amount: 65.0,
        type: 'expense',
        category: 'Utilities',
        date: daysAgo(8),
        paymentMethod: 'Debit Card',
        notes: 'Home internet provider',
      },
      {
        user: user._id,
        title: 'Gasoline Fill-up',
        amount: 54.2,
        type: 'expense',
        category: 'Transportation',
        date: daysAgo(6),
        paymentMethod: 'Debit Card',
        notes: 'Full tank for sedan',
      },
      {
        user: user._id,
        title: 'Trader Joe’s Pantry Staples',
        amount: 98.75,
        type: 'expense',
        category: 'Groceries',
        date: daysAgo(9),
        paymentMethod: 'Debit Card',
        notes: 'Snacks, coffee beans, and seasonings',
      },
      {
        user: user._id,
        title: 'Artisan Espresso & Pastry',
        amount: 16.5,
        type: 'expense',
        category: 'Food & Dining',
        date: daysAgo(7),
        paymentMethod: 'Credit Card',
        notes: 'Working from neighborhood cafe',
      },
      {
        user: user._id,
        title: 'Gym & Fitness Center Membership',
        amount: 75.0,
        type: 'expense',
        category: 'Health & Fitness',
        date: daysAgo(12),
        paymentMethod: 'Debit Card',
        notes: 'Monthly recurring gym access + sauna',
      },
      {
        user: user._id,
        title: 'Netflix & Spotify Premium',
        amount: 28.99,
        type: 'expense',
        category: 'Entertainment',
        date: daysAgo(14),
        paymentMethod: 'Credit Card',
        notes: 'Streaming entertainment services',
      },
      {
        user: user._id,
        title: 'Ergonomic Office Chair Cushion',
        amount: 64.99,
        type: 'expense',
        category: 'Shopping',
        date: daysAgo(15),
        paymentMethod: 'Credit Card',
        notes: 'Amazon work-from-home gear',
      },
      {
        user: user._id,
        title: 'Uber to Airport',
        amount: 42.5,
        type: 'expense',
        category: 'Transportation',
        date: daysAgo(18),
        paymentMethod: 'Credit Card',
        notes: 'Ride to regional terminal',
      },
      {
        user: user._id,
        title: 'System Design Online Course',
        amount: 89.0,
        type: 'expense',
        category: 'Education',
        date: daysAgo(20),
        paymentMethod: 'Credit Card',
        notes: 'Architecture & cloud computing masterclass',
      },

      // Past Months for realistic trend charts
      // Month -1
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5200.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(1, 1),
        paymentMethod: 'Bank Transfer',
        notes: 'Salary payment',
      },
      {
        user: user._id,
        title: 'Freelance Consulting',
        amount: 1200.0,
        type: 'income',
        category: 'Freelance',
        date: monthsAgo(1, 14),
        paymentMethod: 'Bank Transfer',
        notes: 'React migration consulting',
      },
      {
        user: user._id,
        title: 'Rent Payment',
        amount: 1550.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: monthsAgo(1, 2),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Grocery Supplies',
        amount: 440.0,
        type: 'expense',
        category: 'Groceries',
        date: monthsAgo(1, 10),
        paymentMethod: 'Debit Card',
      },
      {
        user: user._id,
        title: 'Dining Out & Takeaway',
        amount: 280.0,
        type: 'expense',
        category: 'Food & Dining',
        date: monthsAgo(1, 18),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        title: 'Weekend Getaway Hotel',
        amount: 320.0,
        type: 'expense',
        category: 'Travel',
        date: monthsAgo(1, 22),
        paymentMethod: 'Credit Card',
      },

      // Month -2
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5200.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(2, 1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Rent Payment',
        amount: 1550.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: monthsAgo(2, 2),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Groceries & Household',
        amount: 410.0,
        type: 'expense',
        category: 'Groceries',
        date: monthsAgo(2, 11),
        paymentMethod: 'Debit Card',
      },
      {
        user: user._id,
        title: 'Electronics Store - Monitor',
        amount: 380.0,
        type: 'expense',
        category: 'Shopping',
        date: monthsAgo(2, 19),
        paymentMethod: 'Credit Card',
      },

      // Month -3
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5200.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(3, 1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Performance Bonus',
        amount: 1800.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(3, 15),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Rent Payment',
        amount: 1550.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: monthsAgo(3, 2),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Groceries & Dining',
        amount: 620.0,
        type: 'expense',
        category: 'Groceries',
        date: monthsAgo(3, 12),
        paymentMethod: 'Debit Card',
      },

      // Month -4
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5200.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(4, 1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Rent & Living Expenses',
        amount: 2200.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: monthsAgo(4, 5),
        paymentMethod: 'Bank Transfer',
      },

      // Month -5
      {
        user: user._id,
        title: 'Monthly Salary - Senior Dev',
        amount: 5000.0,
        type: 'income',
        category: 'Salary',
        date: monthsAgo(5, 1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        title: 'Rent & Living Expenses',
        amount: 2150.0,
        type: 'expense',
        category: 'Housing & Rent',
        date: monthsAgo(5, 5),
        paymentMethod: 'Bank Transfer',
      },
    ];

    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} demo transactions.`);

    // Seed Category Budgets for the current month
    const targetMonth = currentMonth + 1;
    const targetYear = currentYear;

    const budgets = [
      {
        user: user._id,
        category: 'Housing & Rent',
        monthlyLimit: 1600,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Groceries',
        monthlyLimit: 500,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Food & Dining',
        monthlyLimit: 300,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Transportation',
        monthlyLimit: 200,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Utilities',
        monthlyLimit: 200,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Entertainment',
        monthlyLimit: 150,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Shopping',
        monthlyLimit: 250,
        month: targetMonth,
        year: targetYear,
      },
      {
        user: user._id,
        category: 'Health & Fitness',
        monthlyLimit: 100,
        month: targetMonth,
        year: targetYear,
      },
    ];

    await Budget.insertMany(budgets);
    console.log(`Inserted ${budgets.length} category budgets.`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
