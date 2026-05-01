import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of order is invalid format!',
      });
    }
    const order = Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order record is not found!',
      });
    }

    return res.status(200).json({
      message: 'Order record is found successfully!',
      order,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error',
      result: err?.message,
    });
  }
};

export const getOrderByDate = async (req: Request, res: Response) => {
  try {
  } catch (err: any) {}
};
