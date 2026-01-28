// src/hooks/useAboutUs.ts
'use client';

import { useState } from 'react';
import {
  getActiveAboutUs,
  getAboutUsById,
  createAboutUs,
  updateAboutUs,
  toggleAboutUsActive,
} from '@/services/about-us-service';
import { AboutUs, CreateAboutUsPayload, UpdateAboutUsPayload } from '@/types/about-us';

// Hook لجلب المحتوى النشط
export const useGetActiveAboutUs = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutUs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActiveAboutUs();
      setAboutUs(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المحتوى';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    aboutUs,
    loading,
    error,
    fetchAboutUs,
  };
};

// Hook لجلب محتوى بالـ ID
export const useGetAboutUs = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutUs = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAboutUsById(id);
      setAboutUs(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المحتوى';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    aboutUs,
    loading,
    error,
    fetchAboutUs,
  };
};

// Hook لإنشاء محتوى
export const useCreateAboutUs = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateAboutUsPayload) => {
    setLoading(true);
    try {
      const response = await createAboutUs(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء المحتوى';
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

// Hook لتحديث المحتوى
export const useUpdateAboutUs = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateAboutUsPayload;
  }) => {
    setLoading(true);
    try {
      const response = await updateAboutUs(id, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث المحتوى';
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

// Hook لتبديل حالة المحتوى
export const useToggleAboutUsActive = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await toggleAboutUsActive(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تغيير حالة المحتوى';
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