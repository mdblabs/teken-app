const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validation');

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify', authController.verify);

module.exports = router;
