import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResourceList,
  ResourceItem,
  Text,
  Thumbnail,
  Banner,
  EmptyState,
} from "@shopify/polaris";
import { productAPI } from "../../services/api";
import type { Product } from "../../services/api";

const ProductList = () => {
  // Hooks
  const navigate = useNavigate();

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  if (error) {
    return (
      <Banner tone="critical" title="Something went wrong">
        <p>{error}</p>
      </Banner>
    );
  }

  const emptyStateMarkup =
    !products.length ? (
      <EmptyState
        heading="Upload a file to get started"
        action={{ content: "Upload files" }}
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
      >
        <p>
          You can use the Files section to upload images, videos, and other
          documents
        </p>
      </EmptyState>
    ) : undefined;

  return (
    <ResourceList
      items={products}
      loading={loading}
      emptyState={emptyStateMarkup}
      renderItem={(product) => {
        const { id, title, images } = product;
        const media = images[0] ? (
          <Thumbnail source={images[0].src} alt={title} />
        ) : undefined;

        return (
          <ResourceItem
            id={id.toString()}
            media={media}
            onClick={() => handleProductClick(id)}
            accessibilityLabel={`View details for ${title}`}
          >
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {title}
            </Text>
            <Text variant="bodySm" as="p" tone="subdued">
              {images.length} image{images.length !== 1 ? "s" : ""} available
            </Text>
          </ResourceItem>
        );
      }}
    />
  );
};

export default ProductList;
