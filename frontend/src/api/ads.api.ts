import { apiClient } from './config';
import { Ad, AdsResponse, AdFormData, AdFilters } from '../types';

// Получение всех объявлений с фильтрами
export const getAds = async (filters: AdFilters & { page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.location) params.append('location', filters.location);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await apiClient.get<AdsResponse>(`/ads?${params.toString()}`);
  return response.data;
};

// Получение объявления по ID
export const getAdById = async (id: string) => {
  const response = await apiClient.get<Ad>(`/ads/${id}`);
  return response.data;
};

// Создание нового объявления
export const createAd = async (adData: AdFormData) => {
  const formData = new FormData();
  
  formData.append('title', adData.title);
  formData.append('description', adData.description);
  formData.append('price', adData.price.toString());
  formData.append('category', adData.category);
  formData.append('location', adData.location);
  
  // Добавляем изображения
  if (adData.images) {
    Array.from(adData.images).forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await apiClient.post<Ad>('/ads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Обновление объявления
export const updateAd = async (id: string, adData: Partial<AdFormData>) => {
  const formData = new FormData();
  
  if (adData.title) formData.append('title', adData.title);
  if (adData.description) formData.append('description', adData.description);
  if (adData.price) formData.append('price', adData.price.toString());
  if (adData.category) formData.append('category', adData.category);
  if (adData.location) formData.append('location', adData.location);
  
  // Добавляем новые изображения
  if (adData.images) {
    Array.from(adData.images).forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await apiClient.put<Ad>(`/ads/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Удаление объявления
export const deleteAd = async (id: string) => {
  const response = await apiClient.delete(`/ads/${id}`);
  return response.data;
};

// Получение объявлений пользователя
export const getUserAds = async (page = 1, limit = 12) => {
  const response = await apiClient.get<AdsResponse>(`/ads/user/my?page=${page}&limit=${limit}`);
  return response.data;
};

// Получение категорий
export const getCategories = async () => {
  const response = await apiClient.get<string[]>('/ads/categories');
  return response.data;
};