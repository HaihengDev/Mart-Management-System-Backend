import express from 'express';
import {
  createProduct,
  getAllProducts,
} from '../controllers/product.controller';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', upload.single('file'), createProduct);

export default router;
