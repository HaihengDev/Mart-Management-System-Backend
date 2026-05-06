import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export const userSchema = new mongoose.Schema<IUser>({
  id: {
    type: Number,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    required: true,
  },
});
