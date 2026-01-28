'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { cartCount } = useCart(); 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/contact', label: 'تواصل معنا' },
    { href: '/products', label: 'المنتجات' },
    { href: '/about', label: 'من نحن' },
    { href: '/', label: 'الرئيسية' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'shadow-lg border-b border-gray-100'
        : 'shadow-sm border-b border-gray-200'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* زر اطلب بالجملة - يسار */}
          <div className="flex-shrink-0 hidden lg:block">
            <Link 
              href="/products?type=WHOLESALE"
              className="group relative px-8 py-3 border-2 border-[#C41E3A] text-[#C41E3A] rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-red inline-block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#C41E3A] to-[#A01829] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                اطلب بالجملة
              </span>
            </Link>
          </div>

          {/* قائمة التنقل - الوسط */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center text-[#737373]">

            {/* السلة */}
            <Link
              href="/cart"
              className="group flex items-center gap-2.5 text-gray-700 hover:text-[#C41E3A] transition-all duration-300 relative"
            >
              <div className="relative">
                <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-red-50 transition-all duration-300">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C41E3A] to-[#A01829] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-red animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-semibold group-hover:translate-x-1 transition-transform duration-300">
                السلة
              </span>
            </Link>

            {/* خط فاصل مع تأثير */}
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* روابط التنقل */}
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative font-bold text-base transition-all duration-300 py-2 ${isActive(link.href)
                  ? 'text-[#C41E3A]'
                  : 'text-gray-700 hover:text-[#C41E3A]'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C41E3A] to-[#A01829] transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            ))}
          </div>

          {/* الشعار - يمين */}
          <div className="flex-shrink-0 relative group">
            <Link href="/" className="flex items-center">
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/sayad-icon.png"
                  alt="Sayad Alsahra - صياد الصحراء"
                  width={140}
                  height={70}
                  className="h-16 w-auto object-contain transition-transform duration-300"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#C41E3A] transition-all duration-300 hover:bg-red-50 rounded-xl"
            aria-label="قائمة التنقل"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current top-3 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
            </div>
          </button>

        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-100 mt-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:bg-red-50 hover:translate-x-2 ${isActive(link.href)
                  ? 'text-[#C41E3A] bg-red-50'
                  : 'text-gray-700 hover:text-[#C41E3A]'
                  }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/cart"
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-[#C41E3A] hover:bg-red-50 rounded-xl transition-all duration-300 hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <div className="p-2 rounded-lg bg-gray-100">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C41E3A] to-[#A01829] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-red">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold">السلة</span>
            </Link>

            <Link
              href="/products?type=WHOLESALE"
              className="block w-full mt-3 px-6 py-3 bg-gradient-to-r from-[#C41E3A] to-[#A01829] text-white rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-red-lg hover:scale-[1.02] active:scale-95 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              اطلب بالجملة
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;