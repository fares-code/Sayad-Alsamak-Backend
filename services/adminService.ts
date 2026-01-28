import axiosInstance from '@/lib/axiosInterceptor';
import Cookies from 'js-cookie';
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: 'ADMIN';
    avatar: string | null;
    isActive: boolean;
  };
  token: {
    access_token: string;
  };
}

export const adminLogin = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/login', payload);
  return data;
};

export const adminLogout = () => {
  Cookies.remove('access_token');
  localStorage.removeItem('user');
  window.location.href = '/super-admin/login';
};