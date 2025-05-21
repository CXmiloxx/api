import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ajusta la ruta según tu proyecto

export const Image = sequelize.define('Image', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es obligatorio' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La URL de la imagen es obligatoria' },
      isUrl: { msg: 'Debe ser una URL válida' },
    },
  },
  userId: {
    type: DataTypes.INTEGER, // o DataTypes.UUID si usas UUID para usuarios
    allowNull: false,
    references: {
      model: 'Users', // nombre de la tabla User
      key: 'id',
    },
  },
  tags: {
    type: DataTypes.JSON, // Guardar arreglo de strings como JSON
    allowNull: true,
    defaultValue: [],
  },
  public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default Image;
