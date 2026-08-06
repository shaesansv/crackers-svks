import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [user, setUser] = useState<User | null>(null);

  const logout = React.useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
      fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session invalid');
      })
      .then(data => {
        setUser({
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          role: data.role
        });
      })
      .catch(() => {
        logout();
      });
    } else {
      localStorage.removeItem('adminToken');
      setUser(null);
    }
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error?.message || 'Login failed');
    }

    if (data.user && data.user.role !== 'SUPER ADMIN' && data.user.role !== 'ADMIN') {
      throw new Error('Access denied: Admin role required');
    }

    setToken(data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
