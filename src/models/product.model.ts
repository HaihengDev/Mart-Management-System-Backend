import mongoose from 'mongoose';
import Counter from './counter.model';
import { IProduct } from '../interfaces/product.interface';
import Category from './category.model';
import Supplier from './supplier.model';

const productSchema = new mongoose.Schema<IProduct>(
  {
    product_id: {
      type: Number,
      unique: true,
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
    category_name: {
      type: String,
    },
    supplier_id: {
      type: Number,
      required: true,
    },
    supplier_name: {
      type: String,
    },
  },
  { timestamps: true, collection: 'products' },
);

productSchema.pre('save', async function () {
  if (!this.product_id) {
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
  }

  const category = await Category.findOne({ category_id: this.category_id });
  if (category) {
    this.category_name = category.category_name;
  }

  const supplier = await Supplier.findOne({ supplier_id: this.supplier_id });
  if (supplier) {
    this.supplier_name = supplier.supplier_name;
  }
});

export default mongoose.model('Product', productSchema);
