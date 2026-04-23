import express, { Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import pool from './config/db';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<any[]>('SELECT * FROM Product');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database Error' });
  }
});

const PORT = process.env.PORT || 8888;
const server = createServer(app);

server.listen(PORT, () => {
  console.log('server is running on port 8888...');
});
