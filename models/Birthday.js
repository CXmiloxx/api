import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ajusta según ruta

export const Birthday = sequelize.define('Birthday', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
    },
  },
  date: {
    type: DataTypes.DATEONLY,  // solo fecha sin hora
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La fecha de cumpleaños es obligatoria' },
      isDate: { msg: 'Debe ser una fecha válida' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  userId: {
    type: DataTypes.INTEGER,  // o el tipo que uses para el ID de User
    allowNull: false,
    references: {
      model: 'Users', // nombre de la tabla User en la DB
      key: 'id',
    },
  },
}, {
  timestamps: true, // createdAt y updatedAt automáticos
});

export default Birthday;
