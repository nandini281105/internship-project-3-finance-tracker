// Currency symbols and codes
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'AU$',
  JPY: '¥',
};

export const formatCurrency = (amount, currency = 'USD') => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    const sym = CURRENCY_SYMBOLS[currency] || '$';
    return `${sym}${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
};

// Vibrant, accessible palette for charts
export const CATEGORY_COLORS = {
  // Income
  'Salary': '#10b981',       // Emerald
  'Freelance': '#06b6d4',    // Cyan
  'Investments': '#8b5cf6',  // Violet
  'Business': '#3b82f6',     // Blue
  'Gifts': '#ec4899',        // Pink
  'Rental Income': '#14b8a6',// Teal
  'Other Income': '#64748b', // Slate

  // Expenses
  'Food & Dining': '#f97316',// Orange
  'Groceries': '#eab308',    // Amber
  'Housing & Rent': '#ef4444',// Red
  'Utilities': '#0284c7',    // Sky
  'Transportation': '#6366f1',// Indigo
  'Entertainment': '#a855f7', // Purple
  'Health & Fitness': '#10b981',// Green
  'Shopping': '#ec4899',     // Pink
  'Education': '#f59e0b',    // Amber
  'Travel': '#06b6d4',       // Cyan
  'Personal Care': '#d946ef', // Fuchsia
  'Bills & Fees': '#64748b',  // Slate
  'Other Expense': '#94a3b8',// Gray
};

export const DEFAULT_CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'
];

export const getCategoryColor = (category, index = 0) => {
  return CATEGORY_COLORS[category] || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
};
