// Clase Carrito para manejar las operaciones del carrito
class Carrito {
  constructor(usuarioId) {
    this.usuarioId = usuarioId;
    this.items = [];
    this.cargarCarrito();
  }

  async cargarCarrito() {
    try {
      // Verificar si el usuario tiene un carrito activo
      const { query } = require('./database');
      
      // Obtener o crear carrito
      let [carrito] = await query(
        'SELECT id FROM carritos WHERE usuario_id = ? ORDER BY creado_en DESC LIMIT 1',
        [this.usuarioId]
      );
      
      if (!carrito) {
        [carrito] = await query(
          'INSERT INTO carritos (usuario_id) VALUES (?)',
          [this.usuarioId]
        );
        this.carritoId = carrito.insertId;
      } else {
        this.carritoId = carrito.id;
      }
      
      // Cargar items del carrito
      const items = await query(
        `SELECT ci.id, ci.producto_id, ci.cantidad, p.nombre, p.precio, p.imagen_url 
         FROM carrito_items ci 
         JOIN productos p ON ci.producto_id = p.id 
         WHERE ci.carrito_id = ?`,
        [this.carritoId]
      );
      
      this.items = items;
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
  }

  async agregarProducto(productoId, cantidad = 1) {
    try {
      const { query } = require('./database');
      
      // Verificar si el producto ya está en el carrito
      const itemExistente = this.items.find(item => item.producto_id == productoId);
      
      if (itemExistente) {
        // Actualizar cantidad
        await query(
          'UPDATE carrito_items SET cantidad = cantidad + ? WHERE id = ?',
          [cantidad, itemExistente.id]
        );
        itemExistente.cantidad += cantidad;
      } else {
        // Agregar nuevo item
        const [producto] = await query(
          'SELECT nombre, precio FROM productos WHERE id = ?',
          [productoId]
        );
        
        if (!producto) throw new Error('Producto no encontrado');
        
        const [result] = await query(
          'INSERT INTO carrito_items (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [this.carritoId, productoId, cantidad]
        );
        
        this.items.push({
          id: result.insertId,
          producto_id: productoId,
          cantidad,
          nombre: producto.nombre,
          precio: producto.precio
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return false;
    }
  }

  async eliminarProducto(productoId) {
    try {
      const { query } = require('./database');
      
      await query(
        'DELETE FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
        [this.carritoId, productoId]
      );
      
      this.items = this.items.filter(item => item.producto_id != productoId);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  async actualizarCantidad(productoId, nuevaCantidad) {
    try {
      const { query } = require('./database');
      
      if (nuevaCantidad <= 0) {
        return await this.eliminarProducto(productoId);
      }
      
      await query(
        'UPDATE carrito_items SET cantidad = ? WHERE carrito_id = ? AND producto_id = ?',
        [nuevaCantidad, this.carritoId, productoId]
      );
      
      const item = this.items.find(item => item.producto_id == productoId);
      if (item) item.cantidad = nuevaCantidad;
      
      return true;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return false;
    }
  }

  async vaciarCarrito() {
    try {
      const { query } = require('./database');
      
      await query(
        'DELETE FROM carrito_items WHERE carrito_id = ?',
        [this.carritoId]
      );
      
      this.items = [];
      return true;
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      return false;
    }
  }

  calcularTotal() {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  async crearOrden(metodoPago) {
    try {
      const { query } = require('./database');
      
      if (this.items.length === 0) {
        throw new Error('No hay items en el carrito');
      }
      
      const total = this.calcularTotal();
      
      // Crear la orden
      const [orden] = await query(
        'INSERT INTO ordenes (usuario_id, total, metodo_pago) VALUES (?, ?, ?)',
        [this.usuarioId, total, metodoPago]
      );
      
      const ordenId = orden.insertId;
      
      // Agregar items a la orden
      for (const item of this.items) {
        await query(
          'INSERT INTO orden_items (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [ordenId, item.producto_id, item.cantidad, item.precio]
        );
      }
      
      // Vaciar el carrito
      await this.vaciarCarrito();
      
      return ordenId;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }
}

module.exports = Carrito;