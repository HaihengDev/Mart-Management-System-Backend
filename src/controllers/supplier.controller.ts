import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Supplier from '../models/supplier.model';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json(suppliers);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const getSupplierByName = async (req: Request, res: Response) => {
  try {
    const { s_name } = req.query;

    if (!s_name) {
      return res.status(400).json({
        message: 'Supplier name is required for search!',
      });
    }

    const supplier = await Supplier.findOne({ supplier_name: String(s_name) });

    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier is not found!',
      });
    }

    return res.status(200).json({
      message: 'Supplier is found successfully!',
      supplier,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export async function createSupplier(req: Request, res: Response) {
  try {
    const { supplier_name, phone, email, address } = req.body;
    if (!supplier_name || !phone || !email || !address) {
      return res.status(400).json({
        message: 'Supplier name, phone, email, address are required!',
      });
    }

    const supplier = await Supplier.create({
      supplier_name,
      phone,
      email,
      address,
    });

    return res.status(201).json({
      message: 'Supplier is created successfully!',
      supplier,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
}

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of supplier is invalid format!',
      });
    }

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        message: 'Supplier is not found!',
      });
    }

    return res.status(200).json({
      message: 'Supplier is deleted successfully!',
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ObjectId of supplier is invalid format!',
      });
    }

    const { supplier_name, phone, email, address } = req.body;

    if (!supplier_name && !phone && !email && !address) {
      return res.status(400).json({
        message: 'Require atleast one field to update!',
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      {
        supplier_name,
        phone,
        email,
        address,
      },
      { new: true },
    );

    return res.status(200).json({
      message: 'Supplier is updated successfully!',
      updatedSupplier,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Server error!',
      result: err?.message,
    });
  }
};
