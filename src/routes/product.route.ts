import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from '../controllers/product.controller';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/', getProductById);
router.post('/', upload.single('file'), createProduct);
router.delete('/:product_id', deleteProduct);

export default router;
