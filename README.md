# API de Gestión de Usuarios, Imágenes y Cumpleaños

## Descripción

Esta API permite gestionar usuarios, crear y almacenar imágenes, y registrar cumpleaños.

## Estructura del Proyecto

```
/api
├── config/             # Configuración de la aplicación
│   └── db.js           # Configuración de la base de datos
├── controllers/        # Controladores para la lógica de negocio
│   ├── authController.js
│   ├── birthdayController.js
│   └── imageController.js
├── middlewares/        # Middlewares para autenticación y validación
│   ├── authMiddleware.js
│   └── validateRequest.js
├── models/             # Modelos de datos
│   ├── User.js
│   ├── Birthday.js
│   └── Image.js
├── routes/             # Rutas de la API
│   ├── authRoutes.js
│   ├── birthdayRoutes.js
│   └── imageRoutes.js
├── utils/              # Utilidades
│   └── errorHandler.js
├── uploads/            # Carpeta para almacenar imágenes subidas
├── .env                # Variables de entorno
├── index.js            # Punto de entrada de la aplicación
└── package.json        # Dependencias del proyecto
```

## Instalación

```bash
pnpm install
```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/api-db
JWT_SECRET=tu_secreto_seguro
```

## Ejecución

```bash
pnpm start
```

## Endpoints

### Autenticación

- POST /api/auth/register - Registrar un nuevo usuario
- POST /api/auth/login - Iniciar sesión

### Imágenes

- POST /api/images - Subir una nueva imagen
- GET /api/images - Obtener todas las imágenes
- GET /api/images/:id - Obtener una imagen específica

### Cumpleaños

- POST /api/birthdays - Registrar un nuevo cumpleaños
- GET /api/birthdays - Obtener todos los cumpleaños
- GET /api/birthdays/:id - Obtener un cumpleaños específico
- PUT /api/birthdays/:id - Actualizar un cumpleaños
- DELETE /api/birthdays/:id - Eliminar un cumpleaños
