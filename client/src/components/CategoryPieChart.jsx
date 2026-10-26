import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { PieChart as PieIcon } from 'lucide-react';

export const CategoryPieChart = ({ data = [] }) => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
        <PieIcon className="w-12 h-12 mb-2 stroke-1" />
        <p className="text-sm font-medium">No expense records found yet</p>
        <p className="text-xs text-slate-400">Add an expense to view category distribution</p>
      </div>
    );
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill || getCategoryColor(item.category) }}
            />
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {item.category}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>Spent:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(item.total, currency)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-slate-500 dark:text-slate-400 mt-0.5">
            <span>Share:</span>
            <span>{item.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getCategoryColor(entry.category, index)}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
