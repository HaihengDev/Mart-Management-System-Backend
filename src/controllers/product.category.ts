import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Category from '../models/category.model';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of Category is invalid format!',
      });
    }

    const category = await Category.findById(id);

    return res.status(200).json(category);
  } catch (err: any) {}
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { category_id, category_name } = req.body;

    if (category_id === undefined || !category_name) {
      return res.status(400).json({
        message: 'category_id and category_name are required!',
      });
    }

    const category = await Category.create({ category_id, category_name });

    return res.status(201).json({
      message: 'Category is created successfully!',
      category,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
  } catch (err: any) {}
};
