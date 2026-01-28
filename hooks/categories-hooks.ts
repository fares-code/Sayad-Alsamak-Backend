'use client';

import { useState } from 'react';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/services/categories-service';
import { Category } from '@/types/category';

// Hook لجلب كل الفئات
export const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (includeInactive?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories(includeInactive);
      setCategories(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الفئات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
};

// Hook لجلب فئة واحدة
export const useGetCategory = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategoryById(id);
      setCategory(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الفئة';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    category,
    loading,
    error,
    fetchCategory,
  };
};

// Hook لإنشاء فئة
export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateCategoryPayload) => {
    setLoading(true);
    try {
      const response = await createCategory(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء الفئة';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
  };
};

// Hook لتحديث فئة
export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateCategoryPayload;
  }) => {
    setLoading(true);
    try {
      const response = await updateCategory(id, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث الفئة';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
  };
};

// Hook لحذف فئة
export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteCategory(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في حذف الفئة';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
  };
};

// Hook لتبديل حالة الفئة
export const useToggleCategoryActive = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await toggleCategoryActive(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تغيير حالة الفئة';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
  };
};