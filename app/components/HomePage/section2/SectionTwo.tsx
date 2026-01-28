'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useHomepageCategories, useHomepageContent } from '@/hooks/useHomepage';
import { Category } from '@/types/homepage';

export default function SectionTwo() {
  const { categories, loading, error, fetchCategories } = useHomepageCategories();
  const { content, loading: contentLoading } = useHomepageContent();

  useEffect(() => {
    fetchCategories({ limit: 10 });
  }, []);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {contentLoading ? (
            <>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2 mx-auto" />
              <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
            </>
          ) : (
            <>
              <p className="text-[#C41E3A] text-sm md:text-base font-semibold mb-2">
                {content?.sectionTwoDescription || "المفضلة لدى عملائنا"}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                {content?.sectionTwoTitle || "الأصناف الشائعة"}
              </h2>
            </>
          )}
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 text-center space-y-2">
                  <div className="h-6 w-24 bg-gray-200 rounded mx-auto" />
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لا توجد أصناف متاحة حالياً
            </h3>
            <p className="text-gray-500">
              يرجى التحقق لاحقاً أو التواصل معنا للمزيد من المعلومات
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-5 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">طازج ومائع</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

