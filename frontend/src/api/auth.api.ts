import { apiClient } from './config';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

// Регистрация пользователя
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
  
  // Сохраняем токен и данные пользователя
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Вход пользователя
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  
  // Сохраняем токен и данные пользователя
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Выход пользователя
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Получение профиля пользователя
export const getProfile = async (): Promise<{ user: User }> => {
  const response = await apiClient.get<{ user: User }>('/auth/profile');
  return response.data;
};

// Обновление профиля пользователя
export const updateProfile = async (userData: { username?: string; phone?: string }): Promise<{ user: User }> => {
  const response = await apiClient.put<{ user: User }>('/auth/profile', userData);
  
  // Обновляем данные пользователя в localStorage
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// Получение данных пользователя из localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};