const db = require('../models/db.js');

exports.obtenerCarrito = (req, res) => {
  const usuarioId = req.usuario.id; // obtenido del token JWT por middleware

  db.query('SELECT * FROM carrito WHERE usuario_id = ?', [usuarioId], (err, results) => {
    if (err) {
      console.error('Error al obtener carrito:', err);
      return res.status(500).json({ error: 'Error al obtener carrito' });
    }

    res.status(200).json(results);
  });
};
