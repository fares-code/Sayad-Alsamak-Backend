'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useBestSellers } from '@/hooks/useHomepage';

const CartComponent = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { products: bestSellers, loading: bestSellersLoading, fetchProducts } = useBestSellers();

  useEffect(() => {
    fetchProducts({ limit: 4 });
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16" dir="rtl">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">السلة فارغة</h2>
          <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات للسلة بعد</p>
          <Link
            href="/"
            className="inline-block bg-[#C41E3A] hover:bg-[#a01829] text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-4"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain rounded"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">جمبري معد طازج فرينش 1 كجم</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-[#C41E3A] font-bold text-xl">
                    ج.م {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ج.م {item.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                >
                  <Plus size={18} className="text-gray-600" />
                </button>
                <span className="text-lg font-bold w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                >
                  <Minus size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Best Sellers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">الأفضل مبيعاً</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellersLoading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="relative h-40 bg-gray-200">
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded w-16 h-4"></div>
                  </div>
                  <div className="p-3 text-center space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product) => {
                const discount = product.originalPrice && product.originalPrice > product.price 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      {discount && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                          خصم {discount}%
                        </div>
                      )}
                      <div className="relative h-40 bg-gray-50">
                        <Image
                          src={product.image || "/product_Image.png"}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{product.description || product.category?.name || 'منتج طازج'}</p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-yellow-500 font-bold">ج.م {product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-xs">ج.م {product.originalPrice}</span>
                        )}
                      </div>

                      <Link 
                        href={`/products/${product.id}`}
                        className="w-full bg-white border border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white text-sm font-semibold py-2 rounded transition-colors duration-300 text-center block"
                      >
                        عرض المنتج
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              // No products found
              <div className="col-span-2 md:col-span-4 text-center py-8">
                <p className="text-gray-500">لا توجد منتجات متاحة حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="w-full bg-white border-2 border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
          >
            متابعة التسوق
          </Link>
          <Link
            href="/cart/checkout"
            className="w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
          >
            إكمال الطلب
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;