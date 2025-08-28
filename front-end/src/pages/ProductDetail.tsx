import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Text,
  Box,
  Grid,
  BlockStack,
  Link,
} from "@shopify/polaris";
import { productAPI } from "../services/api";
import ErrorState from "../components/common/ErrorState";
import type { Product } from "../services/api";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useLoadingState } from "../hooks/useLoadingState";
import LoadingState from "../components/common/LoadingState";

const ProductDetail = () => {
  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const { loadingState, setLoading } = useLoadingState();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        clearError();
        setLoading(true, "Loading product...");
        const data = await productAPI.getProduct(parseInt(id));
        setLoading(true, "Loading product...");
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        handleError(err as Error, fetchProduct);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    <ErrorState error={error} onRetry={retry} onDismiss={clearError} />;
  }

if (loadingState.isLoading) {
    return (
      <LoadingState
        type="skeleton"
        message={loadingState.loadingMessage}
        progress={loadingState.progress}
        step={loadingState.step}
        size="large"
      />
    );
  }

  return (
    <Page
      title={product?.title}
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
          <Grid>
            {product?.images.map((image, index) => (
              <Grid.Cell key={image.src} columnSpan={{ xs: 6, sm: 4, md: 3 }}>
                <Card>
                  <Link url={`/edit/${id}/${index}`} removeUnderline>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={image.src}
                        alt="Product Image"
                        style={{
                          width: "100%",
                          maxWidth: "180px",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </Link>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default ProductDetail;
