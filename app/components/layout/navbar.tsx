'use client';

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useAdminLogout } from "@/hooks/useAdminAuth";

export default function Navbar() {
  const { logout } = useAdminLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const userName = user?.name || "مستخدم";
  const userRole = "مدير النظام";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between">

        {/* Left Side: Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/sayad-icon.png"
              alt="صياد السمك"
              fill
              className="object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900">
              صياد السمك
            </h1>
            <p className="text-xs text-gray-500">لوحة التحكم</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* User Profile - Desktop */}
          <div className="hidden sm:flex items-center gap-3 pl-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">
                {userName}
              </span>
              <span className="text-xs text-gray-500">{userRole}</span>
            </div>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-10 w-10 rounded-full ring-2 ring-gray-100 hover:ring-gray-200 transition-all cursor-pointer bg-gradient-to-br from-[#C41E3A] to-[#a01829] flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={userName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {userInitial}
                    </span>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" dir="rtl">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">{userRole}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Avatar */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="focus:outline-none"
            >
              <div className="h-9 w-9 rounded-full ring-2 ring-gray-100 hover:ring-gray-200 transition-all cursor-pointer bg-gradient-to-br from-[#C41E3A] to-[#a01829] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={userName}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {userInitial}
                  </span>
                )}
              </div>
            </button>

            {/* Mobile Dropdown */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-3 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50" dir="rtl">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}