import { Request, Response } from 'express';
import pool from '../config/db';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<any[]>('SELECT * FROM Product;');
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ Message: 'Server Error', Error: error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = await req.params;
    const query = `SELECT * FROM Product WHERE product_id = ${id}`;
    const [product] = await pool.query<any[]>(query);

    if (!product) {
      return res.status(404).json({
        message: 'Product is not found!',
      });
    }

    return res.status(200).json(product);
  } catch (error) {}
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      product_image,
      barcode,
      price,
      cost_price,
      quantity_in_stock,
      expiry_date,
      status,
      category_id,
      supplier_id,
    } = req.body;

    const [row] = await pool.query<any[]>(
      `INSERT INTO Product(product_name, product_image, barcode, price, cost_price, quantity_in_stock, expiry_date, status, category_id, supplier_id) VALUES (${product_name}, ${product_image}, ${barcode}, ${price}, ${cost_price}, ${quantity_in_stock}, ${expiry_date}, ${status}, ${category_id}, ${supplier_id});`,
    );

    return res.status(200).json(row);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = await req.params;
  const query = `DELETE Product Where id=${id}`;

  const [row] = await pool.query<any[]>(query);
  if (!row) {
    return res.status(404).json({
      message: 'Product is not found!',
    });
  }

  return res.status(200).json(row);
};
