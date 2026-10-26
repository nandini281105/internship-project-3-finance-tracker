import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Receipt
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { TransactionItem } from '../components/TransactionItem';

export const TransactionsPage = ({ onOpenAddModal, onEditTransaction }) => {
  const {
    transactions,
    pagination,
    categories,
    filters,
    updateFilters,
    resetFilters,
    deleteTransaction,
    exportCSV,
    loadingTransactions,
  } = useTransactions();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateFilters({ page: newPage });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transaction History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, categorize, and export your personal records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search title or notes..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
            >
              <option value="all">All Types (Income & Expense)</option>
              <option value="income">Income Only (+)</option>
              <option value="expense">Expense Only (-)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start & End */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => updateFilters({ startDate: e.target.value })}
              className="w-1/2 px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="From date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => updateFilters({ endDate: e.target.value })}
              className="w-1/2 px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="To date"
            />
          </div>

        </div>

        {/* Clear Filters Indicator */}
        {(filters.search || filters.type !== 'all' || filters.category !== 'All' || filters.startDate || filters.endDate) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Filtering active</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {loadingTransactions ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionItem
              key={tx._id}
              transaction={tx}
              onEdit={onEditTransaction}
              onDelete={deleteTransaction}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">
            <Receipt className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No transactions found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or add a new transaction.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              + Add Transaction
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{transactions.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{pagination.totalCount}</strong> transactions
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-semibold text-slate-900 dark:text-white px-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
