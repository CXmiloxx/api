import Image from '../models/Image.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Crear una nueva imagen
 * @route   POST /api/images
 * @access  Privado
 */
export const createImage = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const user = req.user._id;

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Por favor sube una imagen',
      });
    }

    // Crear la URL de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;

    // Crear nueva imagen en la base de datos
    const image = await Image.create({
      title,
      description,
      imageUrl,
      user,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      public: req.body.public === 'true',
    });

    res.status(201).json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Error al crear imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear imagen',
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener todas las imágenes (públicas o del usuario autenticado)
 * @route   GET /api/images
 * @access  Privado
 */
export const getImages = async (req, res) => {
  try {
    // Filtrar por imágenes públicas o del usuario autenticado
    const filter = {
      $or: [{ public: true }, { user: req.user._id }],
    };

    // Aplicar filtros adicionales si se proporcionan
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    const images = await Image.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener imágenes',
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener una imagen por ID
 * @route   GET /api/images/:id
 * @access  Privado
 */
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate(
      'user',
      'name email',
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    // Verificar si la imagen es pública o pertenece al usuario autenticado
    if (
      !image.public &&
      image.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta imagen',
      });
    }

    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener imagen',
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar una imagen
 * @route   PUT /api/images/:id
 * @access  Privado
 */
export const updateImage = async (req, res) => {
  try {
    let image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    // Verificar si la imagen pertenece al usuario
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta imagen',
      });
    }

    // Actualizar campos
    const { title, description, public: isPublic, tags } = req.body;

    image.title = title || image.title;
    image.description = description || image.description;
    image.public = isPublic === 'true' || isPublic === true;

    if (tags) {
      image.tags = tags.split(',').map((tag) => tag.trim());
    }

    // Guardar cambios
    await image.save();

    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar imagen',
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar una imagen
 * @route   DELETE /api/images/:id
 * @access  Privado
 */
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada',
      });
    }

    // Verificar si la imagen pertenece al usuario
    if (image.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta imagen',
      });
    }

    // Eliminar archivo físico
    const filePath = path.join(process.cwd(), image.imageUrl.replace('/', ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de la base de datos
    await Image.deleteOne({ _id: image._id });

    res.status(200).json({
      success: true,
      message: 'Imagen eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar imagen',
      error: error.message,
    });
  }
};
