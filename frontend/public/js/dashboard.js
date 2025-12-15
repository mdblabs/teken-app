// Configuración
const API_URL = 'http://localhost:3000/api';

// Referencias del DOM
const userGreeting = document.getElementById('userGreeting');
const logoutBtn = document.getElementById('logoutBtn');
const notificationsBtn = document.getElementById('notificationsBtn');
const profileBtn = document.getElementById('profileBtn');
const navItems = document.querySelectorAll('.nav-item');
const actionCards = document.querySelectorAll('.action-card');

// Verificar autenticación al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  loadUserData();
});

// Verificar si el usuario está autenticado
async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    redirectToLogin();
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Token inválido');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('No autenticado');
    }
    
    // Guardar datos del usuario
    localStorage.setItem('user', JSON.stringify(data.user));
    
  } catch (error) {
    console.error('Error de autenticación:', error);
    redirectToLogin();
  }
}

// Redirigir al login
function redirectToLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

// Cargar datos del usuario
function loadUserData() {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    redirectToLogin();
    return;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // Actualizar saludo
    const firstName = user.name ? user.name.split(' ')[0] : user.email.split('@')[0];
    const hour = new Date().getHours();
    let greeting = 'Buenas noches';
    
    if (hour >= 6 && hour < 12) {
      greeting = 'Buenos días';
    } else if (hour >= 12 && hour < 20) {
      greeting = 'Buenas tardes';
    }
    
    userGreeting.textContent = `${greeting}, ${firstName}! 👋`;
    
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    redirectToLogin();
  }
}

// Manejar logout
logoutBtn.addEventListener('click', async () => {
  const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
  
  if (!confirmed) return;
  
  try {
    const token = localStorage.getItem('token');
    
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
  } catch (error) {
    console.error('Error al hacer logout:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }
});

// Manejar botón de notificaciones
notificationsBtn.addEventListener('click', () => {
  showToast('Notificaciones próximamente', 'info');
});

// Manejar botón de perfil
profileBtn.addEventListener('click', () => {
  showToast('Perfil próximamente', 'info');
});

// Manejar navegación móvil
navItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Remover active de todos
    navItems.forEach(nav => nav.classList.remove('active'));
    
    // Agregar active al clickeado
    item.classList.add('active');
    
    // Mostrar mensaje según la sección
    const sections = ['Inicio', 'Buscar', 'Mensajes', 'Perfil'];
    if (index !== 0) {
      showToast(`Sección "${sections[index]}" próximamente`, 'info');
    }
  });
});

// Manejar tarjetas de acción
actionCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    const actions = [
      'Compartir Ubicación',
      'Buscar Emprendedores',
      'Programar Encuentro',
      'Mensajes'
    ];
    showToast(`"${actions[index]}" próximamente`, 'info');
  });
});

// Función para mostrar toasts/notificaciones
function showToast(message, type = 'info') {
  // Remover toast existente si lo hay
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Estilos inline (o puedes agregar clases CSS)
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'info' ? '#3b82f6' : type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
    fontSize: '0.875rem',
    fontWeight: '500',
    animation: 'toastSlideIn 0.3s ease-out',
    maxWidth: 'calc(100% - 2rem)',
    textAlign: 'center'
  });
  
  document.body.appendChild(toast);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Agregar estilos de animación para el toast
const style = document.createElement('style');
style.textContent = `
  @keyframes toastSlideIn {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  @keyframes toastSlideOut {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
  }
`;
document.head.appendChild(style);

// Actualizar stats periódicamente (simulado)
function updateStats() {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(stat => {
    const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
    if (!isNaN(currentValue)) {
      // Pequeña variación aleatoria
      const variation = Math.random() > 0.5 ? 1 : -1;
      const newValue = currentValue + variation;
      
      // Formatear número con comas
      stat.textContent = newValue.toLocaleString();
    }
  });
}

// Actualizar stats cada 30 segundos (opcional, para demo)
// setInterval(updateStats, 30000);

// Prevenir zoom en iOS
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Log para debugging
console.log('Dashboard cargado correctamente');
console.log('Usuario:', localStorage.getItem('user'));
