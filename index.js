import express from 'express';
import cors from 'cors';
import { config } from './env/config.js';

import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import birthdayRoutes from './routes/birthdayRoutes.js';
import sequelize from './config/db.js';
import Image from './models/Image.js';
import { User } from './models/User.js';
import Birthday from './models/Birthday.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Carpeta estática para imágenes
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/birthdays', birthdayRoutes);

// Relaciones entre modelos
User.hasMany(Image, { foreignKey: 'userId' });
Image.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Birthday, { foreignKey: 'userId' });
Birthday.belongsTo(User, { foreignKey: 'userId' });

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'API de gestión de usuarios, imágenes y cumpleaños' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// Sincronizar modelos con la base de datos y arrancar servidor después
sequelize.sync({ alter: true }) // o { force: true }
  .then(() => {
    console.log('Base de datos y tablas sincronizadas');
    app.listen(config.port, () => {
      console.log(`Servidor corriendo en puerto ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error sincronizando la base de datos:', error);
  });
