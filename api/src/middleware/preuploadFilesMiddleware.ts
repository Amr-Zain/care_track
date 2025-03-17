import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import { RequestWithUserSession } from '../utill/types'; 



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req: RequestWithUserSession, file, cb) => {
    const userId = req.user?.id;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  }
});

const fileFilter = (req: Request, file, cb: multer.FileFilterCallback) => {
  if (file.mimetype.match(/image\/(png|jpe?g)/)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadMiddleware = upload.single('image');
