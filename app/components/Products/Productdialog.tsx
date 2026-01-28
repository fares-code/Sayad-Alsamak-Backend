'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Trash2, Package, ShoppingCart, Layers } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/products-hooks';
import { Product, convertImageToBase64 } from '@/services/products-service';
import { useGetCategories } from '@/hooks/categories-hooks';
import toast from 'react-hot-toast';
import Image from 'next/image';

// ProductType Enum (يجب أن يتطابق مع الـ Backend)
enum ProductType {
  RETAIL = 'RETAIL',     // قطاعي
  WHOLESALE = 'WHOLESALE', // جملة
  BOTH = 'BOTH'          // الاثنين معاً
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export default function ProductDialog({ isOpen, onClose, product, onSuccess }: ProductDialogProps) {
  const isEditMode = !!product;
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { categories, fetchCategories } = useGetCategories();

  // حالة التبديل بين القطاعي والجملة
  const [viewMode, setViewMode] = useState<'retail' | 'wholesale'>('retail');

  const [formData, setFormData] = useState({
    nameAr: '',
    descriptionAr: '',
    categoryId: '',
    type: ProductType.RETAIL,
    price: 0,
    originalPrice: 0,
    discount: 0,
    wholesalePrice: 0,
    minWholesaleQty: 0,
    weight: 0,
    unit: 'كجم',
    mainImage: '',
    images: [] as string[],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [] as string[],
  });

  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // حساب الخصم تلقائياً
  useEffect(() => {
    if (formData.originalPrice > 0 && formData.price > 0) {
      const discountValue = ((formData.originalPrice - formData.price) / formData.originalPrice) * 100;
      setFormData(prev => ({ ...prev, discount: Math.round(discountValue * 100) / 100 }));
    } else {
      setFormData(prev => ({ ...prev, discount: 0 }));
    }
  }, [formData.price, formData.originalPrice]);

  useEffect(() => {
    if (product) {
      setFormData({
        nameAr: product.nameAr || '',
        descriptionAr: product.descriptionAr || '',
        categoryId: product.categoryId || '',
        type: product.type || ProductType.RETAIL,
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discount: product.discount || 0,
        wholesalePrice: product.wholesalePrice || 0,
        minWholesaleQty: product.minWholesaleQty || 0,
        weight: product.weight || 0,
        unit: product.unit || 'كجم',
        mainImage: product.mainImage || '',
        images: product.images || [],
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        metaKeywords: product.metaKeywords || [],
      });
      setMainImagePreview(product.mainImage || '');
      setImagesPreview(product.images || []);
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      nameAr: '',
      descriptionAr: '',
      categoryId: '',
      type: ProductType.RETAIL,
      price: 0,
      originalPrice: 0,
      discount: 0,
      wholesalePrice: 0,
      minWholesaleQty: 0,
      weight: 0,
      unit: 'كجم',
      mainImage: '',
      images: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    });
    setMainImagePreview('');
    setImagesPreview([]);
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertImageToBase64(file);
        setFormData({ ...formData, mainImage: base64 });
        setMainImagePreview(base64);
      } catch (error) {
        toast.error('فشل في تحويل الصورة');
      }
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagesPreview.length > 10) {
      toast.error('لا يمكن إضافة أكثر من 10 صور');
      return;
    }

