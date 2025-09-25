const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  const { usuario, contrasena } = req.body;

  // Buscar usuario por nombre
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length > 0) {
      const usuarioDB = results[0];

      // Comparar la contraseña ingresada con el hash almacenado
      const match = await bcrypt.compare(contrasena, usuarioDB.contrasena);

      if (match) {
        res.status(200).json({ mensaje: 'Login exitoso', usuario: usuarioDB });
      } else {
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      }
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
  });
};
exports.register = async (req, res) => {
  const { usuario, contrasena, correo } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 rondas de sal

    db.query(
      'INSERT INTO usuarios (usuario, contrasena, correo) VALUES (?, ?, ?)',
      [usuario, hashedPassword, correo],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, carritoController.obtenerCarrito);

module.exports = router;
