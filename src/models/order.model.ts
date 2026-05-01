import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    unique: true,
  },
  employee_id: {
    type: Number,
    required: true,
  },
  order_date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  price_after_discount: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
  },
});

export default mongoose.model('Order', orderSchema);
