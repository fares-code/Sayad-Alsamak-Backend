"use client";

import DashboardLayout from "@/app/components/layout/dashboard-layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود token
    const token = Cookies.get('access_token');
    
    if (!token) {
      // لو مفيش token، ارجع لصفحة اللوجن فوراً
      router.replace('/super-admin/login');
      setIsLoading(false);
      return;
    }

    // لو في token، اسمح بعرض المحتوى
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  // لو لسه بيتحقق أو مش مصرح
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}