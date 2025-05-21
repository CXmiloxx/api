import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middlewares/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router();

// Rutas
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor incluya un email válido').isEmail(),
    check(
      'password',
      'La contraseña debe tener al menos 6 caracteres',
    ).isLength({ min: 6 }),
  ],
  validateRequest,
  registerUser,
);

router.post(
  '/login',
  [
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
  ],
  validateRequest,
  loginUser,
);

router.get('/profile', protect, getUserProfile);

export default router;
