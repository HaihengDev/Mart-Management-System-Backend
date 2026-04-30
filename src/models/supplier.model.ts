import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplier_id: {
      type: Number,
      required: true,
    },
    supplier_name: {
      type: String,
      required: true,
    },
    phnone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true, collection: 'suppliers' },
);

export default mongoose.model('Supplier', supplierSchema);
