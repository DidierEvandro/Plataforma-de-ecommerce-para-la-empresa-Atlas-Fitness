const db = require('../models/db.js');

exports.procesarPago = (req, res) => {
  const usuarioId = req.usuario.id; // viene del token, seguro
  const { monto } = req.body;

  // Validar el monto
  if (!monto || isNaN(monto) || monto <= 0) {
    return res.status(400).json({ error: 'Monto inválido' });
  }

  db.query(
    'INSERT INTO pagos (usuario_id, monto, fecha) VALUES (?, ?, NOW())',
    [usuarioId, monto],
    (err, result) => {
      if (err) {
        console.error('Error al procesar pago:', err);
        return res.status(500).json({ error: 'Error al procesar pago' });
      }

      res.status(200).json({ mensaje: 'Pago registrado', pagoId: result.insertId });
    }
  );
};
