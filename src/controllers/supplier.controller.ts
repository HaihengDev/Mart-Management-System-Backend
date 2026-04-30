import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Supplier from '../models/supplier.model';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json(suppliers);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
