// src/hooks/useContactInfo.ts

'use client';

import { useState } from 'react';
import {
  getActiveContactInfo,
  getContactInfoById,
  createContactInfo,
  updateContactInfo,
  toggleContactInfoActive,
} from '@/services/contact-info-service';
import { ContactInfo, CreateContactInfoPayload, UpdateContactInfoPayload } from '@/types/contact-info';

// Hook لجلب المعلومات النشطة
export const useGetActiveContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActiveContactInfo();
      setContactInfo(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المعلومات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    contactInfo,
    loading,
    error,
    fetchContactInfo,
  };
};

// Hook لجلب معلومات بالـ ID
export const useGetContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getContactInfoById(id);
      setContactInfo(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب المعلومات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    contactInfo,
    loading,
    error,
    fetchContactInfo,
  };
};

// Hook لإنشاء معلومات
export const useCreateContactInfo = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateContactInfoPayload) => {
    setLoading(true);
    try {
      const response = await createContactInfo(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء المعلومات';
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

// Hook لتحديث المعلومات
export const useUpdateContactInfo = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateContactInfoPayload;
  }) => {
    setLoading(true);
    try {
      const response = await updateContactInfo(id, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث المعلومات';
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

// Hook لتبديل حالة المعلومات
export const useToggleContactInfoActive = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await toggleContactInfoActive(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تغيير حالة المعلومات';
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