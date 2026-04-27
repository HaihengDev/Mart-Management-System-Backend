import express from 'express';
import { getAllSupplier } from '../controllers/supplierController';

const router = express.Router();
router.get('/', getAllSupplier);

export default router;
