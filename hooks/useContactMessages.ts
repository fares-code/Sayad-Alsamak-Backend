// src/hooks/useContactMessages.ts

'use client';

import { useState } from 'react';
import {
  getAllContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  markAsRead,
  markAsReplied,
  deleteContactMessage,
  getContactMessagesStats,
  CreateContactMessagePayload,
  UpdateContactMessagePayload,
} from '@/services/contact-messages-service';
import { ContactMessage, ContactMessageStats } from '@/types/contact-message';

// Hook لجلب كل الرسائل
export const useGetContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (filters?: { isRead?: boolean; isReplied?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllContactMessages(filters);
      setMessages(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الرسائل';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
  };
};

// Hook لجلب رسالة واحدة
export const useGetContactMessage = () => {
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getContactMessageById(id);
      setMessage(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الرسالة';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    loading,
    error,
    fetchMessage,
  };
};

// Hook لإنشاء رسالة (من الموقع)
export const useCreateContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateContactMessagePayload) => {
    setLoading(true);
    try {
      const response = await createContactMessage(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إرسال الرسالة';
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

// Hook لتحديث رسالة
export const useUpdateContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateContactMessagePayload;
  }) => {
    setLoading(true);
    try {
      const response = await updateContactMessage(id, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث الرسالة';
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

// Hook لتعليم كمقروءة
export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await markAsRead(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تعليم الرسالة';
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

// Hook لتعليم كمردود عليها
export const useMarkAsReplied = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await markAsReplied(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تعليم الرسالة';
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

// Hook لحذف رسالة
export const useDeleteContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteContactMessage(id);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في حذف الرسالة';
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

// Hook للإحصائيات
export const useContactMessagesStats = () => {
  const [stats, setStats] = useState<ContactMessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getContactMessagesStats();
      setStats(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الإحصائيات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};