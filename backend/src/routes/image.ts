import express from "express";
import sharp from "sharp";
import { getProduct } from "../services/shopifyGraphQl";

const router = express.Router();

router.post("/resize", async (req, res) => {
  try {
    const { productId, imageIndex, crop, target } = req.body;

    if (!productId || imageIndex === undefined || !crop || !target) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const product = await getProduct(productId.toString());
    
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const imageUrl = product.images.edges[imageIndex]?.node?.originalSrc;
    
    if (!imageUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const buffer = await sharp(Buffer.from(imageBuffer))
      .extract({
        left: Math.round(crop.x),
        top: Math.round(crop.y),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      })
      .resize(target.width, target.height)
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    res.json({ success: true, image: base64 });
  } catch (error) {
    console.error("Image processing error:", error);
    res
      .status(500)
      .json({ success: false, message: "Image processing failed" });
  }
});

export default router;