import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Button,
  Banner,
  InlineStack,
  BlockStack,
  Toast,
  Frame,
} from "@shopify/polaris";
import { type Area } from "react-easy-crop";
import { productAPI } from "../services/api";
import type { Product } from "../services/api";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import PlatformSelector from "../components/crop/PlatformSelector";
import CropEditor from "../components/crop/CropEditor";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useLoadingState } from "../hooks/useLoadingState";

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
  const { productId, imageIndex } = useParams<{
    productId: string;
    imageIndex: string;
  }>();
  const navigate = useNavigate();

  // Hooks
  const { error, handleError, retry, clearError } = useErrorHandler(3);
  const { loadingState, setLoading } = useLoadingState();

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("instagram_story");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Fetch product
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      clearError();
      setLoading(true, 'Loading product...');
      
      const data = await productAPI.getProduct(parseInt(productId));
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleError(err as Error, fetchProduct);
    }
  }, [productId, handleError, setLoading, clearError]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handlers
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDownload = async () => {
    if (!product || !imageIndex || !croppedAreaPixels || !productId) return;

    const platform = PLATFORMS.find((p) => p.value === selectedPlatform);
    if (!platform) return;

    try {
      setLoading(true, 'Processing image...');
      
      const base64 = await productAPI.resizeImage(
        parseInt(productId),
        parseInt(imageIndex),
        croppedAreaPixels,
        { width: platform.width, height: platform.height }
      );

      setLoading(true, 'Processing image...');
      
      const link = document.createElement("a");
      link.download = `${platform.value}.jpg`;
      link.href = base64;
      link.click();
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setShowToast(true);
    }
  };

  if (error) {
    return (
      <Page title="Error" backAction={{ onAction: () => navigate(`/product/${productId}`) }}>
        <ErrorState error={error} onRetry={retry} onDismiss={clearError} />
      </Page>
    );
  }

  if (loadingState.isLoading) {
    return <LoadingState {...loadingState} />;
  }

  if (!product || !imageIndex) {
    return (
      <Page title="Error">
        <Banner tone="critical">Product or image not found</Banner>
      </Page>
    );
  }

  const currentImage = product.images[parseInt(imageIndex)];
  const selectedPlatformData = PLATFORMS.find(p => p.value === selectedPlatform);

  return (
    <Frame>
      {showToast && (
        <Toast 
          content="Failed to download" 
          onDismiss={() => setShowToast(false)} 
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
              <PlatformSelector
                platforms={PLATFORMS}
                selectedPlatform={selectedPlatform}
                onPlatformChange={setSelectedPlatform}
              />
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="400">
              <CropEditor
                imageSrc={currentImage.src}
                crop={crop}
                zoom={zoom}
                aspect={selectedPlatformData ? selectedPlatformData.width / selectedPlatformData.height : 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                targetDimensions={selectedPlatformData}
              />
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