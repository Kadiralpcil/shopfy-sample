import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Text,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText,
  Banner,
  Box,
  Grid,
  BlockStack,
  Link,
} from "@shopify/polaris";
import { productAPI } from "../services/api";
import type { Product } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await productAPI.getProduct(parseInt(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SkeletonPage primaryAction>
        <Card>
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText />
        </Card>
      </SkeletonPage>
    );
  }

  if (error || !product) {
    return (
      <Page title="Error">
        <Banner tone="critical">{error || "Product not found"}</Banner>
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
          <Grid>
            {product.images.map((image, index) => (
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
