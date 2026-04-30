import mongoose from 'mongoose';
const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
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
    expiry_date: {
      type: Date,
      required: true
    },
    category_id: {
      type: String,
      required: true,
    },
    supplier_id: {
      type: String,
      required: true
    }
  },
  { timestamps: true, collection: 'products' },
);

export default mongoose.model('Product', productSchema);
