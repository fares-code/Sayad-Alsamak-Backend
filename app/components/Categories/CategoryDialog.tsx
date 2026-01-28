'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/hooks/categories-hooks';
import {convertImageToBase64 } from '@/services/categories-service';
import{Category} from "@/types/category"
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: () => void;
}

export default function CategoryDialog({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const isEditMode = !!category;
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
  
    description: '',
    descriptionAr: '',
    image: '',
    isActive: true,
    sortOrder: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        nameAr: category.nameAr || '',
      
        description: category.description || '',
        descriptionAr: category.descriptionAr || '',
        image: category.image || '',
        isActive: category.isActive ?? true,
        sortOrder: category.sortOrder || 0,
      });
      setImagePreview(category.image || '');
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
    
      description: '',
      descriptionAr: '',
      image: '',
      isActive: true,
      sortOrder: 0,
    });
    setImagePreview('');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertImageToBase64(file);
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      } catch (error) {
        toast.error('فشل في تحويل الصورة');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitPromise = isEditMode
      ? updateCategory({ id: category.id, payload: formData })
      : createCategory(formData);

    toast.promise(submitPromise, {
      loading: isEditMode ? 'جاري تحديث الفئة...' : 'جاري إنشاء الفئة...',
      success: (data) => {
        onSuccess();
        onClose();
        resetForm();
        return data.message || (isEditMode ? 'تم تحديث الفئة بنجاح' : 'تم إنشاء الفئة بنجاح');
      },
      error: (err) => {
        return err.message || (isEditMode ? 'فشل في تحديث الفئة' : 'فشل في إنشاء الفئة');
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* الاسم بالإنجليزية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم بالإنجليزية <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
      
                setFormData({ ...formData, name });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              placeholder="Category Name"
            />
          </div>

          {/* الاسم بالعربية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم بالعربية <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              placeholder="اسم الفئة"
              dir="rtl"
            />
          </div>

      
          {/* الوصف بالإنجليزية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف بالإنجليزية
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              rows={3}
              placeholder="Category Description"
            />
          </div>

          {/* الوصف بالعربية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف بالعربية
            </label>
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              rows={3}
              placeholder="وصف الفئة"
              dir="rtl"
            />
          </div>

          {/* صورة الفئة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الفئة
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* الترتيب */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الترتيب
            </label>
            <input
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            />
          </div> */}

          {/* الحالة */}
          {/* <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#C41E3A] rounded focus:ring-[#C41E3A]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              فئة نشطة
            </label>
          </div> */}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 bg-[#C41E3A] text-white py-2.5 rounded-lg font-medium hover:bg-[#a01829] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={18} />}
              {isEditMode ? 'تحديث الفئة' : 'إضافة الفئة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}