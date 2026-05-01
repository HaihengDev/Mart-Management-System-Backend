import mongoose from 'mongoose';
import Counter from './counter.model';

const supplierSchema = new mongoose.Schema(
  {
    supplier_id: {
      type: Number,
    },
    supplier_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'suppliers' },
);

supplierSchema.pre('save', async function () {
  if (this.supplier_id) return;

  const counter = await Counter.findOneAndUpdate(
    {
      name: 'supplier_id',
    },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  this.supplier_id = counter.seq;
});

export default mongoose.model('Supplier', supplierSchema);
