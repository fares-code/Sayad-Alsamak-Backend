// src/app/components/ContactMessages/DeleteMessageDialog.tsx

'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useDeleteContactMessage } from '@/hooks/useContactMessages';
import toast from 'react-hot-toast';

interface DeleteMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  messageName: string;
  onSuccess: () => void;
}

export default function DeleteMessageDialog({
  isOpen,
  onClose,
  messageId,
  messageName,
  onSuccess,
}: DeleteMessageDialogProps) {
  const { mutateAsync: deleteMessage, isPending } = useDeleteContactMessage();

  const handleDelete = async () => {
    const deletePromise = deleteMessage(messageId);

    toast.promise(deletePromise, {
      loading: 'جاري الحذف...',
      success: (data) => {
        onSuccess();
        onClose();
        return data.message || 'تم حذف الرسالة بنجاح';
      },
      error: (err) => {
        return err.message || 'فشل في حذف الرسالة';
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">تأكيد الحذف</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6" dir="rtl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                هل أنت متأكد من حذف هذه الرسالة؟
              </h3>
              <p className="text-gray-600 mb-4">
                رسالة من: <span className="font-semibold">{messageName}</span>
              </p>
              <p className="text-sm text-gray-500">
                لن تتمكن من استرجاع هذه الرسالة بعد الحذف.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="animate-spin" size={18} />}
            حذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}