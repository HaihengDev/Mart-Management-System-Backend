import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import productRouter from './routes/productRoute';

dotenv.config();

const app = express();
app.use(express.json());
app.use(productRouter);

const PORT = process.env.PORT || 8888;
const server = createServer(app);

server.listen(PORT, () => {
  console.log('server is running on port 8888...');
});
