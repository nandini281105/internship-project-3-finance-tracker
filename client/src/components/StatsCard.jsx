import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const StatsCard = ({ title, amount, type = 'neutral', subtitle, icon: Icon, badgeText, badgePositive }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const typeConfig = {
    balance: {
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      textColor: amount >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400',
    },
    income: {
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    neutral: {
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      textColor: 'text-slate-900 dark:text-white',
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.neutral;

  return (
    <div className={`p-5 rounded-2xl border ${currentConfig.border} ${currentConfig.bg} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentConfig.iconBg} transition-transform group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${currentConfig.textColor}`}>
          {formatCurrency(amount, currency)}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              {subtitle}
            </span>
          )}

          {badgeText && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-semibold ${
                badgePositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400'
              }`}
            >
              {badgePositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
