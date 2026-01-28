'use client';

import { useState } from 'react';
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  getOrdersByStatus,
  createOrderFromCart,
  updateOrderStatus,
  updatePaymentStatus,
} from '@/services/order-service';
import {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  UpdatePaymentStatusPayload,
  OrderStatus,
} from '@/types/order';
import { ApiResponse } from '@/services/order-service';

export const useGetAllOrders = () => {
const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchOrders = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getAllOrders();
    console.log(response.data);

    setOrders(response.data); // ✅ الصح
    return response.data;
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || 'فشل في جلب الطلبات';
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return { orders, loading, error, fetchOrders };
};

export const useGetUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserOrders();
      setOrders(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب طلبات المستخدم';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, fetchUserOrders };
};

export const useGetOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(orderId);
      setOrder(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب الطلب';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error, fetchOrder };
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateOrderPayload) => {
    setLoading(true);
    try {
      const response = await createOrderFromCart(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إنشاء الطلب';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};

export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({ orderId, payload }: { orderId: string; payload: UpdateOrderStatusPayload }) => {
    setLoading(true);
    try {
      const response = await updateOrderStatus(orderId, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث حالة الطلب';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};

export const useUpdatePaymentStatus = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async ({ orderId, payload }: { orderId: string; payload: UpdatePaymentStatusPayload }) => {
    setLoading(true);
    try {
      const response = await updatePaymentStatus(orderId, payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في تحديث حالة الدفع';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};