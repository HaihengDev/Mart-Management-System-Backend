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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { p_id, c_id, s_id } = req.query;

    if (!p_id || !c_id || !s_id) {
      return res.status(400).json({
        message:
          'At least one of category_id, product_id, or supplier_id is required.',
      });
    }

    const filter: any = {};

    if (p_id) filter.product_id = Number(p_id);
    if (c_id) filter.category_id = Number(c_id);
    if (s_id) filter.supplier_id = Number(s_id);

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Product is not found!',
      });
    }

    return res.status(200).json({
      message: 'Product is found successfully!',
      count: products.length,
      products,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error',
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

    const { product_id, product_name, stock, discount, price, expiry_date } =
      req.body;
    const { category_id, supplier_id } = req.body;

    if (!product_id || !product_name || price === undefined || !expiry_date) {
      return res.status(400).json({
        message: 'Product name, expiry date and price is required!',
      });
    }

    if (!category_id || !supplier_id) {
      return res.status(400).json({
        message: 'Product have to add to category and include supplier!',
      });
    }

    const product = await Product.create({
      product_id,
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
