import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import config from '../config/env.js';
import { getUserUploadDir, generateSafeFilename } from '../utils/fileUtils.js';

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // User is guaranteed to exist because upload route has requireAuth
    const userId = req.user?.id || 'anonymous';
    const userDir = getUserUploadDir(userId);
    cb(null, userDir);
  },
  filename: (req: Request, file, cb) => {
    const safeName = generateSafeFilename(file.originalname);
    cb(null, safeName);
  },
});

const allowedMimeTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];

  if (allowedMimeTypes.includes(file.mimetype) || validExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only PDF, PNG, and JPG files are accepted.`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024, // 10MB
    files: 10, // up to 10 files per request
  },
});

export default upload;
