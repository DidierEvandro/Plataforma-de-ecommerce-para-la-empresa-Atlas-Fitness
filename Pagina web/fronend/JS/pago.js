document.addEventListener('DOMContentLoaded', function() {
  // ========================
  // CONFIGURACIÓN INICIAL
  // ========================
  const paymentForm = document.getElementById('paymentForm');
  const methodTabs = document.querySelectorAll('.method-tab');
  const methodContents = document.querySelectorAll('.method-content');
  const successModal = document.getElementById('successModal');
  const continueBtn = document.getElementById('continueBtn');

  // ========================
  // MÉTODOS DE Pago PERUANOS
  // ========================
  const peruvianPayment = {
    init: function() {
      this.setupCopyButtons();
      this.generateCIP();
      this.setupWalletUploads();
    },

    // Configurar botones de copia
    setupCopyButtons: function() {
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const textToCopy = this.parentElement.querySelector('strong').textContent.replace(/\s/g, '');
          navigator.clipboard.writeText(textToCopy)
            .then(() => this.showCopyFeedback())
            .catch(err => console.error('Error al copiar: ', err));
        });
      });
    },

    // Feedback visual al copiar
    showCopyFeedback: function() {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
      this.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.backgroundColor = '';
      }, 2000);
    },

    // Generar código CIP (simulado)
    generateCIP: function() {
      const generateRandomCIP = () => {
        const randomNum = Math.floor(Math.random() * 10000000000000000);
        return '123' + randomNum.toString().padStart(16, '0');
      };

      const formatCIP = (cip) => {
        return cip.match(/.{1,4}/g).join(' ');
      };

      const cipCode = generateRandomCIP();
      document.querySelector('.cip-code strong').textContent = formatCIP(cipCode);
      this.setCIPExpiry();
    },

    // Establecer fecha de expiración CIP
    setCIPExpiry: function() {
      const now = new Date();
      const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      document.querySelector('.cip-expiry strong').textContent = 
        expiry.toLocaleDateString('es-PE', options);
    },

    // Configurar subida de comprobantes
    setupWalletUploads: function() {
      ['yape', 'plin'].forEach(wallet => {
        const input = document.getElementById(`${wallet}-voucher`);
        input?.addEventListener('change', function(e) {
          if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            const label = input.previousElementSibling;
            label.innerHTML = `Comprobante: <strong>${fileName}</strong>`;
          }
        });
      });
    }
  };

  // ========================
  // MANEJO DE TARJETAS
  // ========================
  const cardHandler = {
    init: function() {
      this.setupCardNumberInput();
      this.setupExpiryInput();
      this.setupCVVInput();
    },

    // Formatear número de tarjeta
    setupCardNumberInput: function() {
      const cardNumberInput = document.getElementById('card-number');
      
      cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '');
        if (value.length > 16) value = value.substr(0, 16);
        
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) formattedValue += ' ';
          formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        cardHandler.detectCardType(value);
      });
    },

    // Detectar tipo de tarjeta
    detectCardType: function(cardNumber) {
      const cardIcons = document.querySelector('.card-icons');
      if (!cardNumber) return;

      // Visa
      if (/^4/.test(cardNumber)) {
        cardIcons.innerHTML = `
          <img src="Imagenes/visa.png" alt="Visa" class="highlight">
          <img src="Imagenes/mastercard.png" alt="Mastercard">
          <img src="Imagenes/amex.png" alt="American Express">
        `;
      } 
      // Mastercard
      else if (/^5[1-5]/.test(cardNumber)) {
        cardIcons.innerHTML = `
          <img src="Imagenes/visa.png" alt="Visa">
          <img src="Imagenes/mastercard.png" alt="Mastercard" class="highlight">
          <img src="Imagenes/amex.png" alt="American Express">
        `;
      }
      // American Express
      else if (/^3[47]/.test(cardNumber)) {
        cardIcons.innerHTML = `
          <img src="Imagenes/visa.png" alt="Visa">
          <img src="Imagenes/mastercard.png" alt="Mastercard">
          <img src="Imagenes/amex.png" alt="American Express" class="highlight">
        `;
      }
    },

    // Formatear fecha de expiración
    setupExpiryInput: function() {
      const cardExpiryInput = document.getElementById('card-expiry');
      
      cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.substr(0, 4);
        
        if (value.length > 2) {
          value = value.substr(0, 2) + '/' + value.substr(2);
        }
        
        e.target.value = value;
      });
    },

    // Validar CVV
    setupCVVInput: function() {
      const cardCvvInput = document.getElementById('card-cvv');
      
      cardCvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    }
  };

  // ========================
  // MANEJO DE FORMULARIO
  // ========================
  const formHandler = {
    init: function() {
      this.setupMethodTabs();
      this.setupFormSubmit();
      this.setupModal();
    },

    // Configurar tabs de métodos de pago
    setupMethodTabs: function() {
      methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const method = this.getAttribute('data-method');
          
          // Actualizar tabs
          methodTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          
          // Mostrar contenido correspondiente
          methodContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${method}-method`) {
              content.classList.add('active');
            }
          });
        });
      });
    },

    // Enviar formulario
    setupFormSubmit: function() {
      paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar términos y condiciones
        if (!document.getElementById('terms').checked) {
          alert('Debes aceptar los términos y condiciones');
          return;
        }
        
        // Validación adicional según método de pago
        const activeMethod = document.querySelector('.method-tab.active').getAttribute('data-method');
        
        if (activeMethod === 'credit') {
          if (!formHandler.validateCardForm()) return;
        } 
        else if (['yape', 'plin'].includes(activeMethod)) {
          if (!confirm('¿Confirmas que has realizado el pago por ' + (activeMethod === 'yape' ? 'Yape' : 'Plin') + '?')) {
            return;
          }
        }
        
        formHandler.simulatePayment();
      });
    },

    // Validar formulario de tarjeta
    validateCardForm: function() {
      const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
      const cardName = document.getElementById('card-name').value;
      const cardExpiry = document.getElementById('card-expiry').value;
      const cardCvv = document.getElementById('card-cvv').value;
      
      if (cardNumber.length !== 16) {
        alert('Por favor ingresa un número de tarjeta válido (16 dígitos)');
        return false;
      }
      
      if (!cardName.trim()) {
        alert('Por favor ingresa el nombre como aparece en la tarjeta');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Por favor ingresa una fecha de expiración válida (MM/AA)');
        return false;
      }
      
      if (cardCvv.length < 3 || cardCvv.length > 4) {
        alert('Por favor ingresa un CVV válido (3 o 4 dígitos)');
        return false;
      }
      
      return true;
    },

    // Simular pago (en producción se conectaría al backend)
    simulatePayment: function() {
      const submitBtn = paymentForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      
      // Mostrar estado de carga
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
      submitBtn.disabled = true;
      
      // Simular demora de red/procesamiento
      setTimeout(() => {
        // Mostrar modal de éxito
        successModal.style.display = 'flex';
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Desplazarse al modal
        successModal.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    },

    // Configurar modal de confirmación
    setupModal: function() {
      // Continuar después del pago
      continueBtn.addEventListener('click', function() {
        window.location.href = 'perfiluser.html';
      });
      
      // Cerrar modal haciendo clic fuera
      successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
          successModal.style.display = 'none';
        }
      });
    }
  };

  // ========================
  // INICIALIZACIÓN
  // ========================
  peruvianPayment.init();
  cardHandler.init();
  formHandler.init();
  // Agregar este script al final de pago.html
document.addEventListener('DOMContentLoaded', async function() {
  const usuarioId = localStorage.getItem('usuarioId');
  
  if (!usuarioId) {
    window.location.href = 'login.html';
    return;
  }
  
  const carrito = new Carrito(usuarioId);
  await carrito.cargarCarrito();
  
  const total = carrito.calcularTotal() * 1.18; // +IGV
  
  // Actualizar total en la página
  document.querySelectorAll('.detail-row.total span').forEach(el => {
    el.textContent = `S/ ${total.toFixed(2)}`;
  });
  
  document.getElementById('continueBtn').addEventListener('click', async function() {
    try {
      // Crear orden con el método de pago seleccionado
      const metodoPago = document.querySelector('.method-tab.active').dataset.method;
      const ordenId = await carrito.crearOrden(metodoPago);
      
      // Mostrar modal de éxito
      document.getElementById('successModal').style.display = 'flex';
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago: ' + error.message);
    }
  });
});
});