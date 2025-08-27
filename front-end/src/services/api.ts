import type { Area } from "react-easy-crop";

const API_BASE_URL = "http://localhost:8000/api";

export interface Product {
  id: number;
  title: string;
  images: Array<{ src: string }>;
}

export interface ApiResponse<T> {
  success: boolean;
  products?: T[];
  product?: T;
  image?: string;
  message?: string;
}

export const productAPI = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data: ApiResponse<Product> = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data.products || [];
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data: ApiResponse<Product> = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch product");
    }

    return data.product!;
  },

  resizeImage: async (
    productId: number,
    imageIndex: number,
    crop: Area,
    target: { width: number; height: number }
  ) => {
    const response = await fetch(`${API_BASE_URL}/image/resize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, imageIndex, crop, target }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Image processing failed");
    }

    return data.image;
  },
};
