import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import {
  ALERT_SETTINGS_KEY,
  clearSession,
  getStoredToken,
  getStoredUserId,
  storeSession,
} from '../api/api';
import {
  createAccountRequest,
  createBudgetRequest,
  createCategoryRequest,
  createGoalRequest,
  createTransactionRequest,
  deleteAccountRequest,
  deleteBudgetRequest,
  deleteCategoryRequest,
  deleteGoalRequest,
  deleteTransactionRequest,
  deleteUserRequest,
  getAccounts,
  getAdvice,
  getBudgetAlerts,
  getBudgets,
  getCategories,
  getGoals,
  getPrediction,
  getTransactions,
  getUser,
  loginRequest,
  registerRequest,
  updateBudgetRequest,
  updateUserRequest,
  type ApiAccount,
  type ApiBudget,
  type ApiBudgetAlert,
  type ApiCategory,
  type ApiGoal,
  type ApiPrediction,
  type ApiTransaction,
  type ApiUser,
} from '../api/finsmartApi';
import {
  AppContext,
  type Account,
  type AccountInput,
  type AdviceInsight,
  type AlertSettings,
  type AppUser,
  type Budget,
  type BudgetAlert,
  type Category,
  type CategoryInput,
  type Goal,
  type PredictionInsight,
  type Transaction,
  type TransactionInput,
} from './AppContext';

const defaultAlertSettings: AlertSettings = {
  budgetAlerts: true,
  unusualSpending: true,
  weeklyPredictions: false,
  goalNotifications: true,
};

const iconFixes: Record<string, string> = {
  'ðŸ”': '🍔',
  'ðŸš—': '🚗',
  'ðŸŽ®': '🎮',
  'ðŸ©º': '🩺',
  'ðŸ‘Ÿ': '👟',
  'ðŸ’¡': '💡',
  'ðŸ“•': '📚',
  'ðŸ“š': '📚',
  'ðŸ’°': '💰',
  'ðŸ“‚': '📂',
};

const typeToColor: Record<string, string> = {
  efectivo: 'bg-purple-600',
  debito: 'bg-blue-600',
  credito: 'bg-red-600',
  ahorro: 'bg-green-600',
};

const apiTypeToLabel: Record<string, string> = {
  efectivo: 'Efectivo',
  debito: 'Debito',
  credito: 'Credito',
  ahorro: 'Ahorro',
};

const labelToApiType: Record<string, 'efectivo' | 'debito' | 'credito' | 'ahorro'> = {
  Efectivo: 'efectivo',
  Debito: 'debito',
  Débito: 'debito',
  Credito: 'credito',
  Crédito: 'credito',
  Ahorro: 'ahorro',
};

const formatDate = (value: string) => value.slice(0, 10);
const normalizeIcon = (icon?: string | null) => (icon ? iconFixes[icon] ?? icon : '📂');

const getCurrentPeriod = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    fechaInicio: firstDay.toISOString().slice(0, 10),
    fechaFin: lastDay.toISOString().slice(0, 10),
  };
};

const buildUser = (user: ApiUser): AppUser => ({
  id: user.id,
  name: user.nombre,
  email: user.email,
  currency: user.moneda,
  avatar: '',
});

const buildCategories = (categories: ApiCategory[]): Category[] =>
  categories.map((category) => ({
    id: category.id,
    nombre: category.nombre,
    icono: normalizeIcon(category.icono),
    color: category.color ?? '#8B5CF6',
    es_default: category.es_default,
  }));

const buildAccounts = (accounts: ApiAccount[]): Account[] =>
  accounts.map((account) => ({
    id: account.id,
    name: account.nombre,
    type: apiTypeToLabel[account.tipo] ?? account.tipo,
    balance: account.saldo_actual,
    color: typeToColor[account.tipo] ?? 'bg-gray-600',
  }));

const buildTransactions = (
  transactions: ApiTransaction[],
  categories: Category[],
  accounts: Account[],
): Transaction[] =>
  transactions.map((transaction) => {
    const category = categories.find((item) => item.id === transaction.categoria_id);
    const account = accounts.find((item) => item.id === transaction.cuenta_id);
    const amount = transaction.tipo === 'gasto' ? -Math.abs(transaction.monto) : Math.abs(transaction.monto);

    return {
      id: transaction.id,
      name: transaction.nota?.trim() ? transaction.nota : category?.nombre ?? 'Movimiento',
      category: category?.nombre ?? 'Sin categoria',
      categoryId: transaction.categoria_id,
      amount,
      date: formatDate(transaction.fecha),
      account: account?.name ?? 'Sin cuenta',
      accountId: transaction.cuenta_id,
      type: transaction.tipo === 'gasto' ? 'expense' : 'income',
      note: transaction.nota ?? '',
    };
  });

