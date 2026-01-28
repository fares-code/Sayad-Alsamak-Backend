// src/components/AboutUsComponents.tsx
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useGetActiveAboutUs } from '@/hooks/useAboutUs';
import { Loader2 } from 'lucide-react';

const AboutUsComponents = () => {
  const { aboutUs, loading, fetchAboutUs } = useGetActiveAboutUs();

  useEffect(() => {
    fetchAboutUs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C41E3A]" />
      </div>
    );
  }

  if (!aboutUs) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">لا يوجد محتوى متاح</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[580px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutUs.heroImage}
            alt={aboutUs.heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutUs.heroTitle}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-[#B7BBC1]">
            {aboutUs.heroDescription}
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-2 flex justify-end">
              <div className="relative w-full max-w-lg h-[350px] rounded-2xl overflow-hidden">
                <Image
                  src={aboutUs.visionImage}
                  alt={aboutUs.visionTitle}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="order-2 lg:order-1 text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {aboutUs.visionTitle}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {aboutUs.visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className="relative w-full max-w-lg h-[350px] rounded-2xl overflow-hidden">
                <Image
                  src={aboutUs.missionImage}
                  alt={aboutUs.missionTitle}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="order-2 text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {aboutUs.missionTitle}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {aboutUs.missionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white" dir="rtl">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            {aboutUs.valuesTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutUs.values.map((value, index) => (
              <div
                key={index}
                className="relative h-[200px] rounded-lg overflow-hidden shadow-lg group cursor-pointer"
              >
                <Image
                  src={value.image}
                  alt={value.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-white text-xl md:text-2xl font-bold">{value.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsComponents;