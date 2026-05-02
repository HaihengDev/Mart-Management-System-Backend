import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model';
import { updateFile, uploadFile } from '../services/r2.services';
import { convertUrlToKey } from '../utils/convertUrlToKey';

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

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of Employee is invalid format!',
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee is not found!',
      });
    }

    return res.status(200).json({
      message: 'Employee is found successfully!',
      data: employee,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
    });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: 'Image is required!',
      });
    }

    const employee_image = await uploadFile('employees', file);
    const { employee_name, gender, position, salary } = req.body;

    if (!employee_name || !gender || !position || !salary) {
      return res.status(400).json({
        message: 'Please fill all information about employee!',
      });
    }

    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        message: 'There is no gay!',
      });
    }

    if (!['employee', 'admin'].includes(position)) {
      return res.status(400).json({
        message: 'Position must be either employee or admin!',
      });
    }

    const employee = Employee.create({
      employee_name,
      employee_image,
      gender,
      position,
      salary,
    });

    return res.status(201).json({
      message: 'Employee is created successfully!',
      employee,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of employee is invalid format!',
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: 'Employee is not found!',
      });
    }

    let employee_image = employee.employee_image;
    const file = req.file;

    if (file) {
      try {
        if (employee.employee_image) {
          const key = convertUrlToKey(employee.employee_image);

          if (!key) {
            return res.status(500).json({
              message: 'Failed to parse existing product image key!',
            });
          }

          employee_image = await updateFile('employees', key, file);
        } else {
          employee_image = await uploadFile('employees', file);
        }
      } catch (err: any) {
        return res.status(500).json({
          message: 'failed to upload file!',
          result: err?.message,
        });
      }
    }

    const updatedData: Record<string, any> = {};

    const { employee_name, gender, position, salary } = req.body || {};

    if (employee_name !== undefined) updatedData.employee_name = employee_name;
    if (gender !== undefined) updatedData.gender = gender;
    if (position !== undefined) updatedData.position = position;
    if (salary !== undefined) updatedData.salary = salary;
    if (file) updatedData.employee_image = employee_image;

    const hasBodyUpdates = Object.keys(updatedData).length > 0;

    if (!hasBodyUpdates) {
      return res.status(400).json({
        message: 'No update data provided!',
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: 'Employee updated successfully!',
      data: updatedEmployee,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
