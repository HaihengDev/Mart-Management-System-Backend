import mongoose from 'mongoose';
import Counter from './counter.model';

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      unique: true,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    category_id: {
      type: Number,
      required: true,
    },
    supplier_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: 'products' },
);

productSchema.pre('save', async function () {
  if (this.product_id) return;

  const counter = await Counter.findOneAndUpdate(
    {
      name: 'product_id',
    },
    {
      $inc: { seq: 1 },
    },
    { new: true, upsert: true },
  );

  this.product_id = counter.seq;
});

export default mongoose.model('Product', productSchema);
