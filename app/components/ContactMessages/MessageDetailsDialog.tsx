// src/app/components/ContactMessages/MessageDetailsDialog.tsx

'use client';

import { useState } from 'react';
import { X, Mail, Phone, Calendar, FileText, Save, Loader2 } from 'lucide-react';
import { ContactMessage } from '@/types/contact-message';
import { useUpdateContactMessage } from '@/hooks/useContactMessages';
import toast from 'react-hot-toast';

interface MessageDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage;
  onSuccess: () => void;
}

export default function MessageDetailsDialog({
  isOpen,
  onClose,
  message,
  onSuccess,
}: MessageDetailsDialogProps) {
  const { mutateAsync: updateMessage, isPending } = useUpdateContactMessage();
  const [notes, setNotes] = useState(message.notes || '');

  const handleSaveNotes = async () => {
    const updatePromise = updateMessage({
      id: message.id,
      payload: { notes },
    });

    toast.promise(updatePromise, {
      loading: 'جاري الحفظ...',
      success: (data) => {
        onSuccess();
        onClose();
        return data.message || 'تم حفظ الملاحظات بنجاح';
      },
      error: (err) => {
        return err.message || 'فشل في حفظ الملاحظات';
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل الرسالة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6" dir="rtl">
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                !message.isRead
                  ? 'bg-orange-100 text-orange-800'
                  : message.isReplied
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {!message.isRead ? 'جديدة' : message.isReplied ? 'تم الرد' : 'مقروءة'}
            </span>
          </div>

          {/* Sender Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C41E3A] rounded-full flex items-center justify-center text-white font-bold">
                {message.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{message.name}</h3>
                <p className="text-sm text-gray-600">المرسل</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-gray-500" />
                
                <a  href={`mailto:${message.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {message.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-gray-500" />
                <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline">
                  {message.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t">
              <Calendar size={16} className="text-gray-500" />
              <span>
                {new Date(message.createdAt).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} />
              الرسالة
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات الأدمن
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              placeholder="أضف ملاحظاتك هنا..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3">
          <button
            onClick={handleSaveNotes}
            disabled={isPending}
            className="flex-1 bg-[#C41E3A] text-white py-2.5 rounded-lg font-medium hover:bg-[#a01829] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="animate-spin" size={18} />}
            <Save size={18} />
            حفظ الملاحظات
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}