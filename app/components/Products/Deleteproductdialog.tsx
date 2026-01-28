'use client';

import { Trash2, X, Loader2 } from 'lucide-react';
import { useDeleteProduct } from '@/hooks/products-hooks';
import toast from 'react-hot-toast';

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSuccess: () => void;
}

export default function DeleteProductDialog({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: DeleteProductDialogProps) {
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = async () => {
    const deletePromise = deleteProduct(productId);

    toast.promise(deletePromise, {
      loading: 'جاري حذف المنتج...',
      success: (data) => {
        onSuccess();
        onClose();
        return data.message || 'تم حذف المنتج بنجاح';
      },
      error: (err) => {
        return err.message || 'فشل في حذف المنتج';
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تأكيد الحذف</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            هل أنت متأكد من حذف المنتج <span className="font-bold text-gray-900">"{productName}"</span>؟
          </p>
          <p className="text-sm text-gray-500">لا يمكن التراجع عن هذا الإجراء.</p>
        </div>

        <div className="border-t px-6 py-4 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="animate-spin" size={18} />}
            حذف المنتج
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}