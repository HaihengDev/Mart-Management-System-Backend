import mongoose, { Schema } from 'mongoose';
import orderItemSchema from './orderItem.model';
import { IOrder } from '../interfaces/order.interface';
import Counter from '../models/counter.model';

const orderSchema = new Schema<IOrder>(
  {
    order_id: { type: Number, unique: true },
    employee_id: { type: Number, required: true },
    order_date: { type: Date, required: true, default: Date.now },
    items: { type: [orderItemSchema], required: true },
    grand_total: Number,
    status: {
      type: String,
      enum: ['Cash', 'QR'],
      required: true,
    },
  },
  { timestamps: true, collection: 'orders' },
);

orderSchema.pre('save', function () {
  const order = this as IOrder;

  if (!order.items || order.items.length === 0) {
    return new Error('Order must have at least one item');
  }

  let grandTotal = 0;

  order.items.forEach((item) => {
    item.price_after_discount = item.price - (item.price * item.discount) / 100;

    item.total = item.price_after_discount * item.quantity;

    grandTotal += item.total;
  });

  order.grand_total = grandTotal;
});

orderSchema.pre('save', async function () {
  const counter = await Counter.findOneAndUpdate(
    {
      name: 'order_id',
    },
    {
      $inc: { seq: 1 },
    },
    { new: true, upsert: true },
  );

  this.order_id = counter.seq;
});

export default mongoose.model<IOrder>('Order', orderSchema);
