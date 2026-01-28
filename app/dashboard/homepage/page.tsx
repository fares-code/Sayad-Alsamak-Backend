'use client';

import React, { useState, useEffect } from 'react';
import { useHomepageContentManagement } from '@/hooks/useHomepage';
import { HomepageContent } from '@/types/homepage';
import { 
  Home, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Edit3,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomepageManagementPage() {
  const { 
    content, 
    loading, 
    error, 
    fetchContent, 
    updateContent, 
    updateContentWithImages,
    createContent 
  } = useHomepageContentManagement();

  const [formData, setFormData] = useState<Partial<HomepageContent>>({});
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'images'>('hero');
  const [previewMode, setPreviewMode] = useState(false);
  const [hasNewImages, setHasNewImages] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleInputChange = (field: keyof HomepageContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (field: string, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار ملف صورة صحيح');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 10MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, [field]: base64String }));
      setHasNewImages(true);
    };
    reader.onerror = () => {
      toast.error('فشل في قراءة الصورة');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!content?.id) {
        // Create new content
        await createContent(formData);
        toast.success('تم إنشاء محتوى الصفحة الرئيسية بنجاح');
      } else {
        // Update existing content
        if (hasNewImages) {
          // Use the endpoint that handles images
          await updateContentWithImages(content.id, formData);
        } else {
          // Use the regular update endpoint
          await updateContent(content.id, formData);
        }
        toast.success('تم تحديث محتوى الصفحة الرئيسية بنجاح');
        setHasNewImages(false);
      }
      
      // Refresh content after save
      await fetchContent();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'فشل في حفظ المحتوى');
    }
  };

  const renderHeroSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">قسم الرئيسي (Hero Section)</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان الرئيسي
          </label>
          <textarea
            value={formData.heroTitle || ''}
            onChange={(e) => handleInputChange('heroTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            rows={3}
            placeholder="أدخل العنوان الرئيسي..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            value={formData.heroDescription || ''}
            onChange={(e) => handleInputChange('heroDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            rows={3}
            placeholder="أدخل الوصف..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نص الزر الأول
          </label>
          <input
            type="text"
            value={formData.heroButtonText1 || ''}
            onChange={(e) => handleInputChange('heroButtonText1', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="نص الزر الأول"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الزر الأول
          </label>
          <input
            type="text"
            value={formData.heroButtonLink1 || ''}
            onChange={(e) => handleInputChange('heroButtonLink1', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="/products"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نص الزر الثاني (اختياري)
          </label>
          <input
            type="text"
            value={formData.heroButtonText2 || ''}
            onChange={(e) => handleInputChange('heroButtonText2', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="نص الزر الثاني"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الزر الثاني (اختياري)
          </label>
          <input
            type="text"
            value={formData.heroButtonLink2 || ''}
            onChange={(e) => handleInputChange('heroButtonLink2', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="/categories"
          />
        </div>
      </div>
    </div>
  );

  const renderSectionsContent = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">محتوى الأقسام</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القسم الثاني
          </label>
          <input
            type="text"
            value={formData.sectionTwoTitle || ''}
            onChange={(e) => handleInputChange('sectionTwoTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="عنوان القسم الثاني"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف القسم الثاني
          </label>
          <input
            type="text"
            value={formData.sectionTwoDescription || ''}
            onChange={(e) => handleInputChange('sectionTwoDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="وصف القسم الثاني"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          عنوان القسم الثالث
        </label>
        <input
          type="text"
          value={formData.sectionThreeTitle || ''}
          onChange={(e) => handleInputChange('sectionThreeTitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
          placeholder="عنوان القسم الثالث"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القسم الرابع
          </label>
          <input
            type="text"
            value={formData.sectionFourTitle || ''}
            onChange={(e) => handleInputChange('sectionFourTitle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="عنوان القسم الرابع"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف القسم الرابع
          </label>
          <input
            type="text"
            value={formData.sectionFourDescription || ''}
            onChange={(e) => handleInputChange('sectionFourDescription', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="وصف القسم الرابع"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نص زر القسم الرابع
          </label>
          <input
            type="text"
            value={formData.sectionFourButtonText || ''}
            onChange={(e) => handleInputChange('sectionFourButtonText', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="نص الزر"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط زر القسم الرابع
          </label>
          <input
            type="text"
            value={formData.sectionFourButtonLink || ''}
            onChange={(e) => handleInputChange('sectionFourButtonLink', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            placeholder="/bulk-order"
          />
        </div>
      </div>
    </div>
  );

  const renderImagesSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">إدارة الصور</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة الخلفية اليسرى للبطل
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {formData.heroBackgroundImage1 && (
              <div className="mb-3">
                <img 
                  src={formData.heroBackgroundImage1} 
                  alt="Hero Background 1" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex items-center justify-center">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageChange('heroBackgroundImage1', e.target.files[0])}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">اختر صورة</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG, GIF حتى 10MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة الخلفية اليمنى للبطل
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {formData.heroBackgroundImage2 && (
              <div className="mb-3">
                <img 
                  src={formData.heroBackgroundImage2} 
                  alt="Hero Background 2" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex items-center justify-center">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageChange('heroBackgroundImage2', e.target.files[0])}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">اختر صورة</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG, GIF حتى 10MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة القسم الرابع
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {formData.sectionFourImage && (
              <div className="mb-3">
                <img 
                  src={formData.sectionFourImage} 
                  alt="Section Four Image" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex items-center justify-center">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageChange('sectionFourImage', e.target.files[0])}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">اختر صورة</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG, GIF حتى 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="h-8 w-8 text-[#C41E3A]" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            إدارة الصفحة الرئيسية
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'وضع التعديل' : 'معاينة'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a01829] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-reverse space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'hero', label: 'القسم الرئيسي', icon: Type },
              { id: 'sections', label: 'الأقسام', icon: Edit3 },
              { id: 'images', label: 'الصور', icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#C41E3A] text-[#C41E3A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'hero' && renderHeroSection()}
          {activeTab === 'sections' && renderSectionsContent()}
          {activeTab === 'images' && renderImagesSection()}
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">معاينة المحتوى</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <strong>عنوان الرئيسي:</strong> {formData.heroTitle || 'غير محدد'}
            </div>
            <div>
              <strong>وصف الرئيسي:</strong> {formData.heroDescription || 'غير محدد'}
            </div>
            <div>
              <strong>عنوان القسم الثاني:</strong> {formData.sectionTwoTitle || 'غير محدد'}
            </div>
            <div>
              <strong>عنوان القسم الثالث:</strong> {formData.sectionThreeTitle || 'غير محدد'}
            </div>
            <div>
              <strong>عنوان القسم الرابع:</strong> {formData.sectionFourTitle || 'غير محدد'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}