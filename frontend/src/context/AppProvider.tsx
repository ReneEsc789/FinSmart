import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppContext, type Account, type Budget, type Category, type Transaction } from './AppContext';

const defaultCategories: Category[] = [
  { nombre: 'Comida', icono: '🍔', color: '#EF4444', es_default: true },
  { nombre: 'Transporte', icono: '🚗', color: '#3B82F6', es_default: true },
  { nombre: 'Entretenimiento', icono: '🎮', color: '#8B5CF6', es_default: true },
  { nombre: 'Salud', icono: '🩺', color: '#10B981', es_default: true },
  { nombre: 'Ropa', icono: '👟', color: '#F97316', es_default: true },
  { nombre: 'Servicios', icono: '💡', color: '#EAB308', es_default: true },
  { nombre: 'Educacion', icono: '📚', color: '#6366F1', es_default: true },
  { nombre: 'Ahorro', icono: '💰', color: '#22C55E', es_default: true },
];

const initialAccounts: Account[] = [
  { name: 'Nomina BBVA', type: 'Debito', balance: 18500.5, color: 'bg-blue-600' },
  { name: 'Ahorros', type: 'Ahorro', balance: 5000, color: 'bg-green-600' },
];

const initialTransactions: Transaction[] = [
  { id: 1, name: 'Supermercado', category: 'Comida', amount: -1250, date: '2024-03-04', account: 'Nomina BBVA', type: 'expense' },
  { id: 2, name: 'Pago de nomina', category: 'Salario', amount: 15000, date: '2024-03-03', account: 'Nomina BBVA', type: 'income' },
  { id: 3, name: 'Gasolina', category: 'Transporte', amount: -800, date: '2024-03-02', account: 'Ahorros', type: 'expense' },
  { id: 4, name: 'Netflix', category: 'Entretenimiento', amount: -219, date: '2024-03-01', account: 'Ahorros', type: 'expense' },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [user, setUser] = useState({
    name: 'Rene Escalante',
    email: 'rene.escalantec01@gmail.com',
    currency: 'MXN',
    avatar: '',
  });
  const [alertSettings, setAlertSettings] = useState({
    budgetAlerts: true,
    unusualSpending: true,
    weeklyPredictions: false,
    goalNotifications: true,
  });

  const budgets: Budget[] = categories.map((cat) => {
    const spent = transactions
      .filter((transaction) => transaction.category === cat.nombre && transaction.type === 'expense')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    return {
      category: cat.nombre,
      limit: cat.limit || 5000,
      spent,
      color: cat.color,
      icono: cat.icono,
    };
  });

  const addCategory = (category: Category) => {
    const customCount = categories.filter((item) => !item.es_default).length;

    if (customCount >= 3) {
      return false;
    }

    setCategories((current) => [...current, { ...category, es_default: false }]);
    return true;
  };

  const deleteCategory = (nombre: string) => {
    setCategories((current) => current.filter((category) => category.nombre !== nombre));
  };

  const addAccount = (account: Account) => {
    const addedCount = accounts.length - initialAccounts.length;

    if (addedCount >= 3) {
      return false;
    }

    setAccounts((current) => [...current, account]);
    return true;
  };

  const deleteAccount = (name: string) => {
    setAccounts((current) => current.filter((account) => account.name !== name));
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((current) => [transaction, ...current]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  };

  const updateAlertSettings = (settings: Partial<typeof alertSettings>) => {
    setAlertSettings((current) => ({ ...current, ...settings }));
  };

  const updateUser = (userInfo: Partial<typeof user>) => {
    setUser((current) => ({ ...current, ...userInfo }));
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        accounts,
        transactions,
        budgets,
        user,
        alertSettings,
        addCategory,
        deleteCategory,
        addAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
        updateAlertSettings,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};