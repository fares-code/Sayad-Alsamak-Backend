// src/app/components/Orders/OrderDetailsDialog.tsx

'use client';

import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/order';
import { X, Package, MapPin, CreditCard, Truck, User, Phone } from 'lucide-react';
import Image from 'next/image';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
}

export default function OrderDetailsDialog({
  isOpen,
  onClose,
  order,
  onSuccess,
}: OrderDetailsDialogProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
      [OrderStatus.CONFIRMED]: 'text-blue-600 bg-blue-100',
      [OrderStatus.PREPARING]: 'text-purple-600 bg-purple-100',
      [OrderStatus.OUT_FOR_DELIVERY]: 'text-indigo-600 bg-indigo-100',
      [OrderStatus.DELIVERED]: 'text-green-600 bg-green-100',
      [OrderStatus.CANCELLED]: 'text-red-600 bg-red-100',
      [OrderStatus.RETURNED]: 'text-gray-600 bg-gray-100',
    };
    return colors[status];
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      [OrderStatus.PENDING]: 'قيد الانتظار',
      [OrderStatus.CONFIRMED]: 'مؤكد',
      [OrderStatus.PREPARING]: 'قيد التجهيز',
      [OrderStatus.OUT_FOR_DELIVERY]: 'قيد التوصيل',
      [OrderStatus.DELIVERED]: 'تم التسليم',
      [OrderStatus.CANCELLED]: 'ملغي',
      [OrderStatus.RETURNED]: 'مرتجع',
    };
    return labels[status];
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    const labels = {
      [PaymentStatus.PENDING]: 'قيد الانتظار',
      [PaymentStatus.PAID]: 'مدفوع',
      [PaymentStatus.FAILED]: 'فشل',
      [PaymentStatus.REFUNDED]: 'مسترد',
    };
    return labels[status];
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels = {
      [PaymentMethod.CASH_ON_DELIVERY]: 'الدفع عند الاستلام',
      [PaymentMethod.CREDIT_CARD]: 'بطاقة ائتمان',
      [PaymentMethod.MOBILE_WALLET]: 'محفظة إلكترونية',
    };
    return labels[method];
  };

  return (
    <>
      {/* ✅ Backdrop شفاف */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h2>
              <p className="text-sm text-gray-600 mt-1">
                رقم الطلب: #{order.orderNumber || order.id.slice(0, 12)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-600">حالة الطلب</p>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-600">حالة الدفع</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={18} className="text-gray-600" />
                  <p className="text-sm text-gray-600">طريقة الدفع</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} />
                معلومات العميل
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">الاسم</p>
                  <p className="font-medium text-gray-900">{order.address?.fullName || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone size={14} />
                    رقم الهاتف
                  </p>
                  <p className="font-medium text-gray-900">{order.address?.phone || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    المحافظة
                  </p>
                  <p className="font-medium text-gray-900">{order.address?.governorate || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    المدينة
                  </p>
                  <p className="font-medium text-gray-900">{order.address?.city || 'غير محدد'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    المنطقة
                  </p>
                  <p className="font-medium text-gray-900">{order.address?.district || 'غير محدد'}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} />
                  الشارع
                </p>
                <p className="font-medium text-gray-900">{order.address?.street || 'غير محدد'}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package size={18} />
                المنتجات ({order.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName || 'منتج'}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.productName || 'منتج'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          الكمية: {item.quantity} × {item.price.toFixed(2)} ج.م
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">
                          {(item.total || item.price * item.quantity).toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد منتجات</p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} />
                تفاصيل الدفع
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium text-gray-900">
                    {(order.subtotal || 0).toFixed(2)} ج.م
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الخصم</span>
                    <span className="font-medium text-green-600">
                      -{order.discount.toFixed(2)} ج.م
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تكلفة التوصيل</span>
                  <span className="font-medium text-gray-900">
                    {order.deliveryFee === 0 ? 'مجاني' : `${order.deliveryFee.toFixed(2)} ج.م`}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الضريبة</span>
                    <span className="font-medium text-gray-900">
                      {order.tax.toFixed(2)} ج.م
                    </span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                  <span className="text-xl font-bold text-[#C41E3A]">
                    {(order.total || 0).toFixed(2)} ج.م
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">طريقة الدفع</span>
                    <span className="font-medium text-gray-900">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.customerNotes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">ملاحظات العميل</h3>
                <p className="text-gray-700">{order.customerNotes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">معلومات إضافية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">تاريخ الطلب</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">آخر تحديث</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.updatedAt).toLocaleString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </>
  );
}