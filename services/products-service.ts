import axiosInstance from '@/lib/axiosInterceptor';

// ProductType Enum
export enum ProductType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  BOTH = 'BOTH'
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  categoryId: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  discount: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  weight?: number;
  unit: string;
  origin?: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  mainImage: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  views: number;
  salesCount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
  };
}

export interface CreateProductPayload {
  name?: string;
  nameAr: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  categoryId: string;
  type?: ProductType;
  price: number;
  originalPrice?: number;
  discount?: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  weight?: number;
  unit: string;
  origin?: string;
  stock?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  mainImage: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  categoryId?: string;
  type?: ProductType;
  price?: number;
  originalPrice?: number;
  discount?: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  weight?: number;
  unit?: string;
  origin?: string;
  stock?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  mainImage?: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface FilterProductParams {
  categoryId?: string;
  type?: ProductType | string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
// أضف هذه الـ interfaces في أول الملف
export interface Review {
  id: string;
  productId: string;
 
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  message: string;
  data: Review;
}

export interface ReviewsResponse {
  message: string;
  data: Review[];
}

// أضف هذه الدوال في نهاية الملف
export const createReview = async (payload: CreateReviewPayload): Promise<ReviewResponse> => {
  const { data } = await axiosInstance.post('/products/reviews', payload);
  return data;
};

export const getProductReviews = async (productId: string): Promise<ReviewsResponse> => {
  const { data } = await axiosInstance.get(`/products/${productId}/reviews`);
  return data;
};

export const deleteReview = async (reviewId: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/products/reviews/${reviewId}`);
  return data;
};
// تحويل الصورة إلى Base64
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getAllProducts = async (filters?: FilterProductParams): Promise<ProductsResponse> => {
  const { data } = await axiosInstance.get('/products', { params: filters });
  return data;
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

export const createProduct = async (payload: CreateProductPayload): Promise<ProductResponse> => {
  const { data } = await axiosInstance.post('/products', payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<ProductResponse> => {
  const { data } = await axiosInstance.patch(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};