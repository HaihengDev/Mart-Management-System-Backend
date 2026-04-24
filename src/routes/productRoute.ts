import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
} from '../controllers/productController';

const router = express.Router();
router.get('/api/products', getAllProducts);
router.get('/api/products/:id', getProductById);
router.post('/api/products', createProduct);

export default router;
