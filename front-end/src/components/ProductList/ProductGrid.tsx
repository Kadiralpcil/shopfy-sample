import { ResourceList, EmptyState, Card } from "@shopify/polaris";
import type { Product } from "../../services/api";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductClick: (id: number) => void;
  emptyStateImage?: string;
  emptyStateMessage?: string;
}

const ProductGrid = ({
  products,
  loading,
  onProductClick,
  emptyStateImage = "https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png",
  emptyStateMessage = "No products found"
}: ProductGridProps) => {
  const emptyState = !products.length ? (
    <EmptyState
      heading={emptyStateMessage}   
      image={emptyStateImage}
    />
  ) : undefined;

  return (
    <Card>
    <ResourceList
      items={products}
      loading={loading}
      emptyState={emptyState}
      renderItem={(product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      )}
    />
    </Card>

  );
};

export default ProductGrid;