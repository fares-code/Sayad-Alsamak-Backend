'use client';

import { useEffect, useState } from 'react';
import { Users, User, ShoppingCart, ListOrdered, LayoutDashboard,Package } from "lucide-react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useGetAllOrders } from '@/hooks/useOrder';
import { useGetProducts } from '@/hooks/products-hooks';
import { useGetCategories } from '@/hooks/categories-hooks';
import { useContactMessagesStats } from '@/hooks/useContactMessages';
import { OrderStatus } from '@/types/order';

ChartJS.register(
  Tooltip, Legend, Title, CategoryScale, LinearScale, PointElement, LineElement, ArcElement
);

const PRIMARY_ACCENT = '#C41E3A';
const SECONDARY_ACCENT = '#5c68ff';

const STAT_CARD_DEFS = [
  { key: "totalClients", label: "إجمالي العملاء", icon: User, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', hoverColor: 'hover:border-blue-600' },
  { key: "totalProducts", label: "إجمالي المنتجات", icon: ShoppingCart, iconBg: 'bg-green-100', iconColor: 'text-green-600', hoverColor: 'hover:border-green-600' },
  { key: "totalCategories", label: "إجمالي الفئات", icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', hoverColor: 'hover:border-purple-600' },
  { key: "totalOrders", label: "إجمالي الطلبات", icon: ListOrdered, iconBg: 'bg-red-100', iconColor: 'text-red-600', hoverColor: 'hover:border-red-600' },
];

interface TopStatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  hoverColor: string;
  loading?: boolean;
}

function TopStatCard({ title, value, icon: Icon, iconBg, iconColor, hoverColor, loading }: TopStatCardProps) {
  return (
    <div className={`group shadow-md rounded-xl p-6 transition-all duration-300 border-2 border-transparent ${hoverColor} bg-white hover:shadow-xl`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-full ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-800">
        {loading ? (
          <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

interface LineChartCardProps {
  orders: any[];
  loading: boolean;
}

function LineChartCard({ orders, loading }: LineChartCardProps) {
  const getWeeklyOrdersData = () => {
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const orderCounts = new Array(7).fill(0);
    
    if (!orders || orders.length === 0) {
      return { labels: days, data: [0, 0, 0, 0, 0, 0, 0] };
    }

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= weekAgo && orderDate <= today) {
        const dayIndex = orderDate.getDay(); // 0 = Sunday, 6 = Saturday
        // تحويل من النظام الإنجليزي للعربي (السبت = 0)
        const arabicDayIndex = dayIndex === 6 ? 0 : dayIndex + 1;
        orderCounts[arabicDayIndex]++;
      }
    });

    return { labels: days, data: orderCounts };
  };

  const weeklyData = getWeeklyOrdersData();

  const data = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: 'عدد الطلبات',
        data: weeklyData.data,
        fill: true,
        backgroundColor: 'rgba(196, 30, 58, 0.1)',
        borderColor: PRIMARY_ACCENT,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: PRIMARY_ACCENT,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: PRIMARY_ACCENT,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 10,
        callbacks: {
          label: (context: any) => ` الطلبات: ${Math.round(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'gray' },
        border: { display: false }
      },
      y: {
        min: 0,
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          color: 'gray',
          precision: 0
        },
        border: { display: false }
      }
    },
    layout: { padding: { top: 20 } }
  };

  return (
    <div className="shadow-xl rounded-xl p-6 h-[400px] border border-gray-100 bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        تقارير الطلبات الأسبوعية
      </h3>
      <div className="h-[calc(100%-40px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">جاري التحميل...</div>
          </div>
        ) : (
          <Line data={data} options={chartOptions as any} />
        )}
      </div>
    </div>
  );
}

interface DoughnutChartCardProps {
  orders: any[];
  loading: boolean;
}

function DoughnutChartCard({ orders, loading }: DoughnutChartCardProps) {
  const getOrderStatusDistribution = () => {
    if (!orders || orders.length === 0) {
      return {
        labels: ['مكتمل', 'قيد التنفيذ', 'ملغي'],
        data: [0, 0, 0],
        completedPercent: 0,
      };
    }

    // ✅ عد الطلبات باستخدام filter
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const confirmed = orders.filter(o => o.status === 'CONFIRMED').length;
    const preparing = orders.filter(o => o.status === 'PREPARING').length;
    const outForDelivery = orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length;
    const cancelled = orders.filter(o => o.status === 'CANCELLED').length;
    const returned = orders.filter(o => o.status === 'RETURNED').length;

    const total = orders.length;
    
    // ✅ التجميع
    const completed = delivered;
    const inProgress = pending + confirmed + preparing + outForDelivery;
    const cancelledTotal = cancelled + returned;

    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    console.log('📊 Chart Data:', {
      total,
      completed,
      inProgress,
      cancelled: cancelledTotal,
      completedPercent,
      breakdown: {
        delivered,
        pending,
        confirmed,
        preparing,
        outForDelivery,
        cancelled,
        returned
      }
    });

    return {
      labels: ['مكتمل', 'قيد التنفيذ', 'ملغي'],
      data: [completed, inProgress, cancelledTotal],
      completedPercent,
    };
  };

  const distribution = getOrderStatusDistribution();

  const data = {
    labels: distribution.labels,
    datasets: [
      {
        data: distribution.data,
        backgroundColor: [SECONDARY_ACCENT, '#fbb03b', '#e21f1f'],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          usePointStyle: true, 
          padding: 20, 
          color: 'gray',
          font: {
            family: 'Cairo, sans-serif',
            size: 12
          }
        }
      },
      tooltip: { 
        enabled: true,
        rtl: true,
        textDirection: 'rtl',
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} طلب (${percentage}%)`;
          }
        }
      },
    },
    elements: { arc: { borderWidth: 0 } }
  };

  return (
    <div className="shadow-xl rounded-xl p-6 h-[400px] border border-gray-100 bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">
        تحليلات الطلبات
      </h3>

      <div className="relative flex items-center justify-center h-[calc(100%-40px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">جاري التحميل...</div>
          </div>
        ) : distribution.data.every(v => v === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Package size={48} className="mb-2 opacity-50" />
            <p>لا توجد بيانات لعرضها</p>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={chartOptions as any} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transform -translate-y-4">
              <span className="text-2xl font-bold" style={{ color: PRIMARY_ACCENT }}>
                {distribution.completedPercent}%
              </span>
              <span className="text-sm text-gray-500">
                نسبة الإنجاز
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
interface RecentOrdersTableProps {
  orders: any[];
  loading: boolean;
}

function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  // أخذ آخر 4 طلبات فقط
  const recentOrders = orders?.slice(0, 4) || [];

  // ✅ استخدام الـ OrderStatus الصحيح
  const getStatusStyle = (status: OrderStatus) => {
    const styles = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-700',
      [OrderStatus.PREPARING]: 'bg-purple-100 text-purple-700',
      [OrderStatus.OUT_FOR_DELIVERY]: 'bg-indigo-100 text-indigo-700',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-700',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700',
      [OrderStatus.RETURNED]: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const translateStatus = (status: OrderStatus) => {
    const labels = {
      [OrderStatus.PENDING]: 'قيد الانتظار',
      [OrderStatus.CONFIRMED]: 'مؤكد',
      [OrderStatus.PREPARING]: 'قيد التجهيز',
      [OrderStatus.OUT_FOR_DELIVERY]: 'قيد التوصيل',
      [OrderStatus.DELIVERED]: 'تم التسليم',
      [OrderStatus.CANCELLED]: 'ملغي',
      [OrderStatus.RETURNED]: 'مرتجع',
    };
    return labels[status] || 'غير معروف';
  };

  if (loading) {
    return (
      <div className="shadow-xl rounded-xl p-4 sm:p-6 border border-gray-100 bg-white">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          الطلبات الأخيرة
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!recentOrders || recentOrders.length === 0) {
    return (
      <div className="shadow-xl rounded-xl p-4 sm:p-6 border border-gray-100 bg-white">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          الطلبات الأخيرة
        </h3>
        <div className="text-center py-8 text-gray-500">
          لا توجد طلبات حتى الآن
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-xl rounded-xl p-4 sm:p-6 border border-gray-100 bg-white">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        الطلبات الأخيرة
      </h3>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        {/* Table Header */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200 text-sm font-semibold text-gray-500">
          <div className="w-1/4 text-right">رقم الطلب</div>
          <div className="w-1/4 text-right">العميل</div>
          <div className="w-1/4 text-right">الإجمالي</div>
          <div className="w-1/4 text-center">الحالة</div>
        </div>

        {/* Table Body */}
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center py-4 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="w-1/4 text-right font-medium text-gray-600">
              #{order.orderNumber || order.id?.slice(0, 8)}
            </div>
            <div className="w-1/4 text-right font-medium">
              {order.address?.fullName || 'عميل'}
            </div>
            <div className="w-1/4 text-right font-bold text-gray-900">
              {(order.total || 0).toFixed(2)} ج.م
            </div>
            <div className="w-1/4 text-center">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                {translateStatus(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500 font-medium">رقم الطلب</span>
              <span className="text-sm font-semibold text-gray-700">
                #{order.orderNumber || order.id?.slice(0, 8)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500 font-medium">العميل</span>
              <span className="text-sm text-gray-700">
                {order.address?.fullName || 'عميل'}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500 font-medium">الإجمالي</span>
              <span className="text-sm font-bold text-gray-900">
                {(order.total || 0).toFixed(2)} ج.م
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">الحالة</span>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                {translateStatus(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // استخدام الـ Hooks لجلب البيانات
  const { orders, loading: ordersLoading, fetchOrders } = useGetAllOrders();
  const { products, loading: productsLoading, fetchProducts } = useGetProducts();
  const { categories, loading: categoriesLoading, fetchCategories } = useGetCategories();
  const { stats: messageStats, loading: statsLoading, fetchStats } = useContactMessagesStats();

  const [globalStats, setGlobalStats] = useState({
    totalClients: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
  });

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchOrders(),
          fetchProducts(),
          fetchCategories(),
          fetchStats(),
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  // تحديث الإحصائيات عند تغيير البيانات
  useEffect(() => {
    if (!orders || !Array.isArray(orders)) return;
    
    // استخراج عدد العملاء الفريدين من الطلبات
    const uniqueClients = new Set(
      orders
        .filter(order => order.address?.phone)
        .map(order => order.address.phone)
    );
    
    setGlobalStats({
      totalClients: uniqueClients.size,
      totalProducts: products?.length || 0,
      totalCategories: categories?.length || 0,
      totalOrders: orders?.length || 0,
    });
  }, [orders, products, categories]);

  const isLoading = ordersLoading || productsLoading || categoriesLoading || statsLoading;

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-gray-50 min-h-screen" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard className="h-8 w-8 text-[#C41E3A]" />
        <h2 className="text-3xl font-extrabold text-gray-900">
          لوحة التحكم
        </h2>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARD_DEFS.map((stat, index) => (
          <TopStatCard
            key={index}
            title={stat.label}
            value={globalStats[stat.key as keyof typeof globalStats].toLocaleString()}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            hoverColor={stat.hoverColor}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartCard orders={orders || []} loading={ordersLoading} />
        </div>

        <div className="lg:col-span-1">
          <DoughnutChartCard orders={orders || []} loading={ordersLoading} />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={orders || []} loading={ordersLoading} />
    </div>
  );
}