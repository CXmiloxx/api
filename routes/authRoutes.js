import express from 'express';
import { check } from 'express-validator';
import { protect, admin } from '../middlewares/authMiddleware.js';
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
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check(
      'password',
      'La contraseña debe tener al menos 6 caracteres',
    ).isLength({ min: 6 }),
    check('role').optional().isIn(['supervisor', 'admin']),
  ],
  validateRequest,
  registerUser,
);

router.post(
  '/login',
  [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').exists(),
  ],
  validateRequest,
  loginUser,
);

router.get('/profile', protect, getUserProfile);

export default router;
