import { Document } from 'mongoose';

export interface IOrderItem {
  product_id: number;
  product_name: string;
  price: number;
  discount: number;
  price_after_discount?: number;
  quantity: number;
  total?: number;
}

export interface IOrder extends Document {
  order_id?: number;
  employee_id: number;
  order_date: Date;
  items: IOrderItem[];
  grand_total?: number;
  status: 'Cash' | 'QR';
}
