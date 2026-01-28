// src/services/about-us-service.ts
import axiosInstance from '@/lib/axiosInterceptor';
import { AboutUs, CreateAboutUsPayload, UpdateAboutUsPayload } from '@/types/about-us';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// جلب المحتوى النشط
export const getActiveAboutUs = async (): Promise<ApiResponse<AboutUs>> => {
  const { data } = await axiosInstance.get('/about-us/active');
  return data;
};

// جلب محتوى بالـ ID
export const getAboutUsById = async (id: string): Promise<ApiResponse<AboutUs>> => {
  const { data } = await axiosInstance.get(`/about-us/${id}`);
  return data;
};

// إنشاء محتوى جديد
export const createAboutUs = async (payload: CreateAboutUsPayload): Promise<ApiResponse<AboutUs>> => {
  const { data } = await axiosInstance.post('/about-us', payload);
  return data;
};

// تحديث المحتوى
export const updateAboutUs = async (
  id: string,
  payload: UpdateAboutUsPayload
): Promise<ApiResponse<AboutUs>> => {
  const { data } = await axiosInstance.patch(`/about-us/${id}`, payload);
  return data;
};

// تفعيل/إلغاء تفعيل
export const toggleAboutUsActive = async (id: string): Promise<ApiResponse<AboutUs>> => {
  const { data } = await axiosInstance.patch(`/about-us/${id}/toggle-active`);
  return data;
};

// تحويل الصورة لـ base64
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