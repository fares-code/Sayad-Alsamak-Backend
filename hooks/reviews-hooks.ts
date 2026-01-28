'use client';

import { useState } from 'react';
import {
  createReview,
  getProductReviews,
  deleteReview,
  CreateReviewPayload,
  Review,
} from '@/services/products-service';

export const useGetReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductReviews(productId);
      setReviews(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في جلب التقييمات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, fetchReviews };
};

export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (payload: CreateReviewPayload) => {
    setLoading(true);
    try {
      const response = await createReview(payload);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في إضافة التقييم';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};

export const useDeleteReview = () => {
  const [loading, setLoading] = useState(false);

  const mutateAsync = async (reviewId: string) => {
    setLoading(true);
    try {
      const response = await deleteReview(reviewId);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'فشل في حذف التقييم';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutateAsync, isPending: loading };
};