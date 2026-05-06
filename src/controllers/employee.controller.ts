import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model';
import User from '../models/user.model';
import { deleteFile, uploadFile, updateFile } from '../services/r2.services';
import { convertUrlToKey } from '../utils/convertUrlToKey';
import {
  generateUsername,
  generatePassword,
  hashedPassword,
} from '../utils/auth.util';

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
      return res.status(400).json({ message: 'Image is required!' });
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
        message: 'Invalid gender!',
      });
    }

    if (!['employee', 'admin'].includes(position)) {
      return res.status(400).json({
        message: 'Position must be employee or admin!',
      });
    }

    // 👇 CREATE EMPLOYEE
    const employee = await Employee.create({
      employee_name,
      employee_image,
      gender,
      position,
      salary,
    });

    // 👇 CREATE USER FROM EMPLOYEE
    const username = generateUsername(employee_name);
    const password = generatePassword();
    const hashed = await hashedPassword(password);

    const user = await User.create({
      user_id: Number(employee.employee_id),
      username,
      password: hashed,
      role: position,
    });

    return res.status(201).json({
      message: 'Employee and User created successfully!',
      employee,
      user: {
        username: user.username,
        password, // show only once
      },
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

    if (gender !== undefined && !['Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        message: 'Invalid gender!',
      });
    }

    if (position !== undefined && !['employee', 'admin'].includes(position)) {
      return res.status(400).json({
        message: 'Position must be employee or admin!',
      });
    }

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

    if (updatedEmployee) {
      const userUpdatedData: Record<string, any> = {};

      if (employee_name !== undefined) {
        userUpdatedData.username = generateUsername(employee_name);
      }

      if (position !== undefined) {
        userUpdatedData.role = position;
      }

      if (Object.keys(userUpdatedData).length > 0) {
        await User.findOneAndUpdate(
          { user_id: Number(updatedEmployee.employee_id) },
          userUpdatedData,
          { new: true, runValidators: true },
        );
      }
    }

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

export const deleteEmployee = async (req: Request, res: Response) => {
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

    if (employee.employee_image) {
      const key = convertUrlToKey(employee.employee_image);
      if (key) {
        await deleteFile(key);
      }
    }

    await User.findOneAndDelete({ user_id: Number(employee.employee_id) });
    await Employee.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Employee and related user deleted successfully!',
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