const buildBudgets = (
  budgets: ApiBudget[],
  categories: Category[],
  transactions: Transaction[],
): Budget[] =>
  budgets.map((budget) => {
    const category = categories.find((item) => item.id === budget.categoria_id);
    const spent = transactions
      .filter((transaction) => transaction.categoryId === budget.categoria_id && transaction.type === 'expense')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    return {
      id: budget.id,
      categoryId: budget.categoria_id,
      category: category?.nombre ?? 'Sin categoria',
      limit: budget.monto_limite,
      spent,
      color: category?.color ?? '#8B5CF6',
      icono: category?.icono ?? '📂',
      periodo: budget.periodo,
      fechaInicio: formatDate(budget.fecha_inicio),
      fechaFin: formatDate(budget.fecha_fin),
    };
  });

const buildPrediction = (prediction: ApiPrediction | null): PredictionInsight | null =>
  prediction
    ? {
        prediccion: prediction.prediccion,
        mensaje: prediction.mensaje,
        promedioSemanal: prediction.promedio_semanal,
        tendencia: prediction.tendencia,
      }
    : null;

const buildAlerts = (alerts: ApiBudgetAlert[]): BudgetAlert[] =>
  alerts.map((alert) => ({
    categoriaId: alert.categoria_id,
    categoriaNombre: alert.categoria_nombre,
    mensaje: alert.mensaje,
    gastadoActual: alert.gastado_actual,
    limite: alert.limite,
    proyeccionTotal: alert.proyeccion_total,
  }));

const buildGoals = (goals: ApiGoal[]): Goal[] =>
  goals.map((goal) => ({
    id: goal.id,
    name: goal.nombre,
    target: goal.monto_objetivo,
    current: goal.monto_actual,
    color: goal.color,
  }));

