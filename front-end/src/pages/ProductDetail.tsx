import { useParams, useNavigate } from "react-router-dom";
import { Page, Card, Text, Box, BlockStack } from "@shopify/polaris";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ImageGallery from "../components/product/ImageGallery";
import { useProduct } from "../hooks/useProduct";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, error, loadingState, retry, clearError } = useProduct(id);

  if (error) {
    return (
      <Page title="Error" backAction={{ onAction: () => navigate("/home") }}>
        <ErrorState error={error} onRetry={retry} onDismiss={clearError} />
      </Page>
    );
  }

  if (loadingState.isLoading) {
    return <LoadingState type="skeleton" />;
  }

  if (!product) {
    return (
      <Page title="Error" backAction={{ onAction: () => navigate("/home") }}>
        <ErrorState
          error={{
            message: "Product not found",
            type: "validation",
            retryable: false,
            retryCount: 0,
          }}
          onDismiss={() => navigate("/home")}
        />
      </Page>
    );
  }

  return (
    <Page
      title={product.title}
      backAction={{ onAction: () => navigate("/home") }}
    >
      <Card>
        <BlockStack gap="400">
          <Box>
            <Text variant="headingMd" as="h2">
              Select an image to resize
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              Choose an image from this product to resize for social media
              platforms.
            </Text>
          </Box>

          <ImageGallery images={product.images} productId={id!} />
        </BlockStack>
      </Card>
    </Page>
  );
};

export default ProductDetail;
