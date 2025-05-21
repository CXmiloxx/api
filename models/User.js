import { DataTypes } from 'sequelize';
import connectDB from '../config/db.js';

export const User = connectDB.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'El email ya existe' },
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6],
        msg: 'La contraseña debe tener al menos 6 caracteres',
      },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  image: {
    type: DataTypes.STRING,
  },
});
