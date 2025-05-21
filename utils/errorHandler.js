import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { config } from '../env/config.js';

// Utilidad para manejar errores en la API

/**
 * Crea un objeto de error con formato estandarizado
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @returns {Error} Error formateado
 */
export const errorResponse = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Genera un token JWT para autenticación
 * @param {Object} user - Objeto de usuario
 * @param {string} secret - Secreto para firmar el token
 * @param {string} expiresIn - Tiempo de expiración
 * @returns {string} Token JWT
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

/**
 * Middleware para validar los resultados de express-validator
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};