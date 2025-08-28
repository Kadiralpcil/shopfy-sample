import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResourceList, EmptyState, Pagination } from "@shopify/polaris";
import { productAPI } from "../../services/api";
import type { Product } from "../../services/api";
import ProductItem from "./ProductItem";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import ErrorState from "../common/ErrorState";
import LoadingState from "../common/LoadingState"; // Import ekle
import { useLoadingState } from "../../hooks/useLoadingState"; // Import ekle

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  // Hooks
  const navigate = useNavigate();
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const { loadingState, setLoading } = useLoadingState();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  // Effects
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        clearError();
        setLoading(true, "Loading products...");
        const data = await productAPI.getProducts();
        setLoading(true, "Loading products...");
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        handleError(err as Error, fetchProducts);
      }
    };
    fetchProducts();
  }, [handleError, setLoading, clearError]);

  // Handlers
  const handleProductClick = useCallback(
    (id: number) => navigate(`/product/${id}`),
    [navigate]
  );

  // Memoization
  const handleNextPage = useCallback(() => setPage((prev) => prev + 1), []);
  const handlePreviousPage = useCallback(() => setPage((prev) => prev - 1), []);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [page, products]);

  const emptyStateMarkup = useMemo(
    () =>
      !products.length && (
        <EmptyState
          heading="There is No Product"
          image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        />
      ),
    [products]
  );

  if (error) {
    return <ErrorState error={error} onRetry={retry} onDismiss={clearError} />;
  }

  if (loadingState.isLoading) {
    return (
      <LoadingState
        type="spinner"
        message={loadingState.loadingMessage}
        progress={loadingState.progress}
        step={loadingState.step}
        size="large"
      />
    );
  }

  return (
    <>
      <ResourceList
        items={paginatedProducts}
        emptyState={emptyStateMarkup}
        renderItem={(product) => (
          <ProductItem
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        )}
      />

      {products.length > ITEMS_PER_PAGE && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <Pagination
            hasPrevious={page > 1}
            onPrevious={handlePreviousPage}
            hasNext={page * ITEMS_PER_PAGE < products.length}
            onNext={handleNextPage}
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
