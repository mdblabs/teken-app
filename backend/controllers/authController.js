const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usuarios de ejemplo (en producción, esto debería estar en una base de datos)
const users = [
  {
    id: 1,
    email: 'demo@teken.app',
    password: '$2a$10$XqZ9jYHK9YvxvqK9YvxvqOxR7nE.YxVqL.YxVqL.YxVqL.YxVqL.Y', // 'demo123'
    name: 'Demo User'
  }
];

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Para demo, aceptamos la contraseña 'demo123' directamente
    // En producción, usar bcrypt.compare(password, user.password)
    const isValidPassword = password === 'demo123';
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '24h' }
    );

    // Enviar token como cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true,
    message: 'Logout exitoso' 
  });
};

// Verificar token
exports.verify = (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No autenticado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
};
