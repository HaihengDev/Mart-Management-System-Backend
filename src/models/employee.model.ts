import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../interfaces/employee.interface';

const employeeSchema = new Schema<IEmployee>({
  employee_id: {
    type: Number,
    unique: true,
    required: true,
  },
  employee_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  position: {
    type: String,
    enum: ['employee', 'admin'],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);
