import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../interfaces/employee.interface';
import Counter from './counter.model';

const employeeSchema = new Schema<IEmployee>({
  employee_id: {
    type: Number,
    unique: true,
  },
  employee_name: {
    type: String,
    required: true,
  },
  employee_image: {
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

employeeSchema.pre('save', async function () {
  const counter = await Counter.findOneAndUpdate(
    {
      name: 'employee_id',
    },
    {
      $inc: { seq: 1 },
    },
    { new: true, upsert: true },
  );

  this.employee_id = counter.seq;
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);
