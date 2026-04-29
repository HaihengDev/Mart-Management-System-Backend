import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(uri);
    console.log('MongoDB is connected!');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
