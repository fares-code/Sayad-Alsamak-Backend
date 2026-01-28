'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { useGetActiveContactInfo } from '@/hooks/useContactInfo';
import { useCreateContactMessage } from '@/hooks/useContactMessages';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Import Leaflet dynamically to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg"></div>
});

const ContactUsComponents = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const { contactInfo, loading, fetchContactInfo } = useGetActiveContactInfo();
  const { mutateAsync: createMessage, isPending } = useCreateContactMessage();
console.log(contactInfo);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMessage(formData);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      toast.success('تم إرسال رسالتك بنجاح!');
    } catch (error: any) {
      toast.error(error.message || 'فشل في إرسال الرسالة');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C41E3A]" />
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">لا يوجد محتوى متاح</p>
          <p className="text-gray-500">يرجى إضافة معلومات الاتصال من لوحة التحكم</p>
        </div>
      </div>
    );
  }

  const currentContactInfo = contactInfo;

  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <section className="relative h-[350px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentContactInfo.heroImage}
            alt={currentContactInfo.heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{currentContactInfo.heroTitle}</h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto text-[#B7BBC1]">
           {currentContactInfo.heroDescription}
          </p>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12 bg-gray-50 rounded-2xl">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-xl rounded-lg overflow-hidden">
            
            {/* Left Side - Map */}
            <div className="order-2 lg:order-1 z-1">
              <div className="h-[855px]">
                <MapComponent />
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="order-1 lg:order-2 bg-white p-6" dir="rtl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">تواصل معنا</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                    الاسم بالكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                    placeholder="رقم الهاتف"
                    required
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right resize-none"
                    placeholder="اكتب رسالتك هنا"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#C40D14] hover:bg-[#a01829] text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-300 text-sm disabled:opacity-50"
                >
                  {isPending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>

              {/* Contact Info in Form */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">معلومات الاتصال</h3>
                
                <div className="space-y-3 text-sm" dir='rtl'>
                  <div className="flex items-start gap-3 text-right">
                    <MdLocationOn className="text-[#C41E3A] mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-gray-600 leading-relaxed">
                      {currentContactInfo.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-right">
                    <MdEmail className="text-[#C41E3A] flex-shrink-0" size={18} />
                    <a href={`mailto:${currentContactInfo.email}`} className="text-gray-600 hover:text-[#C41E3A]">
                      {currentContactInfo.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3 text-right">
                    <MdPhone className="text-[#C41E3A] flex-shrink-0" size={18} />
                    <a href={`tel:${currentContactInfo.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[#C41E3A]">
                      {currentContactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 text-right">تابعنا على</h4>
                  <div className="flex justify-start gap-2">
                    
                     {currentContactInfo.socialMedia.youtube && (
                      <a href={currentContactInfo.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center bg-gray-200 hover:bg-[#C41E3A] text-gray-700 hover:text-white rounded-full transition-all duration-300"
                      >
                        <FaYoutube size={16} />
                      </a>
                    )}
                    
                     {currentContactInfo.socialMedia.instagram && (
                      <a href={currentContactInfo.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center bg-gray-200 hover:bg-[#C41E3A] text-gray-700 hover:text-white rounded-full transition-all duration-300"
                      >
                        <FaInstagram size={16} />
                      </a>
                    )}
                    
                     {currentContactInfo.socialMedia.twitter && (
                      <a href={currentContactInfo.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center bg-gray-200 hover:bg-[#C41E3A] text-gray-700 hover:text-white rounded-full transition-all duration-300"
                      >
                        <FaTwitter size={16} />
                      </a>
                    )}
                    
                     {currentContactInfo.socialMedia.facebook && (
                      <a href={currentContactInfo.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center bg-gray-200 hover:bg-[#C41E3A] text-gray-700 hover:text-white rounded-full transition-all duration-300"
                      >
                        <FaFacebookF size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUsComponents;