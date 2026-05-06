import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import productRouter from './routes/product.route';
import categoryRouter from './routes/category.route';
import supplierRouter from './routes/supplier.route';
import orderRouter from './routes/order.route';
import employeeRouter from './routes/employee.route';
import authRouter from './auth/auth.route';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
app.set('etag', false);
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use((_, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/orders', orderRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/login', authRouter);

const PORT = process.env.PORT || 8888;
const server = createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log('server is running on port 8888...');
  });
};

startServer();
