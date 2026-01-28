// src/services/order-service.ts
import axiosInstance from '@/lib/axiosInterceptor';
import {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  UpdatePaymentStatusPayload,
  OrderStatus,
} from '@/types/order';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// إنشاء طلب من السلة
export const createOrderFromCart = async (
  payload: CreateOrderPayload,
): Promise<ApiResponse<Order>> => {
  const { data } = await axiosInstance.post('/orders', payload);
  return data;
};

// جلب طلبات المستخدم
export const getUserOrders = async (): Promise<ApiResponse<Order[]>> => {
  const { data } = await axiosInstance.get('/orders/my-orders');
  return data;
};

// جلب طلب معين بالـ ID
export const getOrderById = async (orderId: string): Promise<ApiResponse<Order>> => {
  const { data } = await axiosInstance.get(`/orders/${orderId}`); // ✅ تم التصليح
  return data;
};

// جلب جميع الطلبات (للإدمن)
export const getAllOrders = async (): Promise<ApiResponse<Order[]>> => {
  const { data } = await axiosInstance.get('/orders');
  console.log('API Response:', data);
  
  // ✅ التحقق من شكل الاستجابة
  // إذا كان Backend بيرجع array مباشرة
  if (Array.isArray(data)) {
    return {
      data: data,
      message: 'تم جلب الطلبات بنجاح'
    };
  }
  
  // إذا كان Backend بيرجع object فيه data
  return data;
};

// جلب الطلبات حسب الحالة
export const getOrdersByStatus = async (
  status: OrderStatus,
): Promise<ApiResponse<Order[]>> => {
  const { data } = await axiosInstance.get(`/orders/status/${status}`); // ✅ تم التصليح
  return data;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusPayload,
): Promise<ApiResponse<Order>> => {
  const { data } = await axiosInstance.put(`/orders/${orderId}/status`, payload); // ✅ تم التصليح
  return data;
};

// تحديث حالة الدفع
export const updatePaymentStatus = async (
  orderId: string,
  payload: UpdatePaymentStatusPayload,
): Promise<ApiResponse<Order>> => {
  const { data } = await axiosInstance.put(`/orders/${orderId}/payment-status`, payload); // ✅ تم التصليح
  return data;
};