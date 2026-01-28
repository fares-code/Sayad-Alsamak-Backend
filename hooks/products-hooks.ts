'use client';

import { useState } from 'react';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  CreateProductPayload,
  UpdateProductPayload,
  Product,
  FilterProductParams,
} from '@/services/products-service';

export const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts = async (filters?: FilterProductParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts(filters);
      setProducts(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المنتجات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, pagination, fetchProducts };
};

export const useGetProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      setProduct(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المنتج';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, fetchProduct };
};

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateProductPayload) => {
    setLoading(true);
    try {
      const response = await createProduct(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء المنتج';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({ id, payload }: { id: string; payload: UpdateProductPayload }) => {
    setLoading(true);
    try {
      const response = await updateProduct(id, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث المنتج';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteProduct(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في حذف المنتج';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};
