import Birthday from '../models/Birthday.js';

/**
 * @desc    Crear un nuevo cumpleaños
 * @route   POST /api/birthdays
 * @access  Privado
 */
export const createBirthday = async (req, res) => {
  try {
    const { name, date, description, image } = req.body;
    const user = req.user._id;

    // Crear nuevo cumpleaños
    const birthday = await Birthday.create({
      name,
      date,
      description,
      image,
      user,
    });

    res.status(201).json({
      success: true,
      birthday,
    });
  } catch (error) {
    console.error('Error al crear cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear cumpleaños',
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener todos los cumpleaños del usuario
 * @route   GET /api/birthdays
 * @access  Privado
 */
export const getBirthdays = async (req, res) => {
  try {
    // Obtener solo los cumpleaños del usuario autenticado
    const birthdays = await Birthday.find({ user: req.user._id }).sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      count: birthdays.length,
      birthdays,
    });
  } catch (error) {
    console.error('Error al obtener cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cumpleaños',
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener un cumpleaños por ID
 * @route   GET /api/birthdays/:id
 * @access  Privado
 */
export const getBirthdayById = async (req, res) => {
  try {
    const birthday = await Birthday.findById(req.params.id);

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Cumpleaños no encontrado',
      });
    }

    // Verificar si el cumpleaños pertenece al usuario
    if (birthday.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este cumpleaños',
      });
    }

    res.status(200).json({
      success: true,
      birthday,
    });
  } catch (error) {
    console.error('Error al obtener cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cumpleaños',
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar un cumpleaños
 * @route   PUT /api/birthdays/:id
 * @access  Privado
 */
export const updateBirthday = async (req, res) => {
  try {
    let birthday = await Birthday.findById(req.params.id);

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Cumpleaños no encontrado',
      });
    }

    // Verificar si el cumpleaños pertenece al usuario
    if (birthday.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este cumpleaños',
      });
    }

    // Actualizar campos
    const { name, date, description, image } = req.body;

    birthday.name = name || birthday.name;
    birthday.date = date || birthday.date;
    birthday.description =
      description !== undefined ? description : birthday.description;
    birthday.image = image !== undefined ? image : birthday.image;

    // Guardar cambios
    await birthday.save();

    res.status(200).json({
      success: true,
      birthday,
    });
  } catch (error) {
    console.error('Error al actualizar cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cumpleaños',
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar un cumpleaños
 * @route   DELETE /api/birthdays/:id
 * @access  Privado
 */
export const deleteBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findById(req.params.id);

    if (!birthday) {
      return res.status(404).json({
        success: false,
        message: 'Cumpleaños no encontrado',
      });
    }

    // Verificar si el cumpleaños pertenece al usuario
    if (birthday.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este cumpleaños',
      });
    }

    // Eliminar registro de la base de datos
    await Birthday.deleteOne({ _id: birthday._id });

    res.status(200).json({
      success: true,
      message: 'Cumpleaños eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar cumpleaños:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cumpleaños',
      error: error.message,
    });
  }
};
