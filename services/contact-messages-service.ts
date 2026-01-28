// src/services/contact-messages-service.ts

import axiosInstance from '@/lib/axiosInterceptor';
import {
  ContactMessage,
  CreateContactMessagePayload,
  UpdateContactMessagePayload,
  ContactMessageStats,
} from '@/types/contact-message';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export type { CreateContactMessagePayload, UpdateContactMessagePayload, ContactMessageStats };

export const getAllContactMessages = async (filters?: {
  isRead?: boolean;
  isReplied?: boolean;
}): Promise<ApiResponse<ContactMessage[]>> => {
  const params: any = {};
  if (filters?.isRead !== undefined) params.isRead = filters.isRead;
  if (filters?.isReplied !== undefined) params.isReplied = filters.isReplied;

  const { data } = await axiosInstance.get('/contact-messages', { params });
  return data;
};

export const getContactMessageById = async (
  id: string,
): Promise<ApiResponse<ContactMessage>> => {
  const { data } = await axiosInstance.get(`/contact-messages/${id}`);
  return data;
};

export const createContactMessage = async (
  payload: CreateContactMessagePayload,
): Promise<ApiResponse<ContactMessage>> => {
  const { data } = await axiosInstance.post('/contact-messages', payload);
  return data;
};

export const updateContactMessage = async (
  id: string,
  payload: UpdateContactMessagePayload,
): Promise<ApiResponse<ContactMessage>> => {
  const { data } = await axiosInstance.patch(`/contact-messages/${id}`, payload);
  return data;
};

export const markAsRead = async (id: string): Promise<ApiResponse<ContactMessage>> => {
  const { data } = await axiosInstance.patch(`/contact-messages/${id}/mark-read`);
  return data;
};

export const markAsReplied = async (id: string): Promise<ApiResponse<ContactMessage>> => {
  const { data } = await axiosInstance.patch(`/contact-messages/${id}/mark-replied`);
  return data;
};

export const deleteContactMessage = async (id: string): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.delete(`/contact-messages/${id}`);
  return data;
};

export const getContactMessagesStats = async (): Promise<ApiResponse<ContactMessageStats>> => {
  const { data } = await axiosInstance.get('/contact-messages/stats');
  return data;
};