    try {
      const base64Images = await Promise.all(files.map(file => convertImageToBase64(file)));
      const newImages = [...formData.images, ...base64Images];
      setFormData({ ...formData, images: newImages });
      setImagesPreview([...imagesPreview, ...base64Images]);
    } catch (error) {
      toast.error('فشل في تحويل الصور');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagesPreview(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((formData.type === ProductType.WHOLESALE || formData.type === ProductType.BOTH) && 
        (!formData.wholesalePrice || !formData.minWholesaleQty)) {
      toast.error('يجب إدخال سعر الجملة والحد الأدنى للكمية');
      return;
    }

    const submitPromise = isEditMode
      ? updateProduct({ id: product.id, payload: formData })
      : createProduct(formData);

    toast.promise(submitPromise, {
      loading: isEditMode ? 'جاري تحديث المنتج...' : 'جاري إنشاء المنتج...',
      success: (data) => {
        onSuccess();
        onClose();
        resetForm();
        return data.message || (isEditMode ? 'تم تحديث المنتج بنجاح' : 'تم إنشاء المنتج بنجاح');
      },
      error: (err) => {
        return err.message || (isEditMode ? 'فشل في تحديث المنتج' : 'فشل في إنشاء المنتج');
      },
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
      
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1️⃣ معلومات أساسية */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gray-600 rounded-lg">
                <Layers className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">المعلومات الأساسية</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="أدخل اسم المنتج"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف تفصيلي للمنتج"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوزن</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوحدة <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="كجم">كجم</option>
                  <option value="جرام">جرام</option>
                  <option value="قطعة">قطعة</option>
                  <option value="علبة">علبة</option>
                  <option value="كرتونة">كرتونة</option>
                  <option value="لتر">لتر</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2️⃣ نوع المنتج */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-purple-900">نوع المنتج</h3>
              </div>

              {/* زر التبديل بين القطاعي والجملة */}
              {formData.type === ProductType.BOTH && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border-2 border-purple-300">
                  <button
                    type="button"
                    onClick={() => setViewMode('retail')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'retail'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    🛒 عرض القطاعي
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('wholesale')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'wholesale'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    📦 عرض الجملة
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: ProductType.RETAIL })}
                className={`p-5 border-2 rounded-xl text-center transition-all ${
                  formData.type === ProductType.RETAIL
                    ? 'border-purple-600 bg-purple-600 text-white shadow-lg scale-105'
                    : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <ShoppingCart className={`mx-auto mb-2 ${formData.type === ProductType.RETAIL ? 'text-white' : 'text-purple-600'}`} size={32} />
                <div className="text-base font-bold">قطاعي</div>
                <div className={`text-xs mt-1 ${formData.type === ProductType.RETAIL ? 'text-purple-100' : 'text-gray-500'}`}>
                  للبيع بالتجزئة
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: ProductType.WHOLESALE })}
                className={`p-5 border-2 rounded-xl text-center transition-all ${
                  formData.type === ProductType.WHOLESALE
                    ? 'border-purple-600 bg-purple-600 text-white shadow-lg scale-105'
                    : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <Package className={`mx-auto mb-2 ${formData.type === ProductType.WHOLESALE ? 'text-white' : 'text-purple-600'}`} size={32} />
                <div className="text-base font-bold">جملة</div>
                <div className={`text-xs mt-1 ${formData.type === ProductType.WHOLESALE ? 'text-purple-100' : 'text-gray-500'}`}>
                  للبيع بالجملة
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: ProductType.BOTH })}
                className={`p-5 border-2 rounded-xl text-center transition-all ${
                  formData.type === ProductType.BOTH
                    ? 'border-purple-600 bg-purple-600 text-white shadow-lg scale-105'
                    : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <Layers className={`mx-auto mb-2 ${formData.type === ProductType.BOTH ? 'text-white' : 'text-purple-600'}`} size={32} />
                <div className="text-base font-bold">الاثنين معاً</div>
                <div className={`text-xs mt-1 ${formData.type === ProductType.BOTH ? 'text-purple-100' : 'text-gray-500'}`}>
                  قطاعي وجملة
                </div>
              </button>
            </div>
          </div>

          {/* 3️⃣ الأسعار القطاعية */}
          {(formData.type === ProductType.RETAIL || 
            (formData.type === ProductType.BOTH && viewMode === 'retail')) && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-600 rounded-lg">
                  <ShoppingCart className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-green-900">الأسعار القطاعية (بالتجزئة)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر الحالي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأصلي</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الخصم %</label>
                  <input
                    type="number"
                    disabled
                    value={formData.discount}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4️⃣ أسعار الجملة */}
          {(formData.type === ProductType.WHOLESALE || 
            (formData.type === ProductType.BOTH && viewMode === 'wholesale')) && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-blue-900">أسعار الجملة (الكميات الكبيرة)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر الجملة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل سعر الجملة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأدنى للكمية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minWholesaleQty}
                    onChange={(e) => setFormData({ ...formData, minWholesaleQty: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 10"
                  />
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-200/50 rounded-lg">
                <p className="text-sm text-blue-900 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    سيتم تطبيق سعر الجملة <strong className="font-bold">{formData.wholesalePrice || '...'} جنيه</strong> عند شراء 
                    <strong className="font-bold mx-1">{formData.minWholesaleQty || '...'}</strong> قطعة أو أكثر
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* 5️⃣ الصور */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Upload className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-orange-900">الصور</h3>
            </div>

            {/* الصورة الرئيسية */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة الرئيسية <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {mainImagePreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-orange-300">
                    <Image src={mainImagePreview} alt="معاينة" fill className="object-cover" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 hover:border-orange-500 transition-colors bg-white">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={20} />
                      <span className="text-sm">اختر صورة رئيسية</span>
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" required={!mainImagePreview} />
                </label>
              </div>
            </div>

            {/* صور إضافية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صور إضافية (حد أقصى 10)</label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {imagesPreview.map((img, index) => (
                  <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-orange-300 group">
                    <Image src={img} alt={`صورة ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {imagesPreview.length < 10 && (
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 hover:border-orange-500 transition-colors bg-white">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={20} />
                      <span className="text-sm">أضف صور إضافية</span>
                    </div>
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 bg-[#C41E3A] text-white py-3 rounded-lg font-medium hover:bg-[#a01829] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={18} />}
              {isEditMode ? 'تحديث المنتج' : 'إضافة المنتج'}
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
    </>
  );
}