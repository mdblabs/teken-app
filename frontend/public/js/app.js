// Configuración
const API_URL = 'http://localhost:3000/api';

// Referencias del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const spinner = submitBtn.querySelector('.spinner');
const messageDiv = document.getElementById('message');
const togglePasswordBtn = document.getElementById('togglePassword');

// Toggle mostrar/ocultar contraseña
togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  
  // Cambiar icono (opcional - puedes agregar un icono de "eye-off")
  togglePasswordBtn.setAttribute('aria-label', 
    type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'
  );
});

// Función para mostrar mensajes
function showMessage(message, type = 'error') {
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    hideMessage();
  }, 5000);
}

// Función para ocultar mensajes
function hideMessage() {
  messageDiv.style.display = 'none';
}

// Función para mostrar estado de carga
function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';
  } else {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    spinner.style.display = 'none';
  }
}

// Validación del email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Manejar el envío del formulario
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validaciones del cliente
  if (!email || !password) {
    showMessage('Por favor, completa todos los campos', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showMessage('Por favor, ingresa un email válido', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  // Enviar petición al backend
  setLoading(true);
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para incluir cookies
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Login exitoso
      showMessage('¡Login exitoso! Redirigiendo...', 'success');
      
      // Guardar token en localStorage (opcional)
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Redirigir al dashboard después de 1 segundo
      setTimeout(() => {
        window.location.href = '/dashboard.html'; // Crear esta página más tarde
      }, 1000);
    } else {
      // Error en login
      showMessage(data.message || 'Error al iniciar sesión', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error de conexión. ¿El servidor está corriendo?', 'error');
  } finally {
    setLoading(false);
  }
});

// Manejar botones de login social (placeholder)
const socialButtons = document.querySelectorAll('.btn-social');
socialButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = btn.textContent.trim();
    showMessage(`Login con ${provider} estará disponible próximamente`, 'error');
  });
});

// Manejar link de "olvidaste tu contraseña"
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  showMessage('La recuperación de contraseña estará disponible próximamente', 'error');
});

// Manejar link de registro
const signupLink = document.querySelector('.signup-link');
signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  showMessage('El registro estará disponible próximamente', 'error');
});

// Verificar si ya hay una sesión activa al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Ya hay sesión activa, redirigir
          window.location.href = '/dashboard.html';
        }
      }
    } catch (error) {
      // Si hay error, simplemente continuar con el login
      console.log('No hay sesión activa');
    }
  }
});

// Agregar efecto de ripple a los botones (efecto visual)
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Aplicar efecto ripple a botones
[submitBtn, ...socialButtons].forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Manejar la tecla Enter en los inputs
emailInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    passwordInput.focus();
  }
});
