import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { uploadFile, deleteFile, updateFile } from '../services/r2.services';
import Product from '../models/product.model';
import { convertUrlToKey } from '../utils/convertUrlToKey';

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

export const viewProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid ObjectId format!',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        message: 'Product is not found!',
      });
    }

    await Product.updateOne({ _id: id }, { $inc: { views: 1 } });

    return res.status(200).json({
      message: 'Product found successfully',
      product,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server Error',
      result: err?.message,
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
    const image = await uploadFile('products', file);

    const { product_name, stock, discount, price, expiry_date } = req.body;
    const { category_id, supplier_id } = req.body;

    if (!product_name || price === undefined || !expiry_date) {
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({
        message: 'Product id is required for delete product!',
      });
    }

    // 🔍 Find product first
    const product = await Product.findOne({
      product_id: Number(product_id),
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found!',
      });
    }

    if (product.product_image) {
      const key = convertUrlToKey(product.product_image);

      if (key) {
        try {
          await deleteFile(key);
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }
    }

    await Product.deleteOne({
      product_id: Number(product_id),
    });

    return res.status(200).json({
      message: 'Product deleted successfully!',
      deletedProduct: product,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Object Id is invalid format!',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product is not found!',
      });
    }

    let image = product.product_image;
    const file = req.file;

    if (file) {
      try {
        if (product.product_image) {
          const key = convertUrlToKey(product.product_image);
          if (!key) {
            return res.status(500).json({
              message: 'Failed to parse existing product image key!',
            });
          }

          image = await updateFile('products', key, file);
        } else {
          image = await uploadFile('products', file);
        }
      } catch (err: any) {
        return res.status(500).json({
          message: 'Failed to update product image!',
          result: err?.message,
        });
      }
    }

    const {
      product_name,
      stock,
      price,
      discount,
      expiry_date,
      category_id,
      supplier_id,
    } = req.body || {};

    const updateData: Record<string, any> = {};

    if (product_name !== undefined) updateData.product_name = product_name;
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (supplier_id !== undefined) updateData.supplier_id = supplier_id;

    updateData.product_image = image;

    const hasBodyUpdates = Object.keys(updateData).some(
      (key) => key !== 'product_image',
    );

    if (!file && !hasBodyUpdates) {
      return res.status(400).json({
        message: 'No update data provided!',
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product is not found!',
      });
    }

    return res.status(200).json({
      message: 'Product is updated successfully!',
      data: updatedProduct,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
