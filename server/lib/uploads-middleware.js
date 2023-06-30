/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'node:path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

// connect us to S3 on AWS
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// create a storage adapter
const storage = multerS3({
  s3: s3,
  acl: 'public-read',
  // ☝️ so that anyone with a url can view the file
  bucket: process.env.AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // ☝️ so that when the file is downloaded,
  // the proper Content-Type header is set in the response
  key: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    done(null, `${Date.now()}${fileExtension.toLowerCase()}`);
  },
});

export default multer({ storage });
