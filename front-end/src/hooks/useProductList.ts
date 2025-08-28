import { useState, useEffect, useCallback, useMemo } from "react";
import { productAPI } from "../services/api";
import type { Product } from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import { useLoadingState } from "./useLoadingState";

export const useProductList = (itemsPerPage = 5) => {
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const { loadingState, setLoading } = useLoadingState();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      clearError();
      setLoading(true, 'Loading products...');
      
      const data = await productAPI.getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleError(err as Error, fetchProducts);
    }
  }, [handleError, setLoading, clearError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [page, products, itemsPerPage]);

  const handleNextPage = useCallback(() => setPage(prev => prev + 1), []);
  const handlePreviousPage = useCallback(() => setPage(prev => prev - 1), []);

  return {
    products,
    paginatedProducts,
    page,
    error,
    loadingState,
    handleNextPage,
    handlePreviousPage,
    retry,
    clearError,
    totalItems: products.length,
    itemsPerPage
  };
};