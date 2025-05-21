import { validationResult } from 'express-validator';

/**
 * Middleware para validar las solicitudes usando express-validator
 * Verifica si hay errores de validación y devuelve una respuesta de error si los hay
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }

  next();
};

export default validateRequest;
