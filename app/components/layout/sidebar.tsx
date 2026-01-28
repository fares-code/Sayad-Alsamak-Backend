// src/components/dashboard/Sidebar.tsx
'use client'

import { LayoutDashboard, Users, LogOut, Menu, ShoppingCart, ListOrdered, Package, Banknote, X, Info, Mail, Phone, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { useAdminLogout } from "@/hooks/useAdminAuth";
import Cookies from 'js-cookie';

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const fullPathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAdminLogout();

  const links = [
    { href: '/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/homepage', label: 'الصفحة الرئيسية', icon: <Home size={16} /> },
    { href: '/dashboard/about', label: 'صفحة عن الشركة', icon: <Info size={16} /> },// جديد
    { href: '/dashboard/contact-info', label: ' صفحة معلومات الاتصال', icon: <Phone size={16} /> },
    { href: '/dashboard/products', label: 'المنتجات', icon: <Package size={16} /> },
    { href: '/dashboard/categories', label: 'الفئات', icon: <ShoppingCart size={16} /> },
    { href: '/dashboard/orders', label: 'الطلبات', icon: <ListOrdered size={16} /> },
    { href: '/dashboard/contact-messages', label: 'رسائل التواصل', icon: <Mail size={16} /> },
    // جديد

  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const token = Cookies.get('access_token');

    if (!token) {
      router.replace('/super-admin/login');
      return;
    }

    router.push(href);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [fullPathname]);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full justify-between bg-white">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between p-4" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/sayad-icon.png"
                alt="صياد السمك"
                fill
                className="object-contain"
              />
            </div>
            {(open || isMobile) && (
              <span className="font-bold text-lg text-[#C41E3A]">صياد السمك</span>
            )}
          </div>

          {isMobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4">
          <div className="flex flex-col gap-2">
            {links.map(link => {
              const isActive = fullPathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                >
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-[#C41E3A] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    dir="rtl"
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {(open || isMobile) && <span>{link.label}</span>}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          dir="rtl"
        >
          <LogOut size={16} />
          {(open || isMobile) && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="h-6 w-6 text-[#C41E3A]" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <SidebarContent isMobile={true} />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed top-0 right-0 h-screen bg-white shadow-lg transition-all duration-300 z-40 ${open ? 'w-64' : 'w-20'
          }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}