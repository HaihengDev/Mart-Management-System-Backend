import mongoose from 'mongoose';
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

export default mongoose.model('Product', productSchema);
