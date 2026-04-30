import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import productRouter from './routes/product.route';
import categoryRouter from './routes/category.route';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);

const PORT = process.env.PORT || 8888;
const server = createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log('server is running on port 8888...');
  });
};

startServer();
