import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json(employees);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { employee_name, gender, position, salary } = req.body;
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
