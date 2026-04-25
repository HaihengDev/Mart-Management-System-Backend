import { Request, Response } from 'express';
import pool from '../config/db';

export const getAllSupplier = async (req: Request, res: Response) => {
  try {
    const [rows]: any[] = await pool.query('SELECT * FROM Supplier;');
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({
      message: 'Server Error',
      Error: error,
    });
  }
};
