import express from 'express';
import { createOrder, getAllOrders } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'employee'),
  createOrder,
);
router.get(
  '/',
  authenticate,
  authorizeRoles('admin', 'employee'),
  getAllOrders,
);

export default router;
