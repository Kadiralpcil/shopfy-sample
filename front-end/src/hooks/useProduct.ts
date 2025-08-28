import { useState, useEffect, useCallback } from "react";
import { productAPI } from "../services/api";
import type { Product } from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import { useLoadingState } from "./useLoadingState";

export const useProduct = (id?: string) => {
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const { loadingState, setLoading } = useLoadingState();
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      clearError();
      setLoading(true, 'Loading product...');
      
      const data = await productAPI.getProduct(parseInt(id));
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleError(err as Error, fetchProduct);
    }
  }, [id, handleError, setLoading, clearError]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    error,
    loadingState,
    retry,
    clearError
  };
};