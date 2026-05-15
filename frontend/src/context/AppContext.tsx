import { createContext, useContext } from 'react';

export interface Category {
  nombre: string;
  icono: string;
  color: string;
  es_default: boolean;
  limit?: number;
}

export interface Account {
  name: string;
  type: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  type: 'income' | 'expense';
  note?: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  color: string;
  icono: string;
}

export interface AppUser {
  name: string;
  email: string;
  currency: string;
  avatar: string;
}

export interface AlertSettings {
  budgetAlerts: boolean;
  unusualSpending: boolean;
  weeklyPredictions: boolean;
  goalNotifications: boolean;
}

export interface AppContextType {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  user: AppUser;
  alertSettings: AlertSettings;
  addCategory: (cat: Category) => boolean;
  deleteCategory: (nombre: string) => void;
  addAccount: (acc: Account) => boolean;
  deleteAccount: (name: string) => void;
  addTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: number) => void;
  updateAlertSettings: (settings: Partial<AlertSettings>) => void;
  updateUser: (userInfo: Partial<AppUser>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};