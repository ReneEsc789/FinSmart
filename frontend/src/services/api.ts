import axios from 'axios';

export const SESSION_TOKEN_KEY = 'finsmart_token';
export const SESSION_USER_ID_KEY = 'finsmart_user_id';
export const ALERT_SETTINGS_KEY = 'finsmart_alert_settings';

export const getStoredToken = () => localStorage.getItem(SESSION_TOKEN_KEY);
export const getStoredUserId = () => localStorage.getItem(SESSION_USER_ID_KEY);

export const storeSession = (token: string, userId: string) => {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_USER_ID_KEY, userId);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_USER_ID_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
