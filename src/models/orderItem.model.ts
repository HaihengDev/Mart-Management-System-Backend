import mongoose, { Schema } from 'mongoose';
import { IOrderItem } from '../interfaces/order.interface';

const orderItemSchema = new Schema<IOrderItem>({
  product_id: { type: Number, required: true },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  price_after_discount: Number,
  quantity: { type: Number, required: true },
  total: Number,
});

export default orderItemSchema;
