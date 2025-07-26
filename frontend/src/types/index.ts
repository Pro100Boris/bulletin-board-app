// Типы для пользователя
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

// Типы для объявления
export interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  user: {
    _id: string;
    username: string;
    phone?: string;
  };
  status: 'active' | 'sold' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Типы для создания/редактирования объявления
export interface AdFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: FileList;
}

// Типы для аутентификации
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Типы для пагинации
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AdsResponse {
  ads: Ad[];
  pagination: Pagination;
}

// Типы для фильтров
export interface AdFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}

// Категории объявлений
export const AD_CATEGORIES = [
  'Недвижимость',
  'Транспорт',
  'Работа',
  'Услуги',
  'Электроника',
  'Для дома',
  'Хобби',
  'Животные',
  'Мода'
] as const;

export type AdCategory = typeof AD_CATEGORIES[number];