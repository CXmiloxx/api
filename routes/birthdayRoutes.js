import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';
import {
  createBirthday,
  getBirthdays,
  getBirthdayById,
  updateBirthday,
  deleteBirthday,
} from '../controllers/birthdayController.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router();

// Rutas
router.post(
  '/',
  protect,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('date', 'La fecha de cumpleaños es obligatoria').not().isEmpty(),
  ],
  validateRequest,
  createBirthday,
);

router.get('/', protect, getBirthdays);

router.get('/:id', protect, getBirthdayById);

router.put(
  '/:id',
  protect,
  [
    check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('date', 'La fecha debe ser válida').optional().isDate(),
  ],
  validateRequest,
  updateBirthday,
);

router.delete('/:id', protect, deleteBirthday);

export default router;
