import express from 'express';
import { getAllSupplier } from '../controllers/supplierController';

const router = express.Router();
router.get('/api/suppliers', getAllSupplier);

export default router;
