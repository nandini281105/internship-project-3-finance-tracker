import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  Plus, 
  Receipt, 
  ArrowRight,
  PiggyBank
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { StatsCard } from '../components/StatsCard';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { TransactionItem } from '../components/TransactionItem';
import { BudgetProgressBar } from '../components/BudgetProgressBar';

export const DashboardPage = ({ onOpenAddModal, onEditTransaction, onNavigateTab }) => {
  const { user } = useAuth();
  const { 
    stats, 
    budgetsData, 
    deleteTransaction, 
    loadingStats 
  } = useTransactions();

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const netBalance = stats?.netBalance || 0;
  const savingsRate = stats?.savingsRate || 0;
  const recentTransactions = stats?.recentTransactions || [];
  const categoryBreakdown = stats?.expenseCategoryBreakdown || [];
  const monthlyTrends = stats?.monthlyTrends || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-emerald-100 text-xs sm:text-sm font-medium tracking-wide uppercase">
            Financial Dashboard
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Hello, {user?.name || 'Friend'} 👋
          </h2>
          <p className="text-emerald-100/90 text-sm mt-1 max-w-md">
            Here is your financial snapshot. Track your cash flow, analyze expenses, and stay on budget.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-semibold text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Net Balance"
          amount={netBalance}
          type="balance"
          subtitle="All-time savings"
          icon={Wallet}
          badgeText={netBalance >= 0 ? 'Surplus' : 'Deficit'}
          badgePositive={netBalance >= 0}
        />
        <StatsCard
          title="Total Income"
          amount={totalIncome}
          type="income"
          subtitle="Earned revenue"
          icon={ArrowUpRight}
          badgeText="Inflow"
          badgePositive={true}
        />
        <StatsCard
          title="Total Expenses"
          amount={totalExpense}
          type="expense"
          subtitle="Spent out"
          icon={ArrowDownRight}
          badgeText="Outflow"
          badgePositive={false}
        />
        <StatsCard
          title="Savings Rate"
          amount={savingsRate}
          type="neutral"
          subtitle="Of income saved"
          icon={Percent}
          badgeText={`${savingsRate}%`}
          badgePositive={savingsRate > 20}
        />
      </div>

      {/* Visual Charts Grid: Category Pie & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Expenses by Category
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribution of overall spending
                </p>
              </div>
            </div>
            <CategoryPieChart data={categoryBreakdown} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>{categoryBreakdown.length} active categories</span>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Detailed breakdown <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Monthly Trends (Income vs Expenses) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Monthly Cash Flow Trends
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Income vs expense over the past 6 months
                </p>
              </div>
            </div>
            <MonthlyTrendChart data={monthlyTrends} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated monthly totals</span>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View all transactions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Transactions & Active Budget Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Recent Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest 5 entries in your tracker
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <TransactionItem
                  key={tx._id}
                  transaction={tx}
                  onEdit={onEditTransaction}
                  onDelete={deleteTransaction}
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No recent transactions yet. Click "+ Add Transaction" to start!
              </div>
            )}
          </div>
        </div>

        {/* Budget Glance (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Monthly Budget Goals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category limits for current month
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('budgets')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {budgetsData?.budgets && budgetsData.budgets.length > 0 ? (
              budgetsData.budgets.slice(0, 3).map((b) => (
                <BudgetProgressBar key={b._id} budget={b} />
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No monthly budgets set. Set targets to keep expenses on track!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
