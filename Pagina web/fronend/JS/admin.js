document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const notificationsBtn = document.getElementById('notificationsBtn');
  const notificationsDropdown = document.getElementById('notificationsDropdown');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const userModal = document.getElementById('userModal');
  const modalClose = document.getElementById('modalClose');
  const viewButtons = document.querySelectorAll('.action-btn.view');
  const statCards = document.querySelectorAll('.stat-card');

  // Toggle sidebar en móviles
  menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-active');
  });

  // Busqueda
  searchButton.addEventListener('click', function() {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });

  // Notificaciones dropdown
  notificationsBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    notificationsDropdown.classList.toggle('show');
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', function() {
    notificationsDropdown.classList.remove('show');
  });

  // Navegación del sidebar
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Actualizar estado activo
      navLinks.forEach(item => {
        item.parentElement.classList.remove('active');
      });
      this.parentElement.classList.add('active');
      
      // Cambiar título del header
      const sectionName = this.querySelector('span').textContent;
      document.querySelector('.admin-header h1').textContent = sectionName;
      
      // Cargar contenido (simulado)
      loadSectionContent(this.getAttribute('href'));
    });
  });

  // Modal para ver detalles de usuario
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.closest('tr').querySelector('td:first-child').textContent;
      showUserDetails(userId);
    });
  });

  // Cerrar modal
  modalClose.addEventListener('click', function() {
    userModal.classList.remove('active');
  });

  // Animación para las tarjetas de estadísticas
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Funciones
  function performSearch(query) {
    if (query.trim() === '') {
      alert('Por favor ingrese un término de búsqueda');
      return;
    }
    console.log(`Buscando: ${query}`);
    // Aquí iría la llamada AJAX para buscar
  }

  function loadSectionContent(sectionId) {
    console.log(`Cargando contenido para: ${sectionId}`);
    // Aquí iría la carga real de contenido mediante AJAX
    
    // Simulación de carga
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
      section.classList.remove('active');
    });
    
    document.querySelector(`${sectionId}-section`).classList.add('active');
  }

  function showUserDetails(userId) {
    console.log(`Mostrando detalles del usuario: ${userId}`);
    // Simulación de datos del usuario
    const userData = {
      '#1001': {
        nombre: 'Juan Pérez',
        email: 'juan.perez@example.com',
        membresia: 'Premium',
        fechaRegistro: '15/05/2024',
        telefono: '+1234567890',
        ultimaVisita: 'Hoy, 10:30 AM'
      },
      '#1002': {
        nombre: 'María Gómez',
        email: 'maria.gomez@example.com',
        membresia: 'Básica',
        fechaRegistro: '14/05/2024',
        telefono: '+0987654321',
        ultimaVisita: 'Ayer, 5:45 PM'
      },
      '#1003': {
        nombre: 'Carlos Ruiz',
        email: 'carlos.ruiz@example.com',
        membresia: 'Premium',
        fechaRegistro: '12/05/2024',
        telefono: '+6789054321',
        ultimaVisita: 'Hace 2 días'
      }
    };
    
    const user = userData[userId] || {
      nombre: 'Usuario no encontrado',
      email: '',
      membresia: '',
      fechaRegistro: '',
      telefono: '',
      ultimaVisita: ''
    };
    
    // Construir el contenido del modal
    const modalBody = userModal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="user-details">
        <div class="detail-row">
          <span class="detail-label">Nombre:</span>
          <span class="detail-value">${user.nombre}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${user.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Membresía:</span>
          <span class="detail-value">${user.membresia}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha Registro:</span>
          <span class="detail-value">${user.fechaRegistro}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Teléfono:</span>
          <span class="detail-value">${user.telefono}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Última Visita:</span>
          <span class="detail-value">${user.ultimaVisita}</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="primary-btn">Enviar Mensaje</button>
        <button class="secondary-btn">Editar Perfil</button>
      </div>
    `;
    
    userModal.classList.add('active');
  }

  // Cargar datos iniciales
  function loadInitialData() {
    console.log('Cargando datos iniciales del dashboard...');
    // Aquí irían las llamadas AJAX para cargar los datos reales
    
    // Simular carga de datos
    setTimeout(() => {
      document.querySelectorAll('.stat-trend').forEach(trend => {
        trend.style.opacity = '1';
      });
    }, 500);
  }

  // Inicialización
  loadInitialData();
});