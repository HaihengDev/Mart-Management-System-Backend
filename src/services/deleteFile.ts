import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../config/r2';

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
