import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../config/r2';

export const uploadFile = async (file: any) => {
  try {
    const key = `products/${Date.now()}-${file.originalname}`;
    const bucketName = process.env.R2_BUCKET;
    const publicUrl = process.env.R2_PUBLIC_URL;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2.send(command);

    const fileUrl = `${publicUrl}/${key}`;

    return fileUrl;
  } catch (err: any) {
    throw new Error('File upload failed!');
  }
};

export const deleteFile = async (key: string) => {
  try {
    const bucketName = process.env.R2_BUCKET;

    if (!bucketName) {
      throw new Error('R2_BUCKET is not defined');
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2.send(command);

    return {
      success: true,
      message: 'File deleted successfully!',
    };
  } catch (err: any) {
    throw new Error(err?.message || 'Failed to delete file');
  }
};

export const updateFile = async (key: string, file: any) => {
  try {
    const newKey = `products/${Date.now()}-${file.originalname}`;
    const bucketName = process.env.R2_BUCKET;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!bucketName) {
      throw new Error('BUCKET_NAME is not defined!');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: newKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2.send(deleteCommand);
    await r2.send(uploadCommand);

    const fileUrl = `${publicUrl}/${key}`;

    return fileUrl;
  } catch (err: any) {
    throw new Error(err?.message || 'Failed to update file: ');
  }
};
