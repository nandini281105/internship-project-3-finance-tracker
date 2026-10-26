import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { token, isAuthenticated, getHeaders } = useAuth();
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 15,
  });
  const [stats, setStats] = useState(null);
  const [budgetsData, setBudgetsData] = useState({
    budgets: [],
    totalBudgetLimit: 0,
    totalBudgetSpent: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'All',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 15,
  });

  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingBudgets, setLoadingBudgets] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/transactions/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Transactions with current filters
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoadingTransactions(true);
    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const res = await fetch(`/api/transactions?${params.toString()}`, {
        headers: getHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions(data.data);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, [isAuthenticated, token, filters, getHeaders]);

  // Fetch Stats Summary for Charts and Metric cards
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoadingStats(true);
    try {
      const res = await fetch('/api/transactions/stats/summary', {
        headers: getHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [isAuthenticated, token, getHeaders]);

  // Fetch Budgets
  const fetchBudgets = useCallback(async (month, year) => {
    if (!isAuthenticated || !token) return;
    setLoadingBudgets(true);
    try {
      const now = new Date();
      const m = month || now.getMonth() + 1;
      const y = year || now.getFullYear();

      const res = await fetch(`/api/budgets?month=${m}&year=${y}`, {
        headers: getHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBudgetsData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoadingBudgets(false);
    }
  }, [isAuthenticated, token, getHeaders]);

  // Initial load when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchStats();
      fetchBudgets();
    }
  }, [isAuthenticated, fetchTransactions, fetchStats, fetchBudgets]);

  // Add Transaction
  const addTransaction = async (formData) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add transaction');
      }

      toast.success('Transaction added successfully!');
      // Refresh transactions and stats
      fetchTransactions();
      fetchStats();
      fetchBudgets();
      return { success: true, data: data.data };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update Transaction
  const updateTransaction = async (id, formData) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update transaction');
      }

      toast.success('Transaction updated!');
      fetchTransactions();
      fetchStats();
      fetchBudgets();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete transaction');
      }

      toast.success('Transaction deleted');
      fetchTransactions();
      fetchStats();
      fetchBudgets();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Save / Update Category Budget
  const upsertBudget = async (category, monthlyLimit, month, year) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category, monthlyLimit, month, year }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save budget');
      }

      toast.success(`Budget updated for ${category}`);
      fetchBudgets(month, year);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete budget');
      }

      toast.success('Budget removed');
      fetchBudgets();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  // Export CSV download
  const exportCSV = async () => {
    try {
      const res = await fetch('/api/transactions/export/csv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to download CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance_tracker_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Transactions CSV exported successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV');
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // If changing filter options (not page), reset page to 1
      ...(newFilters.page === undefined ? { page: 1 } : {}),
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'All',
      search: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 15,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        pagination,
        stats,
        budgetsData,
        categories,
        filters,
        loadingTransactions,
        loadingStats,
        loadingBudgets,
        fetchTransactions,
        fetchStats,
        fetchBudgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        upsertBudget,
        deleteBudget,
        exportCSV,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
