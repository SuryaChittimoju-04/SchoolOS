
import React, { createContext, useContext, useState, useEffect } from 'react';
import { School } from '../types';
// Fixed: STORAGE_KEYS is defined in constants.ts, not types.ts
import { STORAGE_KEYS, PLAN_LIMITS } from '../constants';

interface AuthContextType {
  user: School | null;
  login: (email: string, name: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<School>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fixed: Use STORAGE_KEYS.USER instead of hardcoded string
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newUser: School = {
      id: 'school_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      planType: 'free',
      postsGeneratedThisMonth: 0,
      planLimit: PLAN_LIMITS.free,
    };
    setUser(newUser);
    // Fixed: Use STORAGE_KEYS.USER instead of hardcoded string
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const register = (email: string, name: string) => {
    const newUser: School = {
      id: 'school_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      planType: 'free',
      postsGeneratedThisMonth: 0,
      planLimit: PLAN_LIMITS.free,
    };
    setUser(newUser);
    // Fixed: Use STORAGE_KEYS.USER instead of hardcoded string
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    // Fixed: Use STORAGE_KEYS.USER instead of hardcoded string
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateUser = (updates: Partial<School>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Fixed: Use STORAGE_KEYS.USER instead of hardcoded string
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
