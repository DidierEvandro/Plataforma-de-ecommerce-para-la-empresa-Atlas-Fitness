const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Ruta protegida
router.post('/', authMiddleware, pagoController.procesarPago);

module.exports = router;
