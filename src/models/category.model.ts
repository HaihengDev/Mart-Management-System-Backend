import mongoose from 'mongoose';
import Counter from './counter.model';

const categorySchema = new mongoose.Schema(
  {
    category_id: {
      type: Number,
      required: true,
      unique: true,
    },
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, collection: 'categories' },
);

categorySchema.pre('save', async function () {
  if (this.category_id) return;

  const counter = await Counter.findOneAndUpdate(
    {
      name: 'category_id',
    },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  this.category_id = counter.seq;
});

export default mongoose.model('Category', categorySchema);
