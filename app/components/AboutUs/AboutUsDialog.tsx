// src/app/components/AboutUs/AboutUsDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { useCreateAboutUs, useUpdateAboutUs } from '@/hooks/useAboutUs';
import { convertImageToBase64 } from '@/services/about-us-service';
import { AboutUs, Value } from '@/types/about-us';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface AboutUsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  aboutUs?: AboutUs | null;
  onSuccess: () => void;
}

export default function AboutUsDialog({
  isOpen,
  onClose,
  aboutUs,
  onSuccess,
}: AboutUsDialogProps) {
  const isEditMode = !!aboutUs;
  const { mutateAsync: createAboutUs, isPending: isCreating } = useCreateAboutUs();
  const { mutateAsync: updateAboutUs, isPending: isUpdating } = useUpdateAboutUs();

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroDescription: '',
    heroImage: '',
    visionTitle: '',
    visionDescription: '',
    visionImage: '',
    missionTitle: '',
    missionDescription: '',
    missionImage: '',
    valuesTitle: '',
    values: [] as Value[],
  });

  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [visionImagePreview, setVisionImagePreview] = useState<string>('');
  const [missionImagePreview, setMissionImagePreview] = useState<string>('');
  const [valuesImagesPreviews, setValuesImagesPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (aboutUs) {
      setFormData({
        heroTitle: aboutUs.heroTitle || '',
        heroDescription: aboutUs.heroDescription || '',
        heroImage: aboutUs.heroImage || '',
        visionTitle: aboutUs.visionTitle || '',
        visionDescription: aboutUs.visionDescription || '',
        visionImage: aboutUs.visionImage || '',
        missionTitle: aboutUs.missionTitle || '',
        missionDescription: aboutUs.missionDescription || '',
        missionImage: aboutUs.missionImage || '',
        valuesTitle: aboutUs.valuesTitle || '',
        values: aboutUs.values || [],
      });
      setHeroImagePreview(aboutUs.heroImage || '');
      setVisionImagePreview(aboutUs.visionImage || '');
      setMissionImagePreview(aboutUs.missionImage || '');
      setValuesImagesPreviews(aboutUs.values?.map((v) => v.image) || []);
    } else {
      resetForm();
    }
  }, [aboutUs]);

  const resetForm = () => {
    setFormData({
      heroTitle: '',
      heroDescription: '',
      heroImage: '',
      visionTitle: '',
      visionDescription: '',
      visionImage: '',
      missionTitle: '',
      missionDescription: '',
      missionImage: '',
      valuesTitle: 'قيمنا',
      values: [
        { title: 'الجودة أولاً', image: '' },
        { title: 'الأمانة و المصداقية', image: '' },
        { title: 'رضا العملاء', image: '' },
        { title: 'التطوير المستمر', image: '' },
      ],
    });
    setHeroImagePreview('');
    setVisionImagePreview('');
    setMissionImagePreview('');
    setValuesImagesPreviews(['', '', '', '']);
  };

  const handleImageUpload = async (
    file: File,
    field: 'heroImage' | 'visionImage' | 'missionImage',
    setPreview: (url: string) => void
  ) => {
    try {
      const base64 = await convertImageToBase64(file);
      setFormData((prev) => ({ ...prev, [field]: base64 }));
      setPreview(base64);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      toast.error('فشل رفع الصورة');
    }
  };

  const handleValueImageUpload = async (file: File, index: number) => {
    try {
      const base64 = await convertImageToBase64(file);
      const newValues = [...formData.values];
      newValues[index] = { ...newValues[index], image: base64 };
      setFormData((prev) => ({ ...prev, values: newValues }));

      const newPreviews = [...valuesImagesPreviews];
      newPreviews[index] = base64;
      setValuesImagesPreviews(newPreviews);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      toast.error('فشل رفع الصورة');
    }
  };

  const addValue = () => {
    setFormData((prev) => ({
      ...prev,
      values: [...prev.values, { title: '', image: '' }],
    }));
    setValuesImagesPreviews((prev) => [...prev, '']);
  };

  const removeValue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
    setValuesImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.heroTitle || !formData.heroDescription || !formData.heroImage) {
      toast.error('يرجى ملء جميع حقول القسم الرئيسي');
      return;
    }

    if (!formData.visionTitle || !formData.visionDescription || !formData.visionImage) {
      toast.error('يرجى ملء جميع حقول الرؤية');
      return;
    }

    if (!formData.missionTitle || !formData.missionDescription || !formData.missionImage) {
      toast.error('يرجى ملء جميع حقول الرسالة');
      return;
    }

    if (formData.values.length === 0) {
      toast.error('يرجى إضافة قيمة واحدة على الأقل');
      return;
    }

    for (let i = 0; i < formData.values.length; i++) {
      if (!formData.values[i].title || !formData.values[i].image) {
        toast.error(`يرجى ملء جميع حقول القيمة ${i + 1}`);
        return;
      }
    }

    const submitPromise = isEditMode
      ? updateAboutUs({ id: aboutUs.id, payload: formData })
      : createAboutUs(formData);

    toast.promise(submitPromise, {
      loading: isEditMode ? 'جاري تحديث المحتوى...' : 'جاري إنشاء المحتوى...',
      success: (data) => {
        onSuccess();
        onClose();
        return data.message || (isEditMode ? 'تم تحديث المحتوى بنجاح' : 'تم إنشاء المحتوى بنجاح');
      },
      error: (err) => {
        return err.message || (isEditMode ? 'فشل في تحديث المحتوى' : 'فشل في إنشاء المحتوى');
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? 'تعديل محتوى صفحة عن الشركة' : 'إضافة محتوى صفحة عن الشركة'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hero Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#C41E3A] rounded"></span>
              القسم الرئيسي (Hero)
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.heroTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                placeholder="عن صياد السمك"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.heroDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                placeholder="نحن ملتزمون بتقديم أفضل وأجود أنواع المأكولات البحرية..."
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الخلفية <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {heroImagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <Image
                      src={heroImagePreview}
                      alt="Hero Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#C41E3A] transition-colors">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={20} />
                      <span className="text-sm">اختر صورة</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'heroImage', setHeroImagePreview);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Vision & Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded"></span>
                رؤيتنا
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.visionTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, visionTitle: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="رؤيتنا"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.visionDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, visionDescription: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أن نصبح الخيار الأول والأفضل..."
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {visionImagePreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <Image
                        src={visionImagePreview}
                        alt="Vision Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Upload size={18} />
                        <span className="text-sm">اختر صورة</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          handleImageUpload(file, 'visionImage', setVisionImagePreview);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-600 rounded"></span>
                رسالتنا
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.missionTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, missionTitle: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="رسالتنا"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.missionDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, missionDescription: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="نسعى إلى توفير أفضل وأجود المنتجات..."
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {missionImagePreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <Image
                        src={missionImagePreview}
                        alt="Mission Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-green-500 transition-colors">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Upload size={18} />
                        <span className="text-sm">اختر صورة</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          handleImageUpload(file, 'missionImage', setMissionImagePreview);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-600 rounded"></span>
                قيمنا
              </h3>
              <button
                type="button"
                onClick={addValue}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus size={16} />
                إضافة قيمة
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القسم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.valuesTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, valuesTitle: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="قيمنا"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.values.map((value, index) => (
                <div
                  key={index}
                  className="border border-purple-200 rounded-lg p-4 bg-white space-y-3 relative"
                >
                  {formData.values.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="absolute top-2 left-2 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القيمة {index + 1} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={value.title}
                      onChange={(e) => {
                        const newValues = [...formData.values];
                        newValues[index] = { ...newValues[index], title: e.target.value };
                        setFormData((prev) => ({ ...prev, values: newValues }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="مثال: الجودة أولاً"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصورة <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {valuesImagesPreviews[index] && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                          <Image
                            src={valuesImagesPreviews[index]}
                            alt={`Value ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-500 transition-colors">
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Upload size={16} />
                            <span className="text-xs">اختر صورة</span>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleValueImageUpload(file, index);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 bg-[#C41E3A] text-white py-3 rounded-lg font-medium hover:bg-[#a01829] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={20} />}
              {isEditMode ? 'تحديث المحتوى' : 'إضافة المحتوى'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}