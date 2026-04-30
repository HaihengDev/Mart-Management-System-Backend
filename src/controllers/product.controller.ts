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

    const { product_name, stock, discount, price, expiry_date } = req.body;
    const {category_id, supplier_id} = req.body;

    if (!product_name || price === undefined || !expiry_date) {
      return res.status(400).json({
        message: 'Product name, expiry date and price is required!',
      });
    }

    if(!category_id || !supplier_id) {
      return res.status(400).json({
        message: 'Product have to add to category and include supplier!',
      });
    }

    const product = await Product.create({
      product_name,
      product_image: image,
      stock,
      discount,
      price,
      expiry_date,
      category_id,
      supplier_id,
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
