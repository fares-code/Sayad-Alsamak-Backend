'use client';

import React, { useEffect, useState } from 'react';
import { useGetActiveContactInfo, useCreateContactInfo, useUpdateContactInfo, useToggleContactInfoActive } from '@/hooks/useContactInfo';
import { ContactInfo, CreateContactInfoPayload, UpdateContactInfoPayload, SocialMedia } from '@/types/contact-info';
import { Loader2, Save, Edit, Eye, EyeOff, Plus, X } from 'lucide-react';

const ContactInfoDashboard = () => {
  const { contactInfo, loading, fetchContactInfo } = useGetActiveContactInfo();
  const { mutateAsync: createContactInfo, isPending: isCreating } = useCreateContactInfo();
  const { mutateAsync: updateContactInfo, isPending: isUpdating } = useUpdateContactInfo();
  const { mutateAsync: toggleActive, isPending: isToggling } = useToggleContactInfoActive();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateContactInfoPayload>({
    heroTitle: '',
    heroDescription: '',
    heroImage: '',
    address: '',
    email: '',
    phone: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    latitude: 30.0444,
    longitude: 31.2357
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        heroTitle: contactInfo.heroTitle,
        heroDescription: contactInfo.heroDescription,
        heroImage: contactInfo.heroImage,
        address: contactInfo.address,
        email: contactInfo.email,
        phone: contactInfo.phone,
        socialMedia: contactInfo.socialMedia,
        latitude: contactInfo.latitude,
        longitude: contactInfo.longitude
      });
    }
  }, [contactInfo]);

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('socialMedia.')) {
      const socialField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (contactInfo) {
        await updateContactInfo({ id: contactInfo.id, payload: formData });
      } else {
        await createContactInfo(formData);
      }
      await fetchContactInfo();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const handleToggleActive = async () => {
    if (contactInfo) {
      try {
        await toggleActive(contactInfo.id);
        await fetchContactInfo();
      } catch (error) {
        console.error('Error toggling active status:', error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          heroImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#C41E3A]" />
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">معلومات الاتصال</h1>
          <div className="flex gap-3">
            {contactInfo && (
              <button
                onClick={handleToggleActive}
                disabled={isToggling}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {contactInfo.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                {contactInfo.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#a01829]"
            >
              {isEditing ? <X size={18} /> : <Edit size={18} />}
              {isEditing ? 'إلغاء' : 'تعديل'}
            </button>
          </div>
        </div>

        {/* Content */}
        {contactInfo && !isEditing ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الهيرو</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">{contactInfo.heroTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">الوصف</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">{contactInfo.heroDescription}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">صورة الهيرو</label>
                  {contactInfo.heroImage && (
                    <img 
                      src={contactInfo.heroImage} 
                      alt="Hero" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الاتصال</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">{contactInfo.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">البريد الإلكتروني</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">{contactInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">الهاتف</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">{contactInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">خطوط الطول والعرض</label>
                  <p className="text-gray-800 p-2 bg-gray-50 rounded">
                    {contactInfo.latitude}, {contactInfo.longitude}
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">وسائل التواصل الاجتماعي</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">فيسبوك</label>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded text-sm">
                      {contactInfo.socialMedia.facebook || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">تويتر</label>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded text-sm">
                      {contactInfo.socialMedia.twitter || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">انستجرام</label>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded text-sm">
                      {contactInfo.socialMedia.instagram || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">يوتيوب</label>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded text-sm">
                      {contactInfo.socialMedia.youtube || 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  آخر تحديث: {new Date(contactInfo.updatedAt).toLocaleDateString('ar-EG')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  contactInfo.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {contactInfo.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الهيرو</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea
                    value={formData.heroDescription}
                    onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">صورة الهيرو</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  />
                  {formData.heroImage && (
                    <img 
                      src={formData.heroImage} 
                      alt="Hero preview" 
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الاتصال</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">خط العرض</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">خط الطول</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">وسائل التواصل الاجتماعي</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">فيسبوك</label>
                    <input
                      type="url"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تويتر</label>
                    <input
                      type="url"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">انستجرام</label>
                    <input
                      type="url"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">يوتيوب</label>
                    <input
                      type="url"
                      value={formData.socialMedia.youtube}
                      onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 px-6 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#a01829] disabled:opacity-50"
              >
                <Save size={18} />
                {isCreating || isUpdating ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactInfoDashboard;
