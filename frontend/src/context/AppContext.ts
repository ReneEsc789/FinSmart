import { createContext, useContext } from 'react';

export interface Category {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  es_default: boolean;
}

export interface CategoryInput {
  nombre: string;
  icono: string;
  color: string;
  limit?: number;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
}

export interface AccountInput {
  name: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  amount: number;
  date: string;
  account: string;
  accountId: string;
  type: 'income' | 'expense';
  note?: string;
}

export interface TransactionInput {
  name: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  type: 'income' | 'expense';
  note?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icono: string;
  periodo: 'semanal' | 'mensual';
  fechaInicio: string;
  fechaFin: string;
}

export interface AppUser {
  id: string;
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

export interface PredictionInsight {
  prediccion: number | null;
  mensaje: string;
  promedioSemanal: number | null;
  tendencia: string | null;
}

export interface AdviceInsight {
  mensaje?: string | null;
  consejo: string;
  categoriaId?: string | null;
  categoriaNombre?: string | null;
  ahorroEstimado?: number | null;
}

export interface BudgetAlert {
  categoriaId: string;
  categoriaNombre: string;
  mensaje: string;
  gastadoActual: number;
  limite: number;
  proyeccionTotal: number;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface AppContextType {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  user: AppUser | null;
  alertSettings: AlertSettings;
  isAuthenticated: boolean;
  isLoading: boolean;
  prediction: PredictionInsight | null;
  advice: AdviceInsight | null;
  budgetAlerts: BudgetAlert[];
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (payload: { name: string; email: string; password: string; currency: string }) => Promise<AuthResult>;
  logout: () => void;
  refreshData: () => Promise<void>;
  refreshInsights: () => Promise<void>;
  addCategory: (cat: CategoryInput) => Promise<boolean>;
  deleteCategory: (nombre: string) => Promise<void>;
  addAccount: (acc: AccountInput) => Promise<boolean>;
  deleteAccount: (name: string) => Promise<void>;
  addTransaction: (tx: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateAlertSettings: (settings: Partial<AlertSettings>) => void;
  updateUser: (userInfo: Partial<AppUser>) => Promise<boolean>;
  deleteCurrentUser: () => Promise<boolean>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};
