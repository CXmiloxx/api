import jwt from 'jsonwebtoken';
import { config } from '../env/config.js';
import { User } from '../models/User.js';

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Obtener el usuario del token (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'No autorizado, token inválido',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'No autorizado, no hay token',
    });
  }
};

// Middleware para verificar roles de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'No autorizado, se requiere permisos de administrador',
    });
  }
};

export { protect, admin };
