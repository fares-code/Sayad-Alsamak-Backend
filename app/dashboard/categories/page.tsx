'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useGetCategories, useToggleCategoryActive } from '@/hooks/categories-hooks';
import { Category } from '@/types/category';
import CategoryDialog from '@/app/components/Categories/CategoryDialog';
import DeleteCategoryDialog from '@/app/components/Categories/DeleteCategoryDialog';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function CategoriesPage() {
  const { categories, loading, fetchCategories } = useGetCategories();
  const { mutateAsync: toggleActive } = useToggleCategoryActive();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete({
      id: category.id,
      name: category.nameAr || category.name,
    });
    setIsDeleteDialogOpen(true);
  };

  const handleToggleActive = async (category: Category) => {
    const togglePromise = toggleActive(category.id);

    toast.promise(togglePromise, {
      loading: 'جاري تغيير الحالة...',
      success: (data) => {
        fetchCategories();
        return data.message || 'تم تغيير حالة الفئة بنجاح';
      },
      error: (err) => {
        return err.message || 'فشل في تغيير حالة الفئة';
      },
    });
  };

  const handleSuccess = () => {
    fetchCategories();
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفئات</h1>
          <p className="text-gray-600 mt-1">إدارة فئات المنتجات</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
        >
          <Plus size={20} />
          إضافة فئة جديدة
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            {/* Image */}
            {category.image && (
              <div className="relative h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.nameAr || category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 mb-1">
                  {category.nameAr || category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.name}</p>
              </div>

              {category.descriptionAr && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.descriptionAr}
                </p>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category.isActive ? 'نشط' : 'غير نشط'}
                </span>
                {category.productsCount !== undefined && (
                  <span className="text-xs text-gray-500">
                    {category.productsCount} منتج
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Edit size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => handleToggleActive(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  {category.isActive ? (
                    <ToggleRight size={16} />
                  ) : (
                    <ToggleLeft size={16} />
                  )}
                  {category.isActive ? 'تعطيل' : 'تفعيل'}
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">لا توجد فئات حتى الآن</p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
          >
            <Plus size={20} />
            إضافة فئة جديدة
          </button>
        </div>
      )}

      {/* Dialogs */}
      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      {categoryToDelete && (
        <DeleteCategoryDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
          }}
          categoryId={categoryToDelete.id}
          categoryName={categoryToDelete.name}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}