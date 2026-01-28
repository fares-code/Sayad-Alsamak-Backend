// src/app/dashboard/contact-messages/page.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  useGetContactMessages,
  useMarkAsRead,
  useMarkAsReplied,
  useDeleteContactMessage,
  useContactMessagesStats,
} from '@/hooks/useContactMessages';
import { ContactMessage } from '@/types/contact-message';
import {
  Mail,
  MailOpen,
  CheckCircle,
  Trash2,
  Eye,
  Filter,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import MessageDetailsDialog from '@/app/components/ContactMessages/MessageDetailsDialog';
import DeleteMessageDialog from '@/app/components/ContactMessages/DeleteMessageDialog';

export default function ContactMessagesPage() {
  const { messages, loading, fetchMessages } = useGetContactMessages();
  const { stats, fetchStats } = useContactMessagesStats();
  const { mutateAsync: markAsRead } = useMarkAsRead();
  const { mutateAsync: markAsReplied } = useMarkAsReplied();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    loadMessages();
    fetchStats();
  }, [filter]);

  const loadMessages = () => {
    const filters: any = {};
    if (filter === 'unread') filters.isRead = false;
    if (filter === 'read') filters.isRead = true;
    if (filter === 'replied') filters.isReplied = true;

    fetchMessages(filters);
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailsDialogOpen(true);

    // تعليم الرسالة كمقروءة تلقائياً
    if (!message.isRead) {
      try {
        await markAsRead(message.id);
        loadMessages();
        fetchStats();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleMarkAsReplied = async (message: ContactMessage) => {
    const replyPromise = markAsReplied(message.id);

    toast.promise(replyPromise, {
      loading: 'جاري التعليم...',
      success: (data) => {
        loadMessages();
        fetchStats();
        return data.message || 'تم تعليم الرسالة كمردود عليها';
      },
      error: (err) => {
        return err.message || 'فشل في التعليم';
      },
    });
  };

  const handleDelete = (message: ContactMessage) => {
    setMessageToDelete({
      id: message.id,
      name: message.name,
    });
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    loadMessages();
    fetchStats();
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#C41E3A] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">رسائل التواصل</h1>
          <p className="text-gray-600 mt-1">إدارة رسائل العملاء والاستفسارات</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الرسائل</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مقروءة</p>
                <p className="text-2xl font-bold text-green-600">{stats.read}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MailOpen className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تم الرد عليها</p>
                <p className="text-2xl font-bold text-[#C41E3A]">{stats.replied}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-[#C41E3A]" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

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
            الكل
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            غير مقروءة
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read'
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            مقروءة
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'replied'
                ? 'bg-[#C41E3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            تم الرد عليها
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الرسالة
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
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    !message.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {!message.isRead ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Mail size={12} className="ml-1" />
                          جديدة
                        </span>
                      ) : message.isReplied ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="ml-1" />
                          تم الرد
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <MailOpen size={12} className="ml-1" />
                          مقروءة
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{message.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{message.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(message.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                      {!message.isReplied && (
                        <button
                          onClick={() => handleMarkAsReplied(message)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="تعليم كمردود عليها"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">لا توجد رسائل</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedMessage && (
        <MessageDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedMessage(null);
          }}
          message={selectedMessage}
          onSuccess={handleSuccess}
        />
      )}

      {messageToDelete && (
        <DeleteMessageDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setMessageToDelete(null);
          }}
          messageId={messageToDelete.id}
          messageName={messageToDelete.name}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}