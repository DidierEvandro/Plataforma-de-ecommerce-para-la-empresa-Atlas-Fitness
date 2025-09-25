const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Ruta protegida
router.get('/', authMiddleware, carritoController.obtenerCarrito);

module.exports = router;
