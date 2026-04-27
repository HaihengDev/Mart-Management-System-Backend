import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import productRouter from './routes/productRoute';
import supplierRouter from './routes/supplierRotue';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/products', productRouter);
app.use('/api/suppliers', supplierRouter);

const PORT = process.env.PORT || 8888;
const server = createServer(app);

server.listen(PORT, () => {
  console.log('server is running on port 8888...');
});
