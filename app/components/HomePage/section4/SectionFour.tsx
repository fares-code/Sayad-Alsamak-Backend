'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHomepageContent } from '@/hooks/useHomepage';

const SectionFour = () => {
  const { content, loading, fetchContent } = useHomepageContent();

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <section className="w-full bg-[#F8F5F0] py-16 md:py-20" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Right Side - Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-right">
            {loading ? (
              <>
                <div className="space-y-3 mb-6">
                  <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                </div>
                <div className="space-y-2 mb-8">
                  <div className="h-4 w-80 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                </div>
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-snug mb-6">
                  {content?.sectionFourTitle || "نوفر جميع المنتجات اللازم بأفضل جودة للمطاعم و الفنادق لطلبات الجملة"}
                </h2>
                
                <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
                  {content?.sectionFourDescription || "زود مطعمك أفضل و أجود المنتجات البحرية الطازجة الان"}
                </p>
                
                <Link 
                  href={`/products?type=WHOLESALE`}
                  className="inline-block bg-[#C40D14] hover:bg-[#a01829] text-white font-bold text-lg px-8 py-3 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  {content?.sectionFourButtonText || "اطلب الان"}
                </Link>
              </>
            )}
          </div>

          {/* Left Side - Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-xl">
              {loading ? (
                <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
              ) : (
                <Image
                  src={content?.sectionFourImage || "/plate-seafood.png"}
                  alt="طبق المأكولات البحرية"
                  width={700}
                  height={700}
                  className="w-full h-auto object-contain"
                  priority
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SectionFour;