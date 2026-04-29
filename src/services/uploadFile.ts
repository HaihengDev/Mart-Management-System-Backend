import { PutObjectCommand } from '@aws-sdk/client-s3';
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
