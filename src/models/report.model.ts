import mongoose from 'mongoose';
import { IReport } from '../interfaces/report.interface';
import Counter from '../models/counter.model';

const reportSchema = new mongoose.Schema<IReport>({
  report_id: {
    type: Number,
    unique: true,
  },
  product_name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

reportSchema.pre('save', async function () {
  const counter = await Counter.findOneAndUpdate(
    {
      name: 'report_id',
    },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  this.report_id = counter.seq;
});

export default mongoose.model('Report', reportSchema);
