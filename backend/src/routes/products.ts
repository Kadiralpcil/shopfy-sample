import express from 'express';
import { getProducts, getProduct, extractNumericId } from '../services/shopifyGraphQl';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productsData = await getProducts(50);
    
    const products = productsData.edges.map(({ node }: any) => ({
      id: extractNumericId(node.id),
      title: node.title,
      images: node.images.edges.map(({ node: img }: any) => ({
        src: img.originalSrc
      }))
    }));

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('GraphQL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const formattedProduct = {
      id: extractNumericId(product.id),
      title: product.title,
      images: product.images.edges.map(({ node: img }: any) => ({
        src: img.originalSrc
      }))
    };

    res.json({
      success: true,
      product: formattedProduct
    });
  } catch (error) {
    console.error('GraphQL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

export default router;