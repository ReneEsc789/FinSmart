import api from '../api/api';

export interface LoginPayload {
  email: string;
  contrasena: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  contrasena: string;
  moneda?: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user_id: string;
  rol_id: number;
}

export interface ApiUser {
  id: string;
  nombre: string;
  email: string;
  moneda: string;
  rol_id: number;
  fecha_creacion: string;
}

export interface ApiCategory {
  id: string;
  nombre: string;
  icono: string | null;
  color: string | null;
  es_default: boolean;
  usuario_id: string | null;
}

export interface ApiAccount {
  id: string;
  usuario_id: string;
  nombre: string;
  tipo: 'efectivo' | 'debito' | 'credito' | 'ahorro';
  saldo_inicial: number;
  saldo_actual: number;
  fecha_creacion: string;
}

export interface ApiBudget {
  id: string;
  usuario_id: string;
  categoria_id: string;
  monto_limite: number;
  periodo: 'semanal' | 'mensual';
  fecha_inicio: string;
  fecha_fin: string;
}

export interface ApiTransaction {
  id: string;
  usuario_id: string;
  cuenta_id: string;
  categoria_id: string;
  monto: number;
  tipo: 'gasto' | 'ingreso';
  nota: string | null;
  fecha: string;
  fecha_creacion: string;
}

export interface ApiPrediction {
  prediccion: number | null;
  mensaje: string;
  promedio_semanal: number | null;
  tendencia: string | null;
}

export interface ApiAdvice {
  mensaje?: string | null;
  consejo: string;
  categoria_id?: string | null;
  categoria_nombre?: string | null;
  ahorro_estimado?: number | null;
}

export interface ApiBudgetAlert {
  categoria_id: string;
  categoria_nombre: string;
  mensaje: string;
  gastado_actual: number;
  limite: number;
  proyeccion_total: number;
}

export interface ApiGoal {
  id: string;
  usuario_id: string;
  nombre: string;
  monto_objetivo: number;
  monto_actual: number;
  color: string;
  fecha_creacion: string;
}

export interface ApiTransactionListResponse {
  items: ApiTransaction[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

type MessageEnvelope<T> = {
  message: string;
  data: T;
};

export const loginRequest = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await api.post<MessageEnvelope<ApiUser>>('/auth/registro', payload);
  return response.data;
};

export const getUser = async (userId: string) => {
  const response = await api.get<ApiUser>(`/usuarios/${userId}`);
  return response.data;
};

export const updateUserRequest = async (
  userId: string,
  payload: Partial<Pick<ApiUser, 'nombre' | 'email' | 'moneda'>> & {
    contrasena_actual?: string;
    contrasena_nueva?: string;
    confirmar_contrasena?: string;
  },
) => {
  const response = await api.patch<MessageEnvelope<ApiUser>>(`/usuarios/${userId}`, payload);
  return response.data;
};

export const deleteUserRequest = async (userId: string) => {
  const response = await api.delete<MessageEnvelope<ApiUser>>(`/usuarios/${userId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get<ApiCategory[]>('/categorias/');
  return response.data;
};

export const createCategoryRequest = async (payload: Pick<ApiCategory, 'nombre' | 'icono' | 'color' | 'es_default'>) => {
  const response = await api.post<MessageEnvelope<ApiCategory>>('/categorias/', payload);
  return response.data;
};

export const deleteCategoryRequest = async (categoryId: string) => {
  const response = await api.delete(`/categorias/${categoryId}`);
  return response.data;
};

export const getAccounts = async () => {
  const response = await api.get<ApiAccount[]>('/cuentas/');
  return response.data;
};

export const createAccountRequest = async (payload: Pick<ApiAccount, 'nombre' | 'tipo' | 'saldo_inicial' | 'saldo_actual'>) => {
  const response = await api.post<MessageEnvelope<ApiAccount>>('/cuentas/', payload);
  return response.data;
};

export const deleteAccountRequest = async (accountId: string) => {
  const response = await api.delete(`/cuentas/${accountId}`);
  return response.data;
};

export const getBudgets = async () => {
  const response = await api.get<ApiBudget[]>('/presupuestos/');
  return response.data;
};

export const createBudgetRequest = async (payload: Pick<ApiBudget, 'categoria_id' | 'monto_limite' | 'periodo' | 'fecha_inicio' | 'fecha_fin'>) => {
  const response = await api.post<MessageEnvelope<ApiBudget>>('/presupuestos/', payload);
  return response.data;
};

export const updateBudgetRequest = async (budgetId: string, payload: Partial<Pick<ApiBudget, 'monto_limite' | 'periodo' | 'fecha_fin'>>) => {
  const response = await api.patch<MessageEnvelope<ApiBudget>>(`/presupuestos/${budgetId}`, payload);
  return response.data;
};

export const deleteBudgetRequest = async (budgetId: string) => {
  const response = await api.delete(`/presupuestos/${budgetId}`);
  return response.data;
};

export const getTransactions = async (params?: { limit?: number; offset?: number }) => {
  const response = await api.get<ApiTransactionListResponse>('/transacciones/', { params });
  return response.data;
};

export const createTransactionRequest = async (payload: Pick<ApiTransaction, 'categoria_id' | 'cuenta_id' | 'monto' | 'tipo' | 'nota' | 'fecha'>) => {
  const response = await api.post<MessageEnvelope<ApiTransaction>>('/transacciones/', payload);
  return response.data;
};

export const updateTransactionRequest = async (transactionId: string, payload: Partial<Pick<ApiTransaction, 'categoria_id' | 'cuenta_id' | 'monto' | 'tipo' | 'nota' | 'fecha'>>) => {
  const response = await api.patch<MessageEnvelope<ApiTransaction>>(`/transacciones/${transactionId}`, payload);
  return response.data;
};

export const deleteTransactionRequest = async (transactionId: string) => {
  const response = await api.delete(`/transacciones/${transactionId}`);
  return response.data;
};

export const getPrediction = async () => {
  const response = await api.get<ApiPrediction>('/ml/prediccion');
  return response.data;
};

export const getAdvice = async () => {
  const response = await api.get<ApiAdvice>('/ml/consejos');
  return response.data;
};

export const getBudgetAlerts = async () => {
  const response = await api.get<ApiBudgetAlert[]>('/ml/alertas-presupuesto');
  return response.data;
};

export const getGoals = async () => {
  const response = await api.get<ApiGoal[]>('/metas-financieras/');
  return response.data;
};

export const createGoalRequest = async (payload: Pick<ApiGoal, 'nombre' | 'monto_objetivo' | 'monto_actual' | 'color'>) => {
  const response = await api.post<MessageEnvelope<ApiGoal>>('/metas-financieras/', payload);
  return response.data;
};

export const deleteGoalRequest = async (goalId: string) => {
  const response = await api.delete(`/metas-financieras/${goalId}`);
  return response.data;
};
