import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category_id: {
    type: Number,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Category', categorySchema);
