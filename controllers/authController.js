import User from '../models/User.js';
import { generateToken } from '../utils/errorHandler.js';

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público/Admin
 */
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({
      where: { username },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe',
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      username,
      password,
      role: role || 'supervisor', // Por defecto es supervisor
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Datos de usuario inválidos',
      });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

/**
 * @desc    Autenticar usuario y obtener token
 * @route   POST /api/auth/login
 * @access  Público
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por nombre de usuario
    const user = await User.findOne({ where: { username } });

    // Verificar si el usuario existe y la contraseña es correcta
    if (user && (await user.matchPassword(password))) {
      console.log('Usuario encontrado:', user.toJSON());
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Nombre de usuario o contraseña incorrectos',
      });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener perfil de usuario
 * @route   GET /api/auth/profile
 * @access  Privado
 */
export const getUserProfile = async (req, res) => {
  try {
    // El middleware protect ya añade el usuario a req.user
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil de usuario',
      error: error.message,
    });
  }
};
