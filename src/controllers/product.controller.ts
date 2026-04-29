import { Request, Response } from 'express';
import Product from '../models/product.model';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err.message,
    });
  }
};
