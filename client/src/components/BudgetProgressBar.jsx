import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle, AlertOctagon, Trash2 } from 'lucide-react';

export const BudgetProgressBar = ({ budget, onDelete }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const { category, monthlyLimit, spent, remaining, percentUsed, status } = budget;

  const statusConfig = {
    normal: {
      barColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400',
      icon: CheckCircle,
      text: 'On Track',
    },
    warning: {
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400',
      icon: AlertTriangle,
      text: 'Near Limit',
    },
    exceeded: {
      barColor: 'bg-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400',
      icon: AlertOctagon,
      text: 'Exceeded',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.normal;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            {category}
          </h4>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${currentStatus.badgeBg}`}>
            <StatusIcon className="w-3 h-3" />
            {currentStatus.text}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(budget._id)}
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Delete Budget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden my-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${currentStatus.barColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {/* Details Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div>
          <span className="font-medium text-slate-900 dark:text-white">
            {formatCurrency(spent, currency)}
          </span>{' '}
          spent of {formatCurrency(monthlyLimit, currency)}
        </div>
        <div className="font-semibold">
          {percentUsed}%
        </div>
      </div>

      <div className="mt-1 text-right text-[11px]">
        {remaining >= 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {formatCurrency(remaining, currency)} remaining
          </span>
        ) : (
          <span className="text-rose-600 dark:text-rose-400 font-medium">
            {formatCurrency(Math.abs(remaining), currency)} over budget!
          </span>
        )}
      </div>
    </div>
  );
};
