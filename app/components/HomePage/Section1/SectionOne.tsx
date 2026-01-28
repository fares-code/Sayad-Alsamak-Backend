'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useHomepageContent } from '@/hooks/useHomepage';
import Link from 'next/link';

export default function SectionOne() {
  const { content, loading, error, fetchContent } = useHomepageContent();

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="relative w-full h-screen mt-1">
      {/* Background Images */}
      <div className="absolute inset-0 flex">
        {/* Left Image */}
        <div className="w-1/2 h-full relative">
          <Image 
            src={content?.heroBackgroundImage1 || "/home-1.png"} 
            alt="Seafood Left" 
            fill
            className="object-cover"
            priority
          />
          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
        
        {/* Right Image */}
        <div className="w-1/2 h-full relative">
          <Image 
            src={content?.heroBackgroundImage2 || "/home-2.png"} 
            alt="Seafood Right" 
            fill
            className="object-cover"
            priority
          />
          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>

      {/* White Semi-Transparent Overlay */}
      <div className="absolute inset-0 bg-[#F9FAFA]/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl" dir="rtl">
          {loading ? (
            <>
              <div className="space-y-4 mb-8">
                <div className="h-12 w-96 bg-gray-300 rounded animate-pulse mx-auto" />
                <div className="h-12 w-80 bg-gray-300 rounded animate-pulse mx-auto" />
                <div className="h-12 w-72 bg-gray-300 rounded animate-pulse mx-auto" />
              </div>
              <div className="h-6 w-full max-w-2xl bg-gray-300 rounded animate-pulse mx-auto mb-8" />
              <div className="flex gap-4 justify-center">
                <div className="h-14 w-40 bg-gray-300 rounded-lg animate-pulse" />
                <div className="h-14 w-40 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </>
          ) : (
            <>
              {/* Main Title - Black Text */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                {content?.heroTitle || "صياد السمك يقدم لك أجود المأكولات البحرية الطازجة من البحر إلى مائدتك!"}
              </h1>
              
              {/* Description - Dark Gray Text */}
              <p className="text-base md:text-lg mb-10 max-w-3xl mx-auto leading-relaxed text-gray-700">
                {content?.heroDescription || "أفضل المأكولات البحرية بجودة عالية ونضارة لا مثيل لها - سمك طازج، جمبري، كابوريا، منتجات مُعدّة للطهي والمزيد بأسعار تنافسية وخدمة توصيل سريعة."}
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Red Button */}
                <Link 
                  href={content?.heroButtonLink1 || "/products"}
                  className="bg-[#C40D14] hover:bg-[#a01829] text-white font-bold px-10 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[180px] text-center"
                >
                  {content?.heroButtonText1 || "عرض المنتجات"}
                </Link>
                
                {/* White/Transparent Button with Red Border */}
                <Link 
                  href={content?.heroButtonLink2 || "/products?type=WHOLESALE"}
                  className="bg-white hover:bg-[#C41E3A] text-[#C41E3A] hover:text-white border-2 border-[#C41E3A] font-bold px-10 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[180px] text-center"
                >
                  {content?.heroButtonText2 || "اطلب بالجملة"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}