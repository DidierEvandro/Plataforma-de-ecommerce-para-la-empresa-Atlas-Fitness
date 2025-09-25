document.addEventListener('DOMContentLoaded', function() {
  // Variables globales
  let currentSection = 'dashboard';
  let currentClient = null;
  
  // Elementos del DOM
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.reception-sidebar');
  const sectionTitle = document.getElementById('section-title');
  const contentSections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.sidebar-nav li');
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationBadge = document.querySelector('.notification-btn .badge');
  
  // Simulación de datos
  const sampleClients = [
    {
      id: '#1001',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '987654321',
      membership: 'Premium',
      expiry: '15/06/2024',
      status: 'active',
      img: '../Imagenes/user1.jpg'
    },
    {
      id: '#1002',
      name: 'María Gómez',
      email: 'maria.gomez@example.com',
      phone: '987654322',
      membership: 'Básica',
      expiry: '10/06/2024',
      status: 'active',
      img: '../Imagenes/user2.jpg'
    }
  ];
  
  const sampleClasses = [
    {
      title: 'Yoga Matutino',
      instructor: 'Ana Martínez',
      time: '6:00 AM - 7:00 AM',
      days: ['Lunes', 'Miércoles'],
      capacity: 15,
      enrolled: 12,
      requirements: 'Traer tapete y toalla'
    }
  ];
  
  // Inicialización
  initDashboard();
  setupEventListeners();
  
  // Funciones de inicialización
  function initDashboard() {
    updateCurrentClients(3); // Simular 3 clientes actuales
    updateTodayCheckins(15); // Simular 15 asistencias hoy
    updateExpiringMemberships(2); // Simular 2 membresías por vencer
    updateNextClass('Spinning - 6:00 PM'); // Simular próxima clase
    
    // Simular notificaciones
    notificationBadge.textContent = '2';
  }
  
  function setupEventListeners() {
    // Menú toggle para pantallas pequeñas
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Navegación entre secciones
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        showSection(section);
        
        // Actualizar clase activa
        navItems.forEach(navItem => navItem.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Notificaciones
    notificationBtn.addEventListener('click', showNotifications);
    
    // Métodos de registro de asistencia
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
      card.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        showCheckinMethod(method);
        
        // Actualizar clase activa
        methodCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Búsqueda de clientes para registro de asistencia
    const clientSearch = document.getElementById('client-search-checkin');
    clientSearch.addEventListener('input', function() {
      if (this.value.length > 2) {
        searchClients(this.value);
      } else {
        hideClientResults();
      }
    });
    
    // Confirmar asistencia
    const confirmCheckinBtn = document.getElementById('confirm-checkin');
    if (confirmCheckinBtn) {
      confirmCheckinBtn.addEventListener('click', confirmCheckin);
    }
    
    // Nuevo pago
    const newPaymentBtn = document.getElementById('new-payment-btn');
    if (newPaymentBtn) {
      newPaymentBtn.addEventListener('click', showPaymentForm);
    }
    
    // Cancelar pago
    const cancelPaymentBtn = document.getElementById('cancel-payment');
    if (cancelPaymentBtn) {
      cancelPaymentBtn.addEventListener('click', hidePaymentForm);
    }
    
    // Mostrar detalles de clase
    const classEvents = document.querySelectorAll('.class-event');
    classEvents.forEach(event => {
      event.addEventListener('click', showClassDetails);
    });
    
    // Cerrar detalles de clase
    const closeDetailsBtn = document.querySelector('.close-details');
    if (closeDetailsBtn) {
      closeDetailsBtn.addEventListener('click', hideClassDetails);
    }
  }
  
  // Funciones de UI
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
  }
  
  function showSection(section) {
    currentSection = section;
    
    // Ocultar todas las secciones
    contentSections.forEach(sec => {
      sec.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const sectionToShow = document.getElementById(`${section}-section`);
    if (sectionToShow) {
      sectionToShow.style.display = 'block';
    }
    
    // Actualizar título
    updateSectionTitle(section);
    
    // Ejecutar funciones específicas de cada sección
    switch(section) {
      case 'dashboard':
        initDashboard();
        break;
      case 'asistencias':
        initCheckinSection();
        break;
      case 'clientes':
        initClientsSection();
        break;
      case 'pagos':
        initPaymentsSection();
        break;
      case 'horarios':
        initScheduleSection();
        break;
    }
  }
  
  function updateSectionTitle(section) {
    const titles = {
      'dashboard': 'Inicio',
      'asistencias': 'Registro de Asistencias',
      'clientes': 'Gestión de Clientes',
      'pagos': 'Registro de Pagos',
      'horarios': 'Horarios de Clases'
    };
    
    sectionTitle.textContent = titles[section] || 'Panel de Recepcionista';
  }
  
  function showNotifications() {
    // Simular notificaciones
    alert('Notificaciones:\n1. 2 membresías por vencer hoy\n2. Clase de Yoga llena');
    notificationBadge.textContent = '0';
  }
  
  // Funciones del Dashboard
  function updateCurrentClients(count) {
    const currentCheckins = document.getElementById('current-checkins');
    if (currentCheckins) currentCheckins.textContent = count;
    
    const clientsList = document.getElementById('current-clients-list');
    if (clientsList) {
      if (count > 0) {
        clientsList.innerHTML = '';
        
        // Simular clientes actuales
        for (let i = 0; i < Math.min(count, sampleClients.length); i++) {
          const client = sampleClients[i];
          clientsList.appendChild(createClientCard(client));
        }
      } else {
        clientsList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-user-slash"></i>
            <p>No hay clientes en el gimnasio actualmente</p>
          </div>
        `;
      }
    }
  }
  
  function updateTodayCheckins(count) {
    const todayCheckins = document.getElementById('today-checkins');
    if (todayCheckins) todayCheckins.textContent = count;
  }
  
  function updateExpiringMemberships(count) {
    const expiringMemberships = document.getElementById('expiring-memberships');
    if (expiringMemberships) expiringMemberships.textContent = count;
  }
  
  function updateNextClass(nextClass) {
    const nextClassElement = document.getElementById('next-class');
    if (nextClassElement) nextClassElement.textContent = nextClass;
  }
  
  function createClientCard(client) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.innerHTML = `
      <img src="${client.img}" alt="${client.name}">
      <div class="client-info">
        <h4>${client.name}</h4>
        <p>${client.membership}</p>
        <small>Entró: ${formatTime(new Date())}</small>
      </div>
    `;
    return card;
  }
  
  // Funciones de la sección de Asistencias
  function initCheckinSection() {
    // Mostrar método manual por defecto
    showCheckinMethod('manual');
  }
  
  function showCheckinMethod(method) {
    // Ocultar todos los métodos
    document.getElementById('manual-checkin-form').style.display = 'none';
    document.getElementById('qr-checkin-form').style.display = 'none';
    document.getElementById('biometric-checkin-form').style.display = 'none';
    
    // Mostrar el método seleccionado
    document.getElementById(`${method}-checkin-form`).style.display = 'block';
    
    // Si es QR, simular activación de cámara
    if (method === 'qr') {
      simulateQRScanner();
    }
    
    // Si es biométrico, simular lector
    if (method === 'biometric') {
      simulateBiometricReader();
    }
  }
  
  function searchClients(query) {
    // Simular búsqueda de clientes
    const results = sampleClients.filter(client => 
      client.name.toLowerCase().includes(query.toLowerCase()) || 
      client.id.toLowerCase().includes(query.toLowerCase())
    );
    
    displayClientResults(results);
  }
  
  function displayClientResults(clients) {
    const resultsContainer = document.getElementById('client-results-container');
    const resultsBody = document.getElementById('client-results-body');
    
    if (clients.length > 0) {
      resultsBody.innerHTML = '';
      
      clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${client.id}</td>
          <td>
            <div class="user-info">
              <img src="${client.img}" alt="${client.name}">
              <span>${client.name}</span>
            </div>
          </td>
          <td>${client.membership}</td>
          <td><span class="status-badge ${client.status}">${client.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
          <td><button class="action-btn select-client" data-id="${client.id}"><i class="fas fa-check"></i> Seleccionar</button></td>
        `;
        resultsBody.appendChild(row);
      });
      
      // Agregar event listeners a los botones de selección
      document.querySelectorAll('.select-client').forEach(btn => {
        btn.addEventListener('click', function() {
          const clientId = this.getAttribute('data-id');
          selectClient(clientId);
        });
      });
      
      resultsContainer.style.display = 'block';
    } else {
      resultsBody.innerHTML = '<tr><td colspan="5" class="no-results">No se encontraron clientes</td></tr>';
      resultsContainer.style.display = 'block';
    }
  }
  
  function hideClientResults() {
    document.getElementById('client-results-container').style.display = 'none';
  }
  
  function selectClient(clientId) {
    // Buscar cliente en los datos de muestra
    const client = sampleClients.find(c => c.id === clientId);
    if (!client) return;
    
    currentClient = client;
    
    // Actualizar UI con información del cliente seleccionado
    const selectedContainer = document.getElementById('selected-client-container');
    document.getElementById('checkin-client-img').src = client.img;
    document.getElementById('checkin-client-name').textContent = client.name;
    document.getElementById('checkin-client-id').textContent = client.id;
    document.getElementById('checkin-client-membership').textContent = client.membership;
    document.getElementById('checkin-client-expiry').textContent = client.expiry;
    
    selectedContainer.style.display = 'flex';
    hideClientResults();
  }
  
  function confirmCheckin() {
    if (!currentClient) return;
    
    // Simular registro de asistencia
    alert(`Asistencia registrada para ${currentClient.name}`);
    
    // Actualizar contadores
    const todayCheckins = document.getElementById('today-checkins');
    if (todayCheckins) todayCheckins.textContent = parseInt(todayCheckins.textContent) + 1;
    
    const currentCheckins = document.getElementById('current-checkins');
    if (currentCheckins) currentCheckins.textContent = parseInt(currentCheckins.textContent) + 1;
    
    // Limpiar selección
    resetCheckinForm();
    
    // Agregar a la tabla de asistencias (simulado)
    addCheckinToTable(currentClient);
  }
  
  function resetCheckinForm() {
    currentClient = null;
    document.getElementById('client-search-checkin').value = '';
    document.getElementById('selected-client-container').style.display = 'none';
  }
  
  function addCheckinToTable(client) {
    const checkinTable = document.querySelector('.checkin-table tbody');
    if (checkinTable) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${formatTime(new Date())}</td>
        <td>
          <div class="user-info">
            <img src="${client.img}" alt="${client.name}">
            <span>${client.name}</span>
          </div>
        </td>
        <td><span class="badge primary">Manual</span></td>
        <td>-</td>
        <td>Recepcionista</td>
      `;
      checkinTable.insertBefore(newRow, checkinTable.firstChild);
    }
  }
  
  function simulateQRScanner() {
    console.log('Simulando activación de cámara QR...');
    // En una implementación real, aquí se integraría con una API de escaneo QR
  }
  
  function simulateBiometricReader() {
    console.log('Simulando lector biométrico...');
    // En una implementación real, aquí se integraría con un lector biométrico
  }
  
  // Funciones de la sección de Clientes
  function initClientsSection() {
    // Simular carga de clientes
    populateClientsTable(sampleClients);
  }
  
  function populateClientsTable(clients) {
    const tableBody = document.querySelector('.client-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    clients.forEach(client => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.id}</td>
        <td>
          <div class="user-info">
            <img src="${client.img}" alt="${client.name}">
            <span>${client.name}</span>
          </div>
        </td>
        <td>
          <div class="contact-info">
            <span>${client.email}</span>
            <small>${client.phone}</small>
          </div>
        </td>
        <td>${client.membership}</td>
        <td>${client.expiry}</td>
        <td><span class="status-badge ${client.status}">${client.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <button class="action-btn view"><i class="fas fa-eye"></i></button>
          <button class="action-btn edit"><i class="fas fa-edit"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Funciones de la sección de Pagos
  function initPaymentsSection() {
    // Simular carga de pagos del día
    populatePaymentsTable();
  }
  
  function showPaymentForm() {
    document.getElementById('payment-form-container').style.display = 'block';
    document.getElementById('new-payment-btn').style.display = 'none';
  }
  
  function hidePaymentForm() {
    document.getElementById('payment-form-container').style.display = 'none';
    document.getElementById('new-payment-btn').style.display = 'inline-block';
    document.getElementById('payment-form').reset();
  }
  
  function populatePaymentsTable() {
    // Simular datos de pagos
    const payments = [
      {
        time: '09:30 AM',
        client: 'Juan Pérez',
        type: 'Membresía Premium',
        amount: 'S/ 89.00',
        method: 'Tarjeta',
        receptionist: 'María Gómez'
      },
      {
        time: '11:15 AM',
        client: 'Carlos López',
        type: 'Membresía Básica',
        amount: 'S/ 49.00',
        method: 'Efectivo',
        receptionist: 'María Gómez'
      }
    ];
    
    const tableBody = document.querySelector('.payment-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    payments.forEach(payment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${payment.time}</td>
        <td>${payment.client}</td>
        <td>${payment.type}</td>
        <td>${payment.amount}</td>
        <td><span class="badge ${payment.method === 'Efectivo' ? 'primary' : 'success'}">${payment.method}</span></td>
        <td>${payment.receptionist}</td>
        <td>
          <button class="action-btn view"><i class="fas fa-receipt"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Funciones de la sección de Horarios
  function initScheduleSection() {
    // Simular carga de horarios
    populateSchedule();
  }
  
  function populateSchedule() {
    // En una implementación real, esto cargaría los horarios desde una API
    console.log('Cargando horarios de clases...');
  }
  
  function showClassDetails() {
    // Simular detalles de clase
    const classDetails = sampleClasses[0];
    document.getElementById('class-detail-title').textContent = classDetails.title;
    document.getElementById('class-detail-instructor').textContent = classDetails.instructor;
    document.getElementById('class-detail-time').textContent = `${classDetails.days.join(' y ')}, ${classDetails.time}`;
    document.getElementById('class-detail-capacity').textContent = `${classDetails.enrolled}/${classDetails.capacity} inscritos`;
    document.getElementById('class-detail-requirements').textContent = classDetails.requirements;
    
    document.getElementById('class-details-container').style.display = 'block';
  }
  
  function hideClassDetails() {
    document.getElementById('class-details-container').style.display = 'none';
  }
  
  // Funciones utilitarias
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Inicializar con la sección dashboard
  showSection('dashboard');
});