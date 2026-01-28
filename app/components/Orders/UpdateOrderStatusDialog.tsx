// src/app/components/Orders/UpdateOrderStatusDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { useUpdateOrderStatus, useUpdatePaymentStatus } from '@/hooks/useOrder';
import { X, Package, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UpdateOrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
}

export default function UpdateOrderStatusDialog({
  isOpen,
  onClose,
  order,
  onSuccess,
}: UpdateOrderStatusDialogProps) {
  const { mutateAsync: updateOrderStatus, isPending: isUpdatingOrder } =
    useUpdateOrderStatus();
  const { mutateAsync: updatePaymentStatus, isPending: isUpdatingPayment } =
    useUpdatePaymentStatus();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(order.status);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(
    order.paymentStatus
  );

  // ✅ تحديث القيم عند تغيير الطلب
  useEffect(() => {
    if (order) {
      setSelectedOrderStatus(order.status);
      setSelectedPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  if (!isOpen) return null;

  const handleUpdateBoth = async () => {
    const orderChanged = selectedOrderStatus !== order.status;
    const paymentChanged = selectedPaymentStatus !== order.paymentStatus;

    if (!orderChanged && !paymentChanged) {
      toast.error('لم يتم إجراء أي تغييرات');
      return;
    }

    try {
      console.log('🔄 Starting update...', {
        orderId: order.id,
        orderChanged,
        paymentChanged,
        selectedOrderStatus,
        selectedPaymentStatus
      });

      if (orderChanged) {
        console.log('📦 Updating order status...');
        const orderResult = await updateOrderStatus({
          orderId: order.id,
          payload: { status: selectedOrderStatus },
        });
        console.log('✅ Order status updated:', orderResult);
      }

      if (paymentChanged) {
        console.log('💳 Updating payment status...');
        const paymentResult = await updatePaymentStatus({
          orderId: order.id,
          payload: { paymentStatus: selectedPaymentStatus },
        });
        console.log('✅ Payment status updated:', paymentResult);
      }

      toast.success('تم تحديث الحالات بنجاح');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Update error:', error);
      toast.error(error.message || 'فشل في التحديث');
    }
  };

  const getOrderStatusLabel = (status: OrderStatus) => {
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

  const isPending = isUpdatingOrder || isUpdatingPayment;

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
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full pointer-events-auto"
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">تحديث حالة الطلب</h2>
              <p className="text-sm text-gray-600 mt-1">
                رقم الطلب: #{order.orderNumber || order.id.slice(0, 12)}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Warning Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">تنبيه مهم</p>
                <p>تأكد من تحديث الحالة بشكل صحيح. سيتم إرسال إشعار للعميل بأي تغييرات.</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">الحالة الحالية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">حالة الطلب</p>
                  <span className="inline-block px-3 py-1 bg-white border rounded-lg text-sm font-medium">
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">حالة الدفع</p>
                  <span className="inline-block px-3 py-1 bg-white border rounded-lg text-sm font-medium">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Order Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package size={18} />
                حالة الطلب الجديدة
              </label>
              <select
                value={selectedOrderStatus}
                onChange={(e) => {
                  console.log('Order status changed to:', e.target.value);
                  setSelectedOrderStatus(e.target.value as OrderStatus);
                }}
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {getOrderStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Payment Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CreditCard size={18} />
                حالة الدفع الجديدة
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => {
                  console.log('Payment status changed to:', e.target.value);
                  setSelectedPaymentStatus(e.target.value as PaymentStatus);
                }}
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41E3A] disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {getPaymentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">ملخص الطلب</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">العميل:</span>
                  <span className="font-medium">{order.address?.fullName || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد المنتجات:</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الإجمالي:</span>
                  <span className="font-medium text-[#C41E3A]">
                    {(order.total || 0).toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
            <button
              onClick={handleUpdateBoth}
              disabled={isPending}
              className="px-6 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#a01829] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  جاري التحديث...
                </>
              ) : (
                'تحديث الحالة'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}