'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { adminLogin, LoginPayload, LoginResponse } from '@/services/adminService';

export const useAdminLogin = () => {
  const mutateAsync = async (payload: LoginPayload): Promise<LoginResponse> => {
    const data = await adminLogin(payload);

    // حفظ الـ token
    Cookies.set('access_token', data.token.access_token, {
      expires: 7,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // حفظ بيانات المستخدم
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  };

  return {
    mutateAsync,
    isPending: false,
  };
};

// Hook للـ Logout
export const useAdminLogout = () => {
  const router = useRouter();

  const logout = () => {
    // حذف الـ token من الـ cookies
    Cookies.remove('access_token');
    
    // حذف بيانات المستخدم من localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // الانتقال لصفحة تسجيل الدخول
    router.push('/super-admin/login');
  };

  return { logout };
};