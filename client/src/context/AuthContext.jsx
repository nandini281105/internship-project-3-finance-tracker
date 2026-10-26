import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ft_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ft_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [token]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.data);
          localStorage.setItem('ft_user', JSON.stringify(data.data));
        } else {
          // Token expired or invalid
          console.warn('Session expired, logging out');
          logout();
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: userToken, ...userData } = data.data;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('ft_token', userToken);
      localStorage.setItem('ft_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, currency = 'USD', monthlyBudgetGoal = 0) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, currency, monthlyBudgetGoal }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token: userToken, ...userData } = data.data;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('ft_token', userToken);
      localStorage.setItem('ft_user', JSON.stringify(userData));
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to create account.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
    toast.info('You have logged out.');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.data);
      localStorage.setItem('ft_user', JSON.stringify(data.data));
      toast.success('Profile updated successfully!');
      return { success: true, data: data.data };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
