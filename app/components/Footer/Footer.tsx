import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="bg-[#F8F5F0] text-gray-700 pt-16 pb-6 font-noto-kufi w-full" dir="rtl">
            <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-full">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

                    {/* Column 1 - Logo and Contact Info */}
                    <div className="order-1">
                        <div className="mb-6">
                            <Image
                                src="/sayad-icon.png"
                                alt="Sayad Alsamak Logo"
                                width={150}
                                height={60}
                                className="mb-4"
                            />
                            <p className="text-sm leading-relaxed text-gray-600">
                                يوفر لنا أفضل منتجات بحرية بجودة عالية و أسعار متناسبة للجميع و تعاقد
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MdLocationOn className="text-[#C41E3A] mt-1 flex-shrink-0" size={18} />
                                <p className="leading-relaxed text-gray-600">
                                    مدينة 10 رمضان - المنطقة الصناعية رقم 2 - القطعة رقم 33/34، محافظة الشرقية - جمهورية مصر العربية
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <MdEmail className="text-[#C41E3A] flex-shrink-0" size={18} />
                                <a
                                    href="mailto:Sayad.Alsamak@gmail.com"
                                    className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600"
                                >
                                    Sayad.Alsamak@gmail.com
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <MdPhone className="text-[#C41E3A] flex-shrink-0" size={18} />
                                <a
                                    href="tel:01212756565"
                                    className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600"
                                >
                                    012 12756565
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - روابط مهمة */}
                    <div className="order-2">
                        <h3 className="text-[#C41E3A] font-bold text-lg mb-6">
                            روابط مهمة
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                   الرئيسية
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                   المنتجات
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                             تواصل معنا
                                </Link>
                            </li>
                         
                          
                         
                            
                            <li>
                                <Link href="/about" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                  من نحن
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - الأصناف */}
                    <div className="order-3">
                        <h3 className="text-[#C41E3A] font-bold text-lg mb-6">
                            الأصناف
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/category/frozen" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                    مجمدة
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/fresh" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                    سمك بلدي
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/imported" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                    خدماتنا
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/canada" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                    كانادا
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/services" className="hover:text-[#C41E3A] transition-colors duration-300 text-gray-600">
                                    خدمات
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - تواصل معنا */}
                    <div className="order-4">
                        <h3 className="text-[#C41E3A] font-bold text-lg mb-6">
                            تواصل معنا لطلبات الجملة
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 text-gray-600">
                            إرسال طلب
                        </p>
                        <div className="space-y-4">
                            {/* Social Media Icons */}
                            <div className="flex gap-3">
                                <Link
                                    href="https://facebook.com"
                                    target="_blank"
                                    className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-[#C41E3A] hover:text-white hover:border-[#C41E3A] transition-all duration-300"
                                >
                                    <FaFacebookF size={14} />
                                </Link>
                                <Link
                                    href="https://twitter.com"
                                    target="_blank"
                                    className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-[#C41E3A] hover:text-white hover:border-[#C41E3A] transition-all duration-300"
                                >
                                    <FaTwitter size={14} />
                                </Link>
                                <Link
                                    href="https://pinterest.com"
                                    target="_blank"
                                    className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-[#C41E3A] hover:text-white hover:border-[#C41E3A] transition-all duration-300"
                                >
                                    <FaPinterestP size={14} />
                                </Link>
                                <Link
                                    href="https://instagram.com"
                                    target="_blank"
                                    className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-[#C41E3A] hover:text-white hover:border-[#C41E3A] transition-all duration-300"
                                >
                                    <FaInstagram size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-300 pt-6">
                    <div className="flex justify-center items-center text-sm text-gray-600">
                        <span className="text-[#C41E3A] font-semibold">صياد السمك,</span>
                        <p className="text-center">
                            جميع الحقوق محفوظة  ©2025
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;