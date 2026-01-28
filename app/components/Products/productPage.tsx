'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { getAllProducts, Product, FilterProductParams, ProductType } from '@/services/products-service';
import { useCart } from '@/app/context/CartContext';
import axiosInstance from '@/lib/axiosInterceptor';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filters, setFilters] = useState<FilterProductParams>({
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  });

  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories();
    
    // Check for URL parameters and set initial filters
    const typeParam = searchParams.get('type');
    const initialFilters: FilterProductParams = {
      page: 1,
      limit: 20
    };
    
    if (typeParam === 'WHOLESALE') {
      initialFilters.type = ProductType.WHOLESALE;
      setActiveFilter('wholesale');
    }
    
    setFilters(initialFilters);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      console.log('Categories response:', data);
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products with filters:', filters);
      const response = await getAllProducts(filters);
      console.log('Products response:', response);
      setProducts(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveFilter(categoryId);
    if (categoryId === 'all') {
      setFilters({ categoryId: undefined, type: undefined, page: 1, limit: 20 });
    } else if (categoryId === 'wholesale') {
      setFilters({ categoryId: undefined, type: 'WHOLESALE', page: 1, limit: 20 });
    } else {
      setFilters({ categoryId, type: undefined, page: 1, limit: 20 });
    }
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // تأكد من وجود productId
    if (!product.id) {
      console.error('Product missing ID:', product);
      toast.error('خطأ: لا يمكن إضافة المنتج للسلة', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    console.log('Adding product to cart:', {
      productId: product.id,
      name: product.nameAr,
      price: product.price
    });
    
    // استخدم Date.now() للـ id (للـ UI فقط)
    // واستخدم product.id للـ productId (MongoDB ObjectId)
    addToCart({
      id: Date.now(), // رقم فريد للـ UI
      productId: product.id, // MongoDB ObjectId - الأهم!
      name: product.nameAr,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.mainImage
    });
    
    toast.success('تم الإضافة إلى السلة بنجاح!', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: 'bold',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '🛒',
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = calculateDiscount(product.price, product.originalPrice);
    
    return (
      <Link 
        href={`/products/${product.id}`}
        className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md overflow-hidden relative group hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-0 left-0 z-10 flex gap-1">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white px-3 py-1.5 font-bold text-xs rounded-br-lg shadow-lg">
              {discount}%
            </div>
          )}
          
          {/* Product Type Badge */}
          {product.type === 'WHOLESALE' && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-3 py-1.5 font-bold text-xs rounded-br-lg shadow-lg">
              جملة
            </div>
          )}
          
          {product.type === 'RETAIL' && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1.5 font-bold text-xs rounded-br-lg shadow-lg">
              قطاعي
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative h-48 bg-gray-50 flex items-center justify-center">
          <Image
            src={product.mainImage}
            alt={product.nameAr}
            width={150}
            height={150}
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h3 className="text-gray-800 font-semibold mb-2 hover:text-red-600 transition-colors">
            {product.nameAr}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-yellow-500 font-bold text-lg">{product.price} جنيه</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">{product.originalPrice} جنيه</span>
            )}
          </div>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {product.descriptionAr || product.description || `${product.nameAr} - ${product.unit}`}
          </p>
          
          {/* Add to Cart Button */}
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-semibold py-2.5 px-4 rounded transition-colors duration-300 relative z-10"
          >
            أضف الي السلة
          </button>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Toaster />
      
      {/* Category Filter Pills */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                activeFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              جميع المنتجات
            </button>

            <button
              onClick={() => handleCategoryClick('wholesale')}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                activeFilter === 'wholesale'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              منتجات الجملة
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm ${
                  activeFilter === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {category.nameAr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              لا توجد منتجات
            </h3>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters({ ...filters, page: pageNum })}
                    className={`w-10 h-10 rounded flex items-center justify-center font-bold transition-all ${
                      pagination.page === pageNum
                        ? 'bg-red-600 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap');
      `}</style>
    </div>
  );
}