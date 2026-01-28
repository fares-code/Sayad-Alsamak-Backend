'use client';

import { useState } from 'react';
import {
  getHomepageContent,
  updateHomepageContent,
  updateHomepageContentWithImages,
  createHomepageContent,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getHomepageCategories,
  getAllHomepageData,
  getProductsByCategory,
} from '@/services/homepage-service';
import {
  HomepageContent,
  Product,
  Category,
  HomepageData,
  ProductFilters,
  ApiResponse,
} from '@/types/homepage';

// Homepage Content Hook
export const useHomepageContent = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHomepageContent();
      setContent(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب محتوى الصفحة الرئيسية';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, fetchContent };
};

// Featured Products Hook
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure limit is within valid range
      const safeFilters = {
        ...filters,
        limit: filters?.limit ? Math.min(Math.max(filters.limit, 1), 50) : undefined
      };
      
      const response = await getFeaturedProducts(safeFilters);
      setProducts(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المنتجات المميزة';
      setError(errorMessage);
      // Don't throw error to prevent breaking the UI
      console.error('Featured products error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
};

// Best Sellers Hook
export const useBestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure limit is within valid range
      const safeFilters = {
        ...filters,
        limit: filters?.limit ? Math.min(Math.max(filters.limit, 1), 50) : undefined
      };
      
      const response = await getBestSellers(safeFilters);
      setProducts(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الأكثر مبيعاً';
      setError(errorMessage);
      // Don't throw error to prevent breaking the UI
      console.error('Best sellers error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
};

// New Arrivals Hook
export const useNewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNewArrivals(filters);
      setProducts(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الوافدين الجدد';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
};

// Categories Hook
export const useHomepageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (options?: { includeInactive?: boolean; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure limit is within valid range
      const safeOptions = {
        ...options,
        limit: options?.limit ? Math.min(Math.max(options.limit, 1), 100) : undefined
      };
      
      const response = await getHomepageCategories(safeOptions);
      setCategories(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الأقسام';
      setError(errorMessage);
      // Don't throw error to prevent breaking the UI
      console.error('Categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, fetchCategories };
};

// Homepage Content Management Hook for Dashboard
export const useHomepageContentManagement = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHomepageContent();
      setContent(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب محتوى الصفحة الرئيسية';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id: string, data: Partial<HomepageContent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateHomepageContent(id, data);
      setContent(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث محتوى الصفحة الرئيسية';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateContentWithImages = async (id: string, data: Partial<HomepageContent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateHomepageContentWithImages(id, data);
      setContent(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث محتوى الصفحة الرئيسية';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (data: Partial<HomepageContent>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createHomepageContent(data);
      setContent(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء محتوى الصفحة الرئيسية';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    content, 
    loading, 
    error, 
    fetchContent, 
    updateContent, 
    updateContentWithImages,
    createContent 
  };
};

// Products by Category Hook
export const useProductsByCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsByCategory = async (slug: string, filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductsByCategory(slug, filters);
      setProducts(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب منتجات القسم';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProductsByCategory };
};
