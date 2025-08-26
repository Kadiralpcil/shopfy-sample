const API_BASE_URL = 'http://localhost:8000/api';

export interface Product {
  id: number;
  title: string;
  images: Array<{
    src: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  products?: T[];
  product?: T;
  message?: string;
}

export const productAPI = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data: ApiResponse<Product> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    
    return data.products || []; 
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data: ApiResponse<Product> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch product');
    }
    
    return data.product!;
  }
};