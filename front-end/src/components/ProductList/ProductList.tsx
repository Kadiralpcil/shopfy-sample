import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResourceList, Banner, EmptyState, Pagination } from "@shopify/polaris";
import { productAPI } from "../../services/api";
import type { Product } from "../../services/api";
import ProductItem from "./ProductItem";

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  // Hooks
  const navigate = useNavigate();
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // Effects
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
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
    return (
      <Banner tone="critical" title="Something went wrong">
        <p>{error}</p>
      </Banner>
    );
  }

  return (
    <>
      <ResourceList
        items={paginatedProducts}
        loading={loading}
        emptyState={emptyStateMarkup ?? undefined}
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
