const { obtenerUsuarioPorEmail } = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function autenticarUsuario(correo, contrasena) {
  try {
    // Buscar usuario
    const usuario = await obtenerUsuarioPorEmail(correo);
    if (!usuario) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new Error('Credenciales incorrectas');
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Omitir contraseña en la respuesta
    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    return {
      success: true,
      token,
      usuario: usuarioSinContrasena
    };
  } catch (error) {
    console.error('Error en autenticación:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

function verificarToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: 'Token inválido' };
  }
}

module.exports = { autenticarUsuario, verificarToken };