import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import {
  createImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
} from '../controllers/imageController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { check } from 'express-validator';

const router = express.Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filtro para tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }, // 5MB
});

// Rutas
router.post(
  '/',
  protect,
  upload.single('image'),
  [check('title', 'El título es obligatorio').not().isEmpty()],
  validateRequest,
  createImage,
);

router.get('/', protect, getImages);

router.get('/:id', protect, getImageById);

router.put(
  '/:id',
  protect,
  [check('title', 'El título es obligatorio').optional().not().isEmpty()],
  validateRequest,
  updateImage,
);

router.delete('/:id', protect, deleteImage);
export default router;