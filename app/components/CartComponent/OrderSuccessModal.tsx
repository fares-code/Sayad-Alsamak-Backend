'use client'
import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessModalProps {
  onClose: () => void;
}

const OrderSuccessModal = ({ onClose }: OrderSuccessModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          تم إرسال الطلب بنجاح
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-2 leading-relaxed">
          تم استلام طلبك بنجاح وسيتم التواصل معك تأكيد الطلب وتحديدموعد
        </p>
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          التوصيل خلال 24 ساعة بالحد الأقصى بعد الاستلام
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[#C41E3A] hover:bg-[#a01829] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
            onClick={onClose}
          >
            حسناً
          </Link>
          
         <Link
            href="/"
            className="block w-full border-2 border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
            onClick={onClose}
          >
            متابعة التسوق
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessModal;