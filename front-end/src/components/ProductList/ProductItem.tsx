import { ResourceItem, Thumbnail,Text } from "@shopify/polaris";
import type { Product } from "../../services/api";

interface ProductItemProps {
  product: Product;
  onClick: (id: number) => void;
}

const ProductItem = ({ product, onClick }: ProductItemProps) => {
  const media = product.images[0] ? (
    <Thumbnail source={product.images[0].src} alt={product.title} />
  ) : undefined;

  return (
    <ResourceItem
      id={product.id.toString()}
      media={media}
      onClick={() => onClick(product.id)}
      accessibilityLabel={`View details for ${product.title}`}
    >
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {product.title}
      </Text>
      <Text variant="bodySm" as="p" tone="subdued">
        {`${product.images.length} image available` } 
      </Text>
    </ResourceItem>
  );
};

export default ProductItem;