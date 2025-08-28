import { Box, Text } from "@shopify/polaris";
import Cropper, { type Area } from "react-easy-crop";

interface CropEditorProps {
  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  targetDimensions?: { width: number; height: number };
}

const CropEditor = ({
  imageSrc,
  crop,
  zoom,
  aspect,
  onCropChange,
  onZoomChange,
  onCropComplete,
  targetDimensions
}: CropEditorProps) => {
  return (
    <>
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
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
      </Box>

      {targetDimensions && (
        <Text variant="bodySm" tone="subdued" as="legend">
          Target size: {targetDimensions.width}x{targetDimensions.height}
        </Text>
      )}
    </>
  );
};

export default CropEditor;