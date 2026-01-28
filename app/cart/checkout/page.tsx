// src/app/cart/checkout/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useCreateOrder } from '@/hooks/useOrder';
import { PaymentMethod, ShippingMethod } from '@/types/order';
import OrderSuccessModal from '@/app/components/CartComponent/OrderSuccessModal';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    governorate: '',
    city: '',
    district: '',
    street: '',
    buildingNo: '',
    floor: '',
    apartment: '',
    landmark: '',
    notes: ''
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH_ON_DELIVERY);

  const shippingCost = shippingMethod === ShippingMethod.EXPRESS ? 50 : 0;
  const total = cartTotal + shippingCost;

  // Debug: تحقق من الـ cart عند التحميل
  useEffect(() => {
    console.log('Cart items:', cart);
    cart.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        productId: item.productId,
        name: item.name,
        hasProductId: !!item.productId
      });
    });
  }, [cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendWhatsAppMessage = () => {
    const phoneNumber = '201224226872';
    
    let message = `*طلب جديد من موقع صياد السمك* 🐟\n\n`;
    message += `*بيانات العميل:*\n`;
    message += `الاسم: ${formData.firstName} ${formData.lastName}\n`;
    message += `الهاتف: ${formData.phone}\n`;
    message += `البريد: ${formData.email}\n`;
    message += `المحافظة: ${formData.governorate}\n`;
    message += `المدينة: ${formData.city}\n`;
    message += `الحي: ${formData.district}\n`;
    message += `الشارع: ${formData.street}\n`;
    if (formData.buildingNo) message += `رقم المبنى: ${formData.buildingNo}\n`;
    if (formData.floor) message += `الطابق: ${formData.floor}\n`;
    if (formData.apartment) message += `الشقة: ${formData.apartment}\n`;
    if (formData.landmark) message += `علامة مميزة: ${formData.landmark}\n\n`;
    
    message += `*تفاصيل الطلب:*\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${item.price} جنيه\n`;
      message += `   الإجمالي: ${item.price * item.quantity} جنيه\n\n`;
    });
    
    message += `*ملخص الطلب:*\n`;
    message += `المجموع الفرعي: ${cartTotal} جنيه\n`;
    message += `الشحن: ${shippingCost === 0 ? 'مجاني' : shippingCost + ' جنيه'}\n`;
    message += `*الإجمالي الكلي: ${total} جنيه*\n\n`;
    
    message += `طريقة الدفع: ${paymentMethod === PaymentMethod.CASH_ON_DELIVERY ? 'الدفع عند الاستلام' : 'محفظة إلكترونية'}\n`;
    
    if (formData.notes) {
      message += `\nملاحظات: ${formData.notes}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // تحقق من أن كل المنتجات لها productId
    const invalidItems = cart.filter(item => !item.productId || !item.id);
    if (invalidItems.length > 0) {
      console.error('Items missing productId:', invalidItems);
      alert('خطأ: بعض المنتجات في السلة لا تحتوي على معرف صحيح. يرجى حذفها وإضافتها مرة أخرى.');
      return;
    }
    
    try {
      // إعداد البيانات - استخدم id إذا كان productId غير موجود
      const orderPayload = {
        items: cart.map(item => {
          const productId = String(item.productId || item.id);
          console.log('Mapping item:', { 
            originalItem: item, 
            productId,
            willSend: { productId, quantity: item.quantity }
          });
          
          return {
            productId: productId,
            quantity: item.quantity,
          };
        }),
        address: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          governorate: formData.governorate,
          city: formData.city,
          district: formData.district,
          street: formData.street,
          buildingNo: formData.buildingNo || undefined,
          floor: formData.floor || undefined,
          apartment: formData.apartment || undefined,
          landmark: formData.landmark || undefined,
        },
        paymentMethod: paymentMethod,
        deliveryDate: undefined,
        deliveryTime: undefined,
        customerNotes: formData.notes || undefined,
      };

      console.log('Sending order payload:', JSON.stringify(orderPayload, null, 2));

      await createOrder(orderPayload);
      
      // إرسال الطلب عبر الواتساب
      // sendWhatsAppMessage();
      
      // إظهار modal النجاح
      setShowSuccessModal(true);
      
      // مسح السلة
      setTimeout(() => {
        clearCart();
      }, 1000);
      
    } catch (error: any) {
      console.error('فشل في إنشاء الطلب:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || 'حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  if (cart.length === 0 && !showSuccessModal) {
    router.push('/cart');
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            تفاصيل الطلب
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              {/* Cart Summary */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">إجمالي السلة</h2>
                
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 mb-4 pb-4 border-b">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">الكمية: {item.quantity}</span>
                        <span className="text-sm font-bold text-[#C41E3A]">
                          ج.م {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">بيانات الفاتورة</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-bold">ج.م {cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-bold text-green-600">
                      {shippingCost === 0 ? 'مجاني' : `ج.م ${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-xl font-bold">الإجمالي</span>
                    <span className="text-2xl font-bold text-[#C41E3A]">
                      ج.م {total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الدفع و التوصيل</h2>
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      الاسم الأول <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="أدخل الاسم"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="أدخل اسم العائلة"
                      required
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      رقم الموبايل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="01xxxxxxxxx"
                      required
                    />
                  </div>
                </div>

                {/* Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      required
                    >
                      <option value="">اختر المحافظة</option>
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الدقهلية">الدقهلية</option>
                      <option value="الشرقية">الشرقية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="الغربية">الغربية</option>
                      <option value="كفر الشيخ">كفر الشيخ</option>
                      <option value="البحيرة">البحيرة</option>
                      <option value="بورسعيد">بورسعيد</option>
                      <option value="دمياط">دمياط</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                      <option value="السويس">السويس</option>
                      <option value="شمال سيناء">شمال سيناء</option>
                      <option value="جنوب سيناء">جنوب سيناء</option>
                      <option value="الأقصر">الأقصر</option>
                      <option value="أسوان">أسوان</option>
                      <option value="قنا">قنا</option>
                      <option value="البحر الأحمر">البحر الأحمر</option>
                      <option value="الوادي الجديد">الوادي الجديد</option>
                      <option value="مطروح">مطروح</option>
                      <option value="الفيوم">الفيوم</option>
                      <option value="بني سويف">بني سويف</option>
                      <option value="المنيا">المنيا</option>
                      <option value="أسيوط">أسيوط</option>
                      <option value="سوهاج">سوهاج</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      المدينة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="مثال: مدينة نصر"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      الحي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="مثال: الحي السابع"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      الشارع <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="مثال: شارع مصطفى النحاس"
                      required
                    />
                  </div>
                </div>

                {/* Optional Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      رقم المبنى
                    </label>
                    <input
                      type="text"
                      name="buildingNo"
                      value={formData.buildingNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      الطابق
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-right">
                      رقم الشقة
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                      placeholder="8"
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    علامة مميزة
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right"
                    placeholder="مثال: بجوار مسجد الرحمن"
                  />
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 text-right">
                    الملاحظات
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-right resize-none"
                    placeholder="ملاحظات إضافية (اختياري)"
                  ></textarea>
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">طريقة الشحن</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#C41E3A] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={ShippingMethod.STANDARD}
                          checked={shippingMethod === ShippingMethod.STANDARD}
                          onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                          className="w-5 h-5 text-[#C41E3A]"
                        />
                        <span className="font-semibold">الشحن العادي</span>
                      </div>
                      <span className="text-green-600 font-bold">مجاني</span>
                    </label>

                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#C41E3A] transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={ShippingMethod.EXPRESS}
                          checked={shippingMethod === ShippingMethod.EXPRESS}
                          onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
                          className="w-5 h-5 text-[#C41E3A]"
                        />
                        <span className="font-semibold">الشحن السريع</span>
                      </div>
                      <span className="font-bold">ج.م 50</span>
                    </label>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">طريقة الدفع</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#C41E3A] transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value={PaymentMethod.CASH_ON_DELIVERY}
                        checked={paymentMethod === PaymentMethod.CASH_ON_DELIVERY}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-5 h-5 text-[#C41E3A] ml-3"
                      />
                      <span className="font-semibold">الدفع عند الاستلام</span>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#C41E3A] transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value={PaymentMethod.MOBILE_WALLET}
                        checked={paymentMethod === PaymentMethod.MOBILE_WALLET}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-5 h-5 text-[#C41E3A] ml-3"
                      />
                      <span className="font-semibold">محفظة إلكترونية</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <OrderSuccessModal onClose={() => {
          setShowSuccessModal(false);
          router.push('/');
        }} />
      )}
    </>
  );
};

export default CheckoutPage;