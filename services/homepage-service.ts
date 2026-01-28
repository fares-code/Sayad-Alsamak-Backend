// Homepage API service
import axiosInstance from '@/lib/axiosInterceptor';
import {
  HomepageContent,
  Category,
  Product,
  HomepageData,
  ApiResponse,
  ProductFilters,
} from '@/types/homepage';

// Homepage Content Management
export const getHomepageContent = async (): Promise<ApiResponse<HomepageContent>> => {
  const { data } = await axiosInstance.get('/homepage/content');
  return data;
};

export const updateHomepageContent = async (
  id: string,
  content: Partial<HomepageContent>
): Promise<ApiResponse<HomepageContent>> => {
  const { data } = await axiosInstance.patch(`/homepage/content/${id}`, content);
  return data;
};

export const updateHomepageContentWithImages = async (
  id: string,
  content: Partial<HomepageContent>
): Promise<ApiResponse<HomepageContent>> => {
  const { data } = await axiosInstance.patch(`/homepage/content/${id}/with-images`, content);
  return data;
};

// Create new homepage content
export const createHomepageContent = async (
  content: Partial<HomepageContent>
): Promise<ApiResponse<HomepageContent>> => {
  const { data } = await axiosInstance.post('/homepage/content', content);
  return data;
};

// Product Endpoints
export const getFeaturedProducts = async (
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', Math.min(filters.limit, 50).toString());
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const { data } = await axiosInstance.get(`/homepage/featured-products?${params}`);
  return data;
};

export const getBestSellers = async (
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', Math.min(filters.limit, 50).toString());
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const { data } = await axiosInstance.get(`/homepage/best-sellers?${params}`);
  return data;
};

export const getNewArrivals = async (
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', Math.min(filters.limit, 50).toString());
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const { data } = await axiosInstance.get(`/homepage/new-arrivals?${params}`);
  return data;
};

export const getProductsByCategory = async (
  slug: string,
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', Math.min(filters.limit, 50).toString());
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const { data } = await axiosInstance.get(`/homepage/categories/${slug}/products?${params}`);
  return data;
};

// Category Endpoints
export const getHomepageCategories = async (
  options?: {
    includeInactive?: boolean;
    limit?: number;
  }
): Promise<ApiResponse<Category[]>> => {
  const params = new URLSearchParams();
  if (options?.includeInactive) params.append('includeInactive', 'true');
  if (options?.limit) params.append('limit', Math.min(options.limit, 100).toString());

  const { data } = await axiosInstance.get(`/homepage/categories?${params}`);
  return data;
};

// Combined Data
export const getAllHomepageData = async (): Promise<ApiResponse<HomepageData>> => {
  const { data } = await axiosInstance.get('/homepage/all-data');
  return data;
};
