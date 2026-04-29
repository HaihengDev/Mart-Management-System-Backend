import { Request, Response } from 'express';
import { uploadFile } from '../services/uploadFile';
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: 'Product image is required!',
      });
    }
    const image = await uploadFile(file);

    const { name, stock, discount, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: 'Product name and price is required!',
      });
    }

    const product = await Product.create({
      name,
      imgUrl: image,
      stock,
      discount,
      price,
    });

    return res.status(201).json({
      message: 'Product is created successfully!',
      product,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err.message,
    });
  }
};
