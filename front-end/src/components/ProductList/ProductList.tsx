import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import PaginationControls from "../common/PaginationControls";
import { useProductList } from "../../hooks/useProductList";
import ProductGrid from "./ProductGrid";

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const navigate = useNavigate();
  const {
    paginatedProducts,
    page,
    error,
    loadingState,
    handleNextPage,
    handlePreviousPage,
    retry,
    clearError,
    totalItems,
    itemsPerPage
  } = useProductList(ITEMS_PER_PAGE);

  const handleProductClick = useCallback(
    (id: number) => navigate(`/product/${id}`),
    [navigate]
  );

  if (error) {
    return <ErrorState error={error} onRetry={retry} onDismiss={clearError} />;
  }

  if (loadingState.isLoading) {
    return <LoadingState {...loadingState} />;
  }

  return (
    <>
      <ProductGrid
        products={paginatedProducts}
        loading={false}
        onProductClick={handleProductClick}
        emptyStateMessage="No products found in your store"
      />
      
      <PaginationControls
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
    </>
  );
};

export default ProductList;