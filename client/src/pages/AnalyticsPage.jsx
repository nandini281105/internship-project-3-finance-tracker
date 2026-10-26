import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { PieChart, TrendingUp, DollarSign, Activity } from 'lucide-react';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const { stats } = useTransactions();

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const netBalance = stats?.netBalance || 0;
  const savingsRate = stats?.savingsRate || 0;
  const categoryBreakdown = stats?.expenseCategoryBreakdown || [];
  const monthlyTrends = stats?.monthlyTrends || [];
  const totalTxCount = stats?.totalTransactions || 0;

  const avgExpense = totalTxCount > 0 && totalExpense > 0 
    ? (totalExpense / categoryBreakdown.reduce((acc, c) => acc + c.count, 0) || 1).toFixed(2)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Financial Analytics & Intelligence
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Deep-dive into spending patterns, historical trends, and savings metrics
        </p>
      </div>

      {/* Top Level Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Savings Efficiency
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {savingsRate}%
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {savingsRate >= 20 ? '🔥 Excellent savings rate!' : 'Target at least 20% savings'}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Inflow
          </span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalIncome, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Cumulative earned revenue</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Outflow
          </span>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalExpense, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Cumulative expenditure</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Expense Ticket
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(avgExpense, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Per recorded expense item</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Share Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Expense Allocation
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Percentage proportion across spending categories
          </p>
          <CategoryPieChart data={categoryBreakdown} />
        </div>

        {/* Monthly Trend Area / Bar */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Income vs Outgo Timeline
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Comparing monthly revenues against expenses
          </p>
          <MonthlyTrendChart data={monthlyTrends} />
        </div>

      </div>

      {/* Top Spending Categories Leaderboard Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Spending Category Ranking
          </h3>
          <p className="text-xs text-slate-500">
            Ordered by total expenditure amount
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categoryBreakdown.map((item, idx) => (
            <div key={item.category} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-bold text-slate-400">
                  #{idx + 1}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                />
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {item.category}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {formatCurrency(item.total, currency)}
                </p>
                <p className="text-xs text-slate-500">
                  {item.percentage}% of expenses
                </p>
              </div>
            </div>
          ))}

          {categoryBreakdown.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No expense categories available to display yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
