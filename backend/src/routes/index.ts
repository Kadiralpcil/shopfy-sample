import express from 'express';
import productRoutes from './products';
import imageRoutes from './image';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/image', imageRoutes);

export default router;