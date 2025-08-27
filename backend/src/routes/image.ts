import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/resize", async (req, res) => {
  try {
    const { productId, imageIndex, crop, target } = req.body;

    if (!productId || imageIndex === undefined || !crop || !target) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // absolute path to the image
    const imagePath = path.join(
      process.cwd(),
      `public/product${productId}/${imageIndex + 1}.jpg`
    );


    if (!fs.existsSync(imagePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found at " + imagePath });
    }

    const buffer = await sharp(imagePath)
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
    console.error("Sharp error:", error);
    res
      .status(500)
      .json({ success: false, message: "Image processing failed" });
  }
});

export default router;
