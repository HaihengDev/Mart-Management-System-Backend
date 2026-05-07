import { Request, Response } from 'express';
import Report from '../models/report.model';

export const getAllReport = async (req: Request, res: Response) => {
  try {
    const reports = Report.find();
    return res.status(200).json(reports);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server errror!',
      result: err?.message,
    });
  }
};

export const createReport = async (
  req: Request,
  res: Response,
  product_name: string,
  quantity: number,
) => {
  try {
    const report = await Report.create({ product_name, quantity });
    return res.status(201).json({
      message: 'Report is created successfully!',
      report,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
