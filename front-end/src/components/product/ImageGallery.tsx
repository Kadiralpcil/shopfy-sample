import { Grid, Card, Link } from "@shopify/polaris";

interface ImageGalleryProps {
  images: Array<{ src: string }>;
  productId: string;
  onImageClick?: (imageIndex: number) => void;
}

const ImageGallery = ({ images, productId, onImageClick }: ImageGalleryProps) => {
  return (
    <Grid>
      {images.map((image, index) => (
        <Grid.Cell key={image.src} columnSpan={{ xs: 6, sm: 4, md: 3 }}>
          <Card>
            <Link 
              url={`/edit/${productId}/${index}`} 
              removeUnderline
              onClick={onImageClick ? () => onImageClick(index) : undefined}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={image.src}
                  alt={`Product Image ${index + 1}`}
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
  );
};

export default ImageGallery;