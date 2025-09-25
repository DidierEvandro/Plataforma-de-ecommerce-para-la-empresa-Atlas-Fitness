// Añade esto al final de tu script existente
document.addEventListener('DOMContentLoaded', function() {
  // ... tu código existente ...

  // Calendario de asistencias
  const calendar = document.getElementById('calendarTable');
  const monthLabel = document.getElementById('monthLabel');
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Datos de ejemplo - en una aplicación real esto vendría de una base de datos
  const attendedDays = [1, 3, 7, 12, 18, 20, 23, 27];
  const missedDays = [2, 4, 5, 10, 14, 15, 21];

  function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Formatear el título del mes (EJ. "JUNIO 2024")
    monthLabel.textContent = new Date(year, month).toLocaleString('es', { 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();

    let html = '<tr>';
    // Encabezados de días
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(d => {
      html += `<th>${d}</th>`;
    });
    html += '</tr><tr>';

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      html += '<td></td>';
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const classes = [
        attendedDays.includes(day) ? 'attended' : '',
        missedDays.includes(day) ? 'missed' : '',
        isToday ? 'today' : ''
      ].filter(Boolean).join(' ');
      
      html += `<td class="${classes}">${day}</td>`;
      
      // Nueva fila cada semana
      if ((firstDay + day) % 7 === 0) {
        html += '</tr><tr>';
      }
    }

    html += '</tr>';
    calendar.innerHTML = html;
  }

  // Cambiar mes
  window.changeMonth = function(step) {
    currentMonth += step;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  };

  // Inicializar calendario
  renderCalendar(currentMonth, currentYear);
});
    document.addEventListener('DOMContentLoaded', function() {
      // Menú mobile
      const mobileMenuButton = document.querySelector('.mobile-menu-button');
      const navList = document.querySelector('.nav-list');
      
      mobileMenuButton.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navList.setAttribute('data-visible', !isExpanded);
      });

      // Gráfico de progreso
      const ctx = document.getElementById('weightChart').getContext('2d');
      const weightChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Peso (kg)',
            data: [78.5, 77.2, 76.0, 75.1, 74.5, 73.8, 73.3],
            borderColor: '#ffd700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y.toFixed(1) + ' kg';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) {
                  return value + ' kg';
                }
              }
            }
          }
        }
      });

      // Formulario de registro de progreso
      const progressForm = document.getElementById('progressForm');
      progressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación básica
        if (!progressForm.checkValidity()) {
          return;
        }
        
        // Simular envío exitoso
        showNotification('Progreso registrado correctamente', 'success');
        
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Progreso registrado:', {
          date: document.getElementById('progressDate').value,
          weight: document.getElementById('weight').value,
          bodyFat: document.getElementById('bodyFat').value,
          muscleMass: document.getElementById('muscleMass').value
        });
        
        // Limpiar formulario
        progressForm.reset();
      });

      // Mostrar notificación
      function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }
    });