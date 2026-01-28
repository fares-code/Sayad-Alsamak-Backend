'use client';

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminLogin } from "@/hooks/useAdminAuth";
import Cookies from 'js-cookie';

export default function AdminLoginPage() {
  const router = useRouter();
  const { mutateAsync } = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من وجود token عند تحميل الصفحة
  useEffect(() => {
    const token = Cookies.get('access_token');
    
    if (token) {
      // لو في token، يعني مسجل دخول بالفعل
      router.replace('/dashboard');
    }
  }, [router]);

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await toast.promise(
        mutateAsync({ email, password }),
        {
          loading: "جاري تسجيل الدخول...",
          success: "تم تسجيل الدخول بنجاح 🎉",
          error: (err: any) =>
            err?.response?.data?.message ||
            "خطأ في البريد الإلكتروني أو كلمة المرور",
        }
      );

      router.replace("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center" dir="rtl">
      {/* الصورة الخلفية */}
      <Image
        src="/values-1.jpg"
        alt="صياد السمك - تسجيل الدخول"
        fill
        className="object-cover"
        priority
      />

      {/* طبقة التعتيم */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Card تسجيل الدخول */}
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl relative z-10 bg-white">
        {/* اللوجو */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-32 h-20 mb-4">
            <Image
              src="/sayad-icon.png"
              alt="صياد السمك"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-[#C41E3A] font-bold text-2xl">صياد السمك</h1>
          <p className="text-gray-500 text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            تسجيل دخول الإدارة
          </h2>
          <p className="text-sm text-gray-500">
            أدخل بياناتك للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block text-right">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="admin@sayadsamak.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#C41E3A] focus:outline-none rounded-lg text-right"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#C41E3A] focus:outline-none rounded-lg text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-600">تذكرني</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
          جميع الحقوق محفوظة © {new Date().getFullYear()} صياد السمك
        </div>
      </div>
    </div>
  );
}