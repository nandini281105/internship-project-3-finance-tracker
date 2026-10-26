import React, { useState } from 'react';
import { PiggyBank, Plus, CheckCircle, AlertTriangle, AlertOctagon, Calendar, Trash2 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { BudgetProgressBar } from '../components/BudgetProgressBar';

const DEFAULT_EXPENSE_CATEGORIES = [
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

export const BudgetsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const { budgetsData, upsertBudget, deleteBudget, loadingBudgets } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: DEFAULT_EXPENSE_CATEGORIES[0],
    monthlyLimit: '',
  });
  const [saving, setSaving] = useState(false);

  const budgets = budgetsData?.budgets || [];
  const totalLimit = budgetsData?.totalBudgetLimit || 0;
  const totalSpent = budgetsData?.totalBudgetSpent || 0;
  const remainingTotal = totalLimit - totalSpent;
  const totalPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const limit = parseFloat(formData.monthlyLimit);
    if (isNaN(limit) || limit <= 0) return;

    setSaving(true);
    const res = await upsertBudget(formData.category, limit);
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      setFormData({ category: DEFAULT_EXPENSE_CATEGORIES[0], monthlyLimit: '' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monthly Budgets & Limits
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set spending caps per category and avoid overspending
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Set Category Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Budget Cap
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalLimit, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Across {budgets.length} categories</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Actual Spent This Month
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalSpent, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{totalPercent}% of allocated budget</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Remaining Budget
          </p>
          <h3 className={`text-2xl font-bold mt-1 ${remainingTotal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(remainingTotal, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {remainingTotal >= 0 ? 'Within budget parameters' : 'Over allocated limits'}
          </p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingBudgets ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm">
            Loading budgets...
          </div>
        ) : budgets.length > 0 ? (
          budgets.map((b) => (
            <BudgetProgressBar
              key={b._id}
              budget={b}
              onDelete={deleteBudget}
            />
          ))
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">
            <PiggyBank className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No budgets established yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add spending limits to stay on top of groceries, dining, entertainment and more.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              + Create First Budget
            </button>
          </div>
        )}
      </div>

      {/* Set Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Set Category Budget
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define the maximum target amount you plan to spend in this category per month.
            </p>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Limit ({currency})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 500"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