const readStoredAlertSettings = (): AlertSettings => {
  const raw = localStorage.getItem(ALERT_SETTINGS_KEY);
  if (!raw) {
    return defaultAlertSettings;
  }

  try {
    return { ...defaultAlertSettings, ...JSON.parse(raw) };
  } catch {
    return defaultAlertSettings;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [prediction, setPrediction] = useState<PredictionInsight | null>(null);
  const [advice, setAdvice] = useState<AdviceInsight | null>(null);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(readStoredAlertSettings);

  const resetState = () => {
    setCategories([]);
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);
    setUser(null);
    setPrediction(null);
    setAdvice(null);
    setBudgetAlerts([]);
    setGoals([]);
  };

  const refreshInsights = useCallback(async () => {
    if (!getStoredToken()) {
      setPrediction(null);
      setAdvice(null);
      setBudgetAlerts([]);
      return;
    }

    try {
      const [predictionData, adviceData, budgetAlertsData] = await Promise.all([
        getPrediction(),
        getAdvice(),
        getBudgetAlerts(),
      ]);

      setPrediction(buildPrediction(predictionData));
      setAdvice({
        mensaje: adviceData.mensaje ?? null,
        consejo: adviceData.consejo,
        categoriaId: adviceData.categoria_id ?? null,
        categoriaNombre: adviceData.categoria_nombre ?? null,
        ahorroEstimado: adviceData.ahorro_estimado ?? null,
      });
      setBudgetAlerts(buildAlerts(budgetAlertsData));
    } catch {
      setPrediction(null);
      setAdvice(null);
      setBudgetAlerts([]);
    }
  }, []);

  const refreshData = useCallback(async () => {
    const storedUserId = getStoredUserId();
    const token = getStoredToken();

    if (!token || !storedUserId) {
      resetState();
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [userData, categoryData, accountData, budgetData, transactionData, goalData] = await Promise.all([
        getUser(storedUserId),
        getCategories(),
        getAccounts(),
        getBudgets(),
        getTransactions(),
        getGoals(),
      ]);

      const nextCategories = buildCategories(categoryData);
      const nextAccounts = buildAccounts(accountData);
      const nextTransactions = buildTransactions(transactionData, nextCategories, nextAccounts);
      const nextBudgets = buildBudgets(budgetData, nextCategories, nextTransactions);

      setUser(buildUser(userData));
      setCategories(nextCategories);
      setAccounts(nextAccounts);
      setTransactions(nextTransactions);
      setBudgets(nextBudgets);
      setGoals(buildGoals(goalData));
      setIsAuthenticated(true);

      await refreshInsights();
    } catch {
      clearSession();
      resetState();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [refreshInsights]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(alertSettings));
  }, [alertSettings]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginRequest({ email, contrasena: password });
      storeSession(response.access_token, response.user_id);
      setIsAuthenticated(true);
      await refreshData();
      return { success: true };
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { detail?: string } } }).response?.data?.detail === 'string'
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'No se pudo iniciar sesion';

      return { success: false, message };
    }
  };

  const register = async (payload: { name: string; email: string; password: string; currency: string }) => {
    try {
      await registerRequest({
        nombre: payload.name,
        email: payload.email,
        contrasena: payload.password,
        moneda: payload.currency,
      });

      return await login(payload.email, payload.password);
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { detail?: string } } }).response?.data?.detail === 'string'
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'No se pudo registrar la cuenta';

      return { success: false, message };
    }
  };

  const logout = () => {
    clearSession();
    resetState();
    setIsAuthenticated(false);
  };

  const addCategory = async (category: CategoryInput) => {
    const normalizedName = category.nombre.trim();
    const existingCategory = categories.find((item) => item.nombre.toLowerCase() === normalizedName.toLowerCase());
    const customCount = categories.filter((item) => !item.es_default).length;

    if (!existingCategory && customCount >= 3) {
      return false;
    }

    try {
      let categoryId = existingCategory?.id;

      if (!existingCategory) {
        const createdCategory = await createCategoryRequest({
          nombre: normalizedName,
          icono: category.icono,
          color: category.color,
          es_default: false,
        });
        categoryId = createdCategory.data.id;
      }

      if (!categoryId) {
        return false;
      }

      if (category.limit && category.limit > 0) {
        const existingBudget = budgets.find((item) => item.categoryId === categoryId);
        const { fechaInicio, fechaFin } = getCurrentPeriod();

        if (existingBudget) {
          await updateBudgetRequest(existingBudget.id, {
            monto_limite: category.limit,
            periodo: 'mensual',
            fecha_fin: fechaFin,
          });
        } else {
          await createBudgetRequest({
            categoria_id: categoryId,
            monto_limite: category.limit,
            periodo: 'mensual',
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          });
        }
      }

      await refreshData();
      return true;
    } catch {
      return false;
    }
  };

  const deleteCategory = async (nombre: string) => {
    const category = categories.find((item) => item.nombre === nombre);
    if (!category) {
      return;
    }

    try {
      const relatedBudgets = budgets.filter((item) => item.categoryId === category.id);
      await Promise.all(relatedBudgets.map((budget) => deleteBudgetRequest(budget.id)));

      if (!category.es_default) {
        await deleteCategoryRequest(category.id);
      }

      await refreshData();
    } catch {
      // keep current UI state if the deletion fails
    }
  };

  const addAccount = async (account: AccountInput) => {
    if (accounts.length >= 3) {
      return false;
    }

    try {
      const amount = Math.abs(account.balance);
      await createAccountRequest({
        nombre: account.name.trim(),
        tipo: labelToApiType[account.type] ?? 'efectivo',
        saldo_inicial: amount,
        saldo_actual: amount,
      });
      await refreshData();
      return true;
    } catch {
      return false;
    }
  };

  const deleteAccount = async (name: string) => {
    const account = accounts.find((item) => item.name === name);
    if (!account) {
      return;
    }

    try {
      await deleteAccountRequest(account.id);
      await refreshData();
    } catch {
      // keep current UI state if the deletion fails
    }
  };

  const addTransaction = async (transaction: TransactionInput) => {
    const category = categories.find((item) => item.nombre === transaction.category);
    const account = accounts.find((item) => item.name === transaction.account);

    if (!category || !account) {
      return;
    }

    await createTransactionRequest({
      categoria_id: category.id,
      cuenta_id: account.id,
      monto: Math.abs(transaction.amount),
      tipo: transaction.type === 'expense' ? 'gasto' : 'ingreso',
      nota: transaction.note?.trim() ? transaction.note.trim() : transaction.name.trim(),
      fecha: transaction.date,
    });

    await refreshData();
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionRequest(id);
      await refreshData();
    } catch {
      // ignore and keep current UI state
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'color'> & { color?: string }) => {
    try {
      await createGoalRequest({
        nombre: goal.name.trim(),
        monto_objetivo: goal.target,
        monto_actual: goal.current,
        color: goal.color ?? '#8B5CF6',
      });
      await refreshData();
      return true;
    } catch {
      return false;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await deleteGoalRequest(id);
      await refreshData();
    } catch {
      // ignore and keep current UI state
    }
  };

  const updateAlertSettings = (settings: Partial<AlertSettings>) => {
    setAlertSettings((current) => ({ ...current, ...settings }));
  };

  const updateUser = async (userInfo: Partial<AppUser>) => {
    if (!user) {
      return false;
    }

    try {
      await updateUserRequest(user.id, {
        nombre: userInfo.name ?? user.name,
        email: userInfo.email ?? user.email,
        moneda: userInfo.currency ?? user.currency,
      });
      await refreshData();
      return true;
    } catch {
      return false;
    }
  };

  const deleteCurrentUser = async () => {
    if (!user) {
      return false;
    }

    try {
      await deleteUserRequest(user.id);
      logout();
      return true;
    } catch {
      return false;
    }
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
        isAuthenticated,
        isLoading,
        prediction,
        advice,
        budgetAlerts,
        goals,
        login,
        register,
        logout,
        refreshData,
        refreshInsights,
        addCategory,
        deleteCategory,
        addAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
        addGoal,
        deleteGoal,
        updateAlertSettings,
        updateUser,
        deleteCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
