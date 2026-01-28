'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, ShoppingCart, Package, Layers, Star } from 'lucide-react';
import { useGetProducts, useUpdateProduct } from '@/hooks/products-hooks';
import { Product, FilterProductParams } from '@/services/products-service';
import Productdialog from '@/app/components/Products/Productdialog';
import DeleteProductDialog from '@/app/components/Products/Deleteproductdialog';
import Image from 'next/image';
import { useGetCategories } from '@/hooks/categories-hooks';
import toast from 'react-hot-toast';

// ProductType Enum
enum ProductType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  BOTH = 'BOTH'
}

type ViewMode = 'all' | 'retail' | 'wholesale' | 'both';

export default function ProductsPage() {
  const { products, loading, pagination, fetchProducts } = useGetProducts();
  const { categories, fetchCategories } = useGetCategories();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // حالة العرض (الكل، قطاعي، جملة، الاثنين)
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const [filters, setFilters] = useState<FilterProductParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt_desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete({
      id: product.id,
      name: product.nameAr || product.name,
    });
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchProducts(filters);
  };

  // دالة لتحديث حالة المنتج المميز باستخدام useUpdateProduct hook
  const toggleFeatured = async (product: Product) => {
    try {
      await updateProduct({
        id: product.id,
        payload: {
          isFeatured: !product.isFeatured
        }
      });

      toast.success(
        !product.isFeatured 
          ? 'تم إضافة المنتج إلى المميزات بنجاح' 
          : 'تم إزالة المنتج من المميزات بنجاح'
      );
      
      fetchProducts(filters);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'حدث خطأ أثناء تحديث المنتج');
    }
  };

  // دالة لتحديث حالة الأكثر مبيعاً
  const toggleBestSeller = async (product: Product) => {
    try {
      await updateProduct({
        id: product.id,
        payload: {
          isBestSeller: !product.isBestSeller
        }
      });

      toast.success(
        !product.isBestSeller 
          ? 'تم إضافة المنتج إلى الأكثر مبيعاً بنجاح' 
          : 'تم إزالة المنتج من الأكثر مبيعاً بنجاح'
      );
      
      fetchProducts(filters);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'حدث خطأ أثناء تحديث المنتج');
    }
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12, sortBy: 'createdAt_desc' });
    setSearchTerm('');
    setViewMode('all');
  };

  const hasActiveFilters = filters.categoryId || filters.type || filters.minPrice || filters.maxPrice;

  // تغيير وضع العرض
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'all') {
      const { type, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    } else if (mode === 'retail') {
      setFilters({ ...filters, type: ProductType.RETAIL, page: 1 });
    } else if (mode === 'wholesale') {
      setFilters({ ...filters, type: ProductType.WHOLESALE, page: 1 });
    } else if (mode === 'both') {
      setFilters({ ...filters, type: ProductType.BOTH, page: 1 });
    }
  };

  // دالة للحصول على أيقونة ولون النوع
  const getTypeInfo = (type: ProductType) => {
    switch (type) {
      case ProductType.RETAIL:
        return {
          icon: <ShoppingCart size={14} />,
          label: 'قطاعي',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          bgGradient: 'from-blue-50 to-blue-100'
        };
      case ProductType.WHOLESALE:
        return {
          icon: <Package size={14} />,
          label: 'جملة',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          bgGradient: 'from-purple-50 to-purple-100'
        };
      case ProductType.BOTH:
        return {
          icon: <Layers size={14} />,
          label: 'قطاعي وجملة',
          color: 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 border-gray-300',
          bgGradient: 'from-blue-50 via-purple-50 to-blue-50'
        };
      default:
        return {
          icon: <ShoppingCart size={14} />,
          label: 'قطاعي',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          bgGradient: 'from-gray-50 to-gray-100'
        };
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600 mt-1">
            إدارة منتجات المتجر ({pagination.total} منتج)
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
        >
          <Plus size={20} />
          إضافة منتج جديد
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-2 mb-6">
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleViewModeChange('all')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-gradient-to-r from-[#C41E3A] to-[#a01829] text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Layers size={20} />
            <span>الكل</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              viewMode === 'all' ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {pagination.total}
            </span>
          </button>

          <button
            onClick={() => handleViewModeChange('retail')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'retail'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart size={20} />
            <span>قطاعي</span>
          </button>

          <button
            onClick={() => handleViewModeChange('wholesale')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'wholesale'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package size={20} />
            <span>جملة</span>
          </button>

          <button
            onClick={() => handleViewModeChange('both')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'both'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Layers size={20} />
            <span>الاثنين معاً</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#a01829] transition-colors"
          >
            بحث
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-[#C41E3A] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={20} />
            فلترة
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={filters.categoryId || ''}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر من</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: parseFloat(e.target.value) || undefined, page: 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر إلى</label>
                <input
                  type="number"
                  min="0"
                  placeholder="∞"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) || undefined, page: 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
                <select
                  value={filters.sortBy || 'createdAt_desc'}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                >
                  <option value="createdAt_desc">الأحدث</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="name-asc">الاسم: أ-ي</option>
                  <option value="name-desc">الاسم: ي-أ</option>
                  <option value="popular">الأكثر مشاهدة</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
              >
                <X size={16} />
                إزالة الفلاتر
              </button>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => {
          const typeInfo = getTypeInfo(product.type);
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Type Badge - في أعلى الكارد */}
              <div className={`bg-gradient-to-r ${typeInfo.bgGradient} px-4 py-2 border-b`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${typeInfo.color} text-xs font-semibold`}>
                    {typeInfo.icon}
                    <span>{typeInfo.label}</span>
                  </div>
                  {product.category && (
                    <span className="text-xs text-gray-600 bg-white/70 px-2 py-1 rounded-full">
                      {product.category.nameAr}
                    </span>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {product.mainImage ? (
                  <Image
                    src={product.mainImage}
                    alt={product.nameAr || product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    لا توجد صورة
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {product.nameAr || product.name}
                </h3>

                {product.descriptionAr && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.descriptionAr}
                  </p>
                )}

                {/* Prices Section */}
                <div className="space-y-3 mb-4">
                  {/* السعر القطاعي */}
                  {(product.type === ProductType.RETAIL || product.type === ProductType.BOTH) && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingCart size={14} className="text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">سعر القطاعي</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-blue-900">
                          {product.price} ج.م
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.originalPrice} ج.م
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          خصم {product.discount}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* السعر الجملة */}
                  {(product.type === ProductType.WHOLESALE || product.type === ProductType.BOTH) && product.wholesalePrice && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Package size={14} className="text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700">سعر الجملة</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-purple-900">
                          {product.wholesalePrice} ج.م
                        </span>
                      </div>
                      {product.minWholesaleQty && (
                        <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          من {product.minWholesaleQty} قطعة
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b">
                  <span>الوزن: {product.weight || 0} {product.unit}</span>
                  <div className="flex items-center gap-2">
                    {product.isFeatured && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star size={12} fill="currentColor" />
                        <span>مميز</span>
                      </div>
                    )}
                    {product.isBestSeller && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span>🔥</span>
                        <span>الأكثر مبيعاً</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">منتج مميز</span>
                    {product.isFeatured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        فعال
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFeatured(product)}
                    disabled={isUpdating}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                      product.isFeatured 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-yellow-300' 
                        : 'bg-gray-200 border-2 border-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                        product.isFeatured ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                    {isUpdating && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 bg-white rounded-full animate-ping opacity-75" />
                      </span>
                    )}
                  </button>
                </div>

                {/* Best Seller Toggle */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">الأكثر مبيعاً</span>
                    {product.isBestSeller && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        فعال
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBestSeller(product)}
                    disabled={isUpdating}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                      product.isBestSeller 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-2 border-green-300' 
                        : 'bg-gray-200 border-2 border-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                        product.isBestSeller ? 'translate-x-1' : 'translate-x-7'
                      }`}
                    />
                    {isUpdating && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 bg-white rounded-full animate-ping opacity-75" />
                      </span>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Edit size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {hasActiveFilters || searchTerm
              ? 'لا توجد منتجات تطابق البحث'
              : 'لا توجد منتجات حتى الآن'}
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2.5 rounded-lg hover:bg-[#a01829] transition-colors"
          >
            <Plus size={20} />
            إضافة منتج جديد
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* معلومات الصفحة */}
          <div className="text-sm text-gray-600">
            عرض {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total} منتج
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: 1 })}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              الأول
            </button>
            
            <button
              onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
               <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters({ ...filters, page: pageNum })}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      pagination.page === pageNum
                        ? 'bg-[#C41E3A] text-white shadow-lg scale-110'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>

            <button
              onClick={() => setFilters({ ...filters, page: pagination.totalPages })}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              الأخير
            </button>
          </div>

          {/* Quick Jump */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">الانتقال إلى صفحة:</span>
            <input
              type="number"
              min="1"
              max={pagination.totalPages}
              value={pagination.page}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= pagination.totalPages) {
                  setFilters({ ...filters, page });
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
            />
            <span className="text-gray-600">من {pagination.totalPages}</span>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <Productdialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />

      {productToDelete && (
        <DeleteProductDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
          }}
          productId={productToDelete.id}
          productName={productToDelete.name}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}