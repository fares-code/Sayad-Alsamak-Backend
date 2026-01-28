'use client'
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useFeaturedProducts, useBestSellers, useHomepageContent } from '@/hooks/useHomepage';
import { Product } from '@/types/homepage';
import toast, { Toaster } from 'react-hot-toast';

const SectionThree = () => {
  const scrollContainerRef1 = useRef<HTMLDivElement>(null);
  const scrollContainerRef2 = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  
  const { products: featuredProducts, loading: featuredLoading, fetchProducts: fetchFeaturedProducts } = useFeaturedProducts();
  const { products: bestSellers, loading: bestSellersLoading, fetchProducts: fetchBestSellers } = useBestSellers();
  const { content, loading: contentLoading } = useHomepageContent();

  useEffect(() => {
    fetchFeaturedProducts({ limit: 10 });
    fetchBestSellers({ limit: 10 });
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
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
      name: product.name,
      price: product.price
    });
    
    // استخدم productId نفسه كـ id
    addToCart({
      id: product.id, 
      productId: product.id, // Add missing productId
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
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

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const discount = getDiscountPercentage(product.price, product.originalPrice);
    
    // Ensure product has required data
    if (!product || !product.name) {
      return null;
    }
    
    return (
      <div className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md overflow-hidden relative group hover:shadow-xl transition-shadow duration-300">
        {/* Badge */}
        {discount && (
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white px-4 py-2 font-bold text-sm rounded-br-lg shadow-lg">
              خصم {discount}%
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 bg-gray-50 flex items-center justify-center">
          <Image
            src={product.image || '/product_Image.png'}
            alt={product.name}
            width={180}
            height={180}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h3 className="text-gray-800 font-semibold mb-2">{product.name}</h3>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-yellow-500 font-bold text-lg">{product.price} جنيه</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">{product.originalPrice} جنيه</span>
            )}
          </div>
          <p className="text-gray-500 text-xs mb-3">{product.category?.name || 'منتج'} طازج</p>
          
          {/* Add to Cart Button */}
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-semibold py-2.5 px-4 rounded transition-colors duration-300"
          >
            أضف الي السلة
          </button>
        </div>
      </div>
    );
  };

  const ProductSection = ({ 
    title, 
    products, 
    scrollRef,
    loading
  }: { 
    title: string; 
    products: Product[]; 
    scrollRef: React.RefObject<HTMLDivElement | null>;
    loading: boolean;
  }) => (
    <div className="mb-16">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {loading ? "جاري التحميل..." : title}
      </h2>

      {/* Products Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(scrollRef, 'left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all duration-300"
          aria-label="السابق"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Products Container */}
        {loading ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 text-center space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                  <div className="h-8 w-28 bg-gray-200 rounded mx-auto mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 px-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لا توجد منتجات متاحة حالياً
            </h3>
            <p className="text-gray-500">
              يرجى التحقق لاحقاً أو التواصل معنا للمزيد من المعلومات
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Right Arrow */}
        {!loading && products.length > 0 && (
          <button
            onClick={() => scroll(scrollRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all duration-300"
            aria-label="التالي"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50" dir="rtl">
      <Toaster />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section 1: عروض اليوم المميزة */}
        <ProductSection
          title={content?.sectionThreeTitle || "المنتجات المميزة"}
          products={featuredProducts}
          scrollRef={scrollContainerRef1}
          loading={featuredLoading}
        />

        {/* Section 2: المنتجات الأكثر مبيعا */}
        <ProductSection
          title="المنتجات الأكثر مبيعا"
          products={bestSellers}
          scrollRef={scrollContainerRef2}
          loading={bestSellersLoading}
        />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SectionThree;