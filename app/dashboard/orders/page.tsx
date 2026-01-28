// src/app/dashboard/orders/page.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  useGetAllOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from '@/hooks/useOrder';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Filter,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import OrderDetailsDialog from '@/app/components/Orders/OrderDetailsDialog';
import UpdateOrderStatusDialog from '@/app/components/Orders/UpdateOrderStatusDialog';

export default function OrdersPage() {
  const { orders, loading, fetchOrders } = useGetAllOrders();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);

  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  // ✅ جلب البيانات أول مرة عند تحميل الصفحة
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('فشل في تحميل الطلبات');
      }
    };

    loadInitialData();
  }, []); // ✅ Empty dependency array - يتنفذ مرة واحدة فقط

  // ✅ حساب الإحصائيات كل ما الـ orders تتغير
  useEffect(() => {
    calculateStats();
  }, [orders]);

  const loadOrders = async () => {
    try {
      await fetchOrders();
    } catch (error) {
      console.error('Error reloading orders:', error);
      toast.error('فشل في تحميل الطلبات');
    }
  };

  const calculateStats = () => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      setStats({
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      });
      return;
    }

    const total = orders.length;
    const pending = orders.filter((o: Order) => o.status === OrderStatus.PENDING).length;
    const confirmed = orders.filter((o: Order) => o.status === OrderStatus.CONFIRMED).length;
    const processing = orders.filter((o: Order) => o.status === OrderStatus.PREPARING).length;
    const shipped = orders.filter((o: Order) => o.status === OrderStatus.OUT_FOR_DELIVERY).length;
    const delivered = orders.filter((o: Order) => o.status === OrderStatus.DELIVERED).length;
    const cancelled = orders.filter((o: Order) => o.status === OrderStatus.CANCELLED).length;

    const totalRevenue = orders
      .filter((o: Order) => o.status !== OrderStatus.CANCELLED)
      .reduce((sum: number, order: Order) => {
        return sum + (order.total || 0);
      }, 0);

    setStats({
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsUpdateStatusDialogOpen(true);
  };

  const handleSuccess = () => {
    loadOrders();
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: 'قيد الانتظار',
      },
      [OrderStatus.CONFIRMED]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: CheckCircle,
        label: 'مؤكد',
      },
      [OrderStatus.PREPARING]: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: Package,
        label: 'قيد التجهيز',
      },
      [OrderStatus.OUT_FOR_DELIVERY]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        icon: Truck,
        label: 'قيد التوصيل',
      },
      [OrderStatus.DELIVERED]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'تم التسليم',
      },
      [OrderStatus.CANCELLED]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'ملغي',
      },
      [OrderStatus.RETURNED]: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: XCircle,
        label: 'مرتجع',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} className="ml-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PENDING]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'قيد الانتظار',
      },
      [PaymentStatus.PAID]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'مدفوع',
      },
      [PaymentStatus.FAILED]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'فشل',
      },
      [PaymentStatus.REFUNDED]: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'مسترد',
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  // ✅ فلترة الطلبات
  const filteredOrders = !orders || !Array.isArray(orders) 
    ? [] 
    : filter === 'all' 
      ? orders 
      : orders.filter((order) => order.status === filter);

  // ✅ Loading state
  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة جميع طلبات العملاء</p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-[#C41E3A] text-white rounded-lg hover:bg-[#a01829] transition-colors font-medium flex items-center gap-2"
        >
          <Package size={18} />
          تحديث
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تم التسليم</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-[#C41E3A]">
                {stats.totalRevenue.toFixed(2)} ج.م
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-[#C41E3A]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600 mb-1">مؤكد</p>
          <p className="text-lg font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600 mb-1">قيد التجهيز</p>
          <p className="text-lg font-bold text-purple-600">{stats.processing}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600 mb-1">تم الشحن</p>
          <p className="text-lg font-bold text-indigo-600">{stats.shipped}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-xs text-gray-600 mb-1">ملغي</p>
          <p className="text-lg font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={20} className="text-gray-600" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            الكل ({stats.total})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.PENDING)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.PENDING
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            قيد الانتظار ({stats.pending})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.CONFIRMED)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.CONFIRMED
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            مؤكد ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.PREPARING)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.PREPARING
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            قيد التجهيز ({stats.processing})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.OUT_FOR_DELIVERY)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.OUT_FOR_DELIVERY
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            قيد التوصيل ({stats.shipped})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.DELIVERED)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.DELIVERED
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            تم التسليم ({stats.delivered})
          </button>
          <button
            onClick={() => setFilter(OrderStatus.CANCELLED)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === OrderStatus.CANCELLED
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ملغي ({stats.cancelled})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.address?.fullName || 'غير محدد'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.address?.phone || 'غير محدد'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {order.items?.length || 0} منتج
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {(order.total || 0).toFixed(2)} ج.م
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="تحديث الحالة"
                      >
                        <Package size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">لا توجد طلبات</p>
            <p className="text-sm text-gray-400">
              {filter !== 'all' ? 'جرب تغيير الفلتر' : 'ابدأ بإنشاء طلب جديد'}
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedOrder && (
        <>
          <OrderDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => {
              setIsDetailsDialogOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onSuccess={handleSuccess}
          />

          <UpdateOrderStatusDialog
            isOpen={isUpdateStatusDialogOpen}
            onClose={() => {
              setIsUpdateStatusDialogOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
}