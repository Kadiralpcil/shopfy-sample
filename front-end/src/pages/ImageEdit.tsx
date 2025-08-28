import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Button,
  Select,
  Text,
  Box,
  InlineStack,
  BlockStack,
  Toast,
  Frame,
} from "@shopify/polaris";
import Cropper, { type Area } from "react-easy-crop";
import { productAPI } from "../services/api";
import type { Product } from "../services/api";
import { useErrorHandler } from "../hooks/useErrorHandler";
import ErrorState from "../components/common/ErrorState";
import { useLoadingState } from "../hooks/useLoadingState";
import LoadingState from "../components/common/LoadingState";

const PLATFORMS = [
  {
    label: "Instagram Story",
    value: "instagram_story",
    width: 1080,
    height: 1920,
  },
  { label: "Facebook Post", value: "facebook_post", width: 1200, height: 630 },
  {
    label: "YouTube Thumbnail",
    value: "youtube_thumbnail",
    width: 1280,
    height: 720,
  },
];

const ImageEdit = () => {
  // Hooks
  const { productId, imageIndex } = useParams<{
    productId: string;
    imageIndex: string;
  }>();
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const navigate = useNavigate();
  const { loadingState, setLoading } = useLoadingState();

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("instagram_story");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [downloadFaileMessege, setDownloadFailMessege] = useState(false);

  // Effects
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        clearError();
        setLoading(true, "Loading Image...", );
        const data = await productAPI.getProduct(parseInt(productId));
        setLoading(true, "Loading products...");
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        handleError(err as Error, fetchProduct);
      }
    };
    fetchProduct();
  }, [productId]);

  // Memoization
  const toggleDownloadFaileMessege = useCallback(
    () =>
      setDownloadFailMessege((downloadFaileMessege) => !downloadFaileMessege),
    []
  );

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handlers
  const handleDownload = async () => {
    if (!product || !imageIndex || !croppedAreaPixels || !productId) return;

    const platform = PLATFORMS.find((p) => p.value === selectedPlatform);
    if (!platform) return;

    try {
      clearError();
      const base64 = await productAPI.resizeImage(
        parseInt(productId),
        parseInt(imageIndex),
        croppedAreaPixels,
        { width: platform.width, height: platform.height }
      );

      const link = document.createElement("a");
      link.download = `${platform.value}.jpg`;
      link.href = base64;
      link.click();
    } catch (err) {
      setDownloadFailMessege(true);
    }
  };

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

  const currentImage = product?.images[parseInt(imageIndex ?? "")];
  const selectedPlatformData = PLATFORMS.find(
    (p) => p.value === selectedPlatform
  );

  return (
    <Frame>
      {downloadFaileMessege && (
        <Toast
          content="Failed to download"
          onDismiss={toggleDownloadFaileMessege}
          error
        />
      )}

      <Page
        title="Image Editor"
        backAction={{ onAction: () => navigate(`/product/${productId}`) }}
      >
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Resize Image for Social Media
              </Text>
              <Select
                label="Select Platform"
                options={PLATFORMS.map((platform) => ({
                  label: `${platform.label} (${platform.width}x${platform.height})`,
                  value: platform.value,
                }))}
                value={selectedPlatform}
                onChange={setSelectedPlatform}
              />
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Crop & Preview
              </Text>

              <Box padding="400">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 400,
                    background: "#333",
                  }}
                >
                  <Cropper
                    image={currentImage?.src}
                    crop={crop}
                    zoom={zoom}
                    aspect={
                      selectedPlatformData
                        ? selectedPlatformData.width /
                          selectedPlatformData.height
                        : 1
                    }
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </Box>

              <Text variant="bodySm" tone="subdued" as="legend">
                Target size: {selectedPlatformData?.width}x
                {selectedPlatformData?.height}
              </Text>
            </BlockStack>
          </Card>

          <Card>
            <InlineStack gap="200">
              <Button variant="primary" onClick={handleDownload}>
                Download Resized Image
              </Button>
              <Button onClick={() => navigate(`/product/${productId}`)}>
                Cancel
              </Button>
            </InlineStack>
          </Card>
        </BlockStack>
      </Page>
    </Frame>
  );
};

export default ImageEdit;
