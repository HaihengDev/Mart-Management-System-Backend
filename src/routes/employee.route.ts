import express from 'express';
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from '../controllers/employee.controller';
import { upload } from '../middleware/upload';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = express.Router();
router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  upload.single('file'),
  createEmployee,
);

router.get('/', authenticate, authorizeRoles('admin'), getAllEmployees);

router.get('/:id', authenticate, authorizeRoles('admin'), getEmployeeById);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  upload.single('file'),
  updateEmployee,
);

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteEmployee);

export default router;
