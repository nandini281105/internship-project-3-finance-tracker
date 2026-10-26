import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Edit3, 
  CreditCard,
  Calendar,
  Tag
} from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const isIncome = transaction.type === 'income';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm gap-3">
      
      {/* Left: Category Badge & Details */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
            isIncome
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="w-5 h-5" />
          ) : (
            <ArrowDownRight className="w-5 h-5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              {transaction.title}
            </h4>
            <span
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-white shadow-xs"
              style={{ backgroundColor: getCategoryColor(transaction.category) }}
            >
              {transaction.category}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(transaction.date)}
            </span>
            {transaction.paymentMethod && (
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                <CreditCard className="w-3 h-3" />
                {transaction.paymentMethod}
              </span>
            )}
            {transaction.notes && (
              <span className="truncate max-w-[200px] text-slate-400 italic">
                "{transaction.notes}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
        <span
          className={`text-base sm:text-lg font-bold tracking-tight ${
            isIncome
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, currency)}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Transaction"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Delete transaction "${transaction.title}"?`)) {
                  onDelete(transaction._id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
