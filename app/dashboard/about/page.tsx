// src/app/dashboard/about/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useGetActiveAboutUs } from '@/hooks/useAboutUs';
import { Save, Loader2 } from 'lucide-react';
import AboutUsDialog from '@/app/components/AboutUs/AboutUsDialog';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AboutUsPage() {
  const { aboutUs, loading, fetchAboutUs } = useGetActiveAboutUs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchAboutUs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">صفحة عن الشركة</h1>
          <p className="text-gray-600 mt-1">إدارة محتوى صفحة "عن صياد السمك"</p>
        </div>
        {aboutUs && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
          >
            <Save size={20} />
            تعديل المحتوى
          </button>
        )}
      </div>

      {aboutUs ? (
        <div className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-lg text-gray-900">القسم الرئيسي (Hero)</h2>
            </div>
            <div className="p-4">
              {aboutUs.heroImage && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={aboutUs.heroImage}
                    alt={aboutUs.heroTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">العنوان</p>
                  <h3 className="font-bold text-gray-900">{aboutUs.heroTitle}</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">الوصف</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {aboutUs.heroDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-bold text-lg text-gray-900">رؤيتنا</h2>
              </div>
              <div className="p-4">
                {aboutUs.visionImage && (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={aboutUs.visionImage}
                      alt={aboutUs.visionTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">العنوان</p>
                    <h3 className="font-bold text-gray-900">{aboutUs.visionTitle}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">الوصف</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {aboutUs.visionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-bold text-lg text-gray-900">رسالتنا</h2>
              </div>
              <div className="p-4">
                {aboutUs.missionImage && (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={aboutUs.missionImage}
                      alt={aboutUs.missionTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">العنوان</p>
                    <h3 className="font-bold text-gray-900">{aboutUs.missionTitle}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">الوصف</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {aboutUs.missionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-lg text-gray-900">{aboutUs.valuesTitle}</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {aboutUs.values.map((value, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {value.image && (
                      <div className="relative h-32 w-full bg-gray-100">
                        <Image
                          src={value.image}
                          alt={value.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 text-center">
                        {value.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                aboutUs.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {aboutUs.isActive ? 'المحتوى نشط' : 'المحتوى غير نشط'}
            </span>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا يوجد محتوى حتى الآن
            </h3>
            <p className="text-gray-500 mb-6">
              قم بإضافة محتوى صفحة "عن الشركة" لعرضه في الموقع
            </p>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
            >
              <Save size={20} />
              إضافة المحتوى
            </button>
          </div>
        </div>
      )}

      {/* Dialog */}
      <AboutUsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aboutUs={aboutUs}
        onSuccess={handleSuccess}
      />
    </div>
  );
}