// src/services/contact-info-service.ts

import axiosInstance from '@/lib/axiosInterceptor';
import {
  ContactInfo,
  CreateContactInfoPayload,
  UpdateContactInfoPayload,
} from '@/types/contact-info';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const getActiveContactInfo = async (): Promise<ApiResponse<ContactInfo>> => {
  const { data } = await axiosInstance.get('/contact-info/active');
  return data;
};

export const getContactInfoById = async (id: string): Promise<ApiResponse<ContactInfo>> => {
  const { data } = await axiosInstance.get(`/contact-info/${id}`);
  return data;
};

export const createContactInfo = async (
  payload: CreateContactInfoPayload,
): Promise<ApiResponse<ContactInfo>> => {
  const { data } = await axiosInstance.post('/contact-info', payload);
  return data;
};

export const updateContactInfo = async (
  id: string,
  payload: UpdateContactInfoPayload,
): Promise<ApiResponse<ContactInfo>> => {
  const { data } = await axiosInstance.patch(`/contact-info/${id}`, payload);
  return data;
};

export const toggleContactInfoActive = async (
  id: string,
): Promise<ApiResponse<ContactInfo>> => {
  const { data } = await axiosInstance.patch(`/contact-info/${id}/toggle-active`);
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