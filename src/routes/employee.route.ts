import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from '../controllers/employee.controller';
import { upload } from '../middleware/upload';

const router = express.Router();
router.post('/', upload.single('file'), createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', upload.single('file'), updateEmployee);

export default router;
