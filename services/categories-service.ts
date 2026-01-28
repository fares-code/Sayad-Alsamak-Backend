import axiosInstance from '@/lib/axiosInterceptor';
import { Category } from '@/types/category';

export interface CreateCategoryPayload {
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const getAllCategories = async (includeInactive?: boolean): Promise<ApiResponse<Category[]>> => {
  const params = includeInactive ? { includeInactive: true } : {};
  const { data } = await axiosInstance.get('/categories', { params });
  return data;
};

export const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  const { data } = await axiosInstance.get(`/categories/${id}`);
  return data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
  const { data } = await axiosInstance.post('/categories', payload);
  return data;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload
): Promise<ApiResponse<Category>> => {
  const { data } = await axiosInstance.patch(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const toggleCategoryActive = async (id: string): Promise<ApiResponse<Category>> => {
  const { data } = await axiosInstance.patch(`/categories/${id}/toggle-active`);
  return data;
};