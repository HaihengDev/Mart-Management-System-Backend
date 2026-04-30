import express from 'express';
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierByName,
  updateSupplier,
} from '../controllers/supplier.controller';

const router = express.Router();
router.get('/', getAllSuppliers);
router.get('/', getSupplierByName);
router.post('/', createSupplier);
router.delete('/:id', deleteSupplier);
router.put('/:id', updateSupplier);

export default router;
