'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useGetProduct } from '@/hooks/products-hooks';
import { useCreateReview, useGetReviews } from '@/hooks/reviews-hooks';
import { useCart } from '@/app/context/CartContext';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailPage({ productId }: { productId: string }) {
  const { product, loading, error, fetchProduct } = useGetProduct();
  const { mutateAsync: createReview, isPending: isCreatingReview } = useCreateReview();
  const { reviews, loading: reviewsLoading, error: reviewsError, fetchReviews } = useGetReviews();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'info'>('description');
  
  const [reviewForm, setReviewForm] = useState({
    
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      fetchReviews(product.id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: productId,
      productId: productId,
      name: product.nameAr,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.mainImage
    }, quantity);
    
    toast.success(`تم إضافة ${quantity} من ${product.nameAr} إلى السلة!`, {
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
    
    setQuantity(1);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    if (reviewForm.rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }

    try {
      await createReview({
        productId:productId|| product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment || undefined
      });
      
      toast.success('تم إضافة التقييم بنجاح! سيتم مراجعته قريباً');
      
      setReviewForm({
        rating: 0,
        comment: ''
      });
      
      // تحديث المنتج لجلب التقييمات الجديدة
      fetchProduct(product.id);
      fetchReviews(product.id);
    } catch (error: any) {
      toast.error(error.message || 'فشل في إضافة التقييم');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">حدث خطأ</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-700">المنتج غير موجود</h2>
      </div>
    );
  }

  const finalPrice = product.price;
  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <Toaster />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.images[selectedImage] || product.mainImage}
                  alt={product.nameAr}
                  fill
                  className="object-contain"
                  unoptimized
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    خصم {product.discount}%
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-red-600' : 'border-gray-200'
                      }`}
                    >
                      <Image src={img} alt={`صورة المنتج ${idx + 1}`} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.nameAr}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(product.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.totalReviews} تقييم)</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className="font-semibold text-green-600">متوفر</span>
                  </div>
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الفئة:</span>
                      <span className="font-semibold">{product.category.nameAr}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">المنشأ:</span>
                      <span className="font-semibold">{product.origin}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-semibold">{product.weight} {product.unit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-red-600">{finalPrice.toFixed(2)} ج.م</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-400 line-through">{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <p className="text-sm text-green-600">وفّر {discountAmount.toFixed(2)} ج.م</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 font-semibold border-b-2 transition ${
                  activeTab === 'description'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                الوصف
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 font-semibold border-b-2 transition ${
                  activeTab === 'info'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                معلومات إضافية
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 font-semibold border-b-2 transition ${
                  activeTab === 'reviews'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                التقييمات ({reviews.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.descriptionAr || 'لا يوجد وصف متاح لهذا المنتج'}
                </p>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.weight && (
                    <div>
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-semibold mr-2">{product.weight} {product.unit}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div>
                      <span className="text-gray-600">المنشأ:</span>
                      <span className="font-semibold mr-2">{product.origin}</span>
                    </div>
                  )}
                  {product.category && (
                    <div>
                      <span className="text-gray-600">الفئة:</span>
                      <span className="font-semibold mr-2">{product.category.nameAr}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Existing Reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 text-sm">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>لا توجد تقييمات حتى الآن</p>
                    <p className="text-sm mt-2">كن أول من يقيّم هذا المنتج</p>
                  </div>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleSubmitReview} className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">أضف تقييمك</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="hover:scale-110 transition"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= reviewForm.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <textarea
                      placeholder="اكتب تقييمك هنا... (اختياري)"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      rows={4}
                    ></textarea>
                    
                    <button
                      type="submit"
                      disabled={isCreatingReview}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                      {isCreatingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}