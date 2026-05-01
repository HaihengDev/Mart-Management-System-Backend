import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';
import Product from '../models/product.model';
import { IOrderItem, IOrder } from '../interfaces/order.interface';

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

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { employee_id, status, items } = req.body as {
      employee_id: number;
      status: IOrder['status'];
      items: IOrderItem[];
    };

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one product!');
    }

    if (!employee_id) {
      throw new Error('Employee ID is required!');
    }

    if (!['Cash', 'QR'].includes(status)) {
      throw new Error('Status must be either Cash or QR!');
    }

    const orderItems: IOrderItem[] = [];

    for (const item of items) {
      const product = await Product.findOne({
        product_id: item.product_id,
      }).session(session);

      if (!product) {
        throw new Error(`Product ${item.product_id} was not found!`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Product ${product.product_name} does not have enough stock!`,
        );
      }

      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        discount: item.discount ?? 0,
        quantity: item.quantity,
      });
    }

    const order = new Order({
      employee_id,
      status,
      items: orderItems,
    });

    await order.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      message: 'Order created successfully!',
      order,
    });
  } catch (err: any) {
    await session.abortTransaction();

    return res.status(400).json({
      message: 'Create order failed!',
      result: err?.message,
    });
  } finally {
    session.endSession();
  }
};
