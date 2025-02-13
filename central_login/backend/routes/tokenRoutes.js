const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Rota para validar o token
router.post('/verify-token', (req, res) => {
    console.log('🔍 Recebendo requisição para validar token...');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        console.warn('⛔ Token ausente.');
        return res.status(401).json({ message: 'Token ausente.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
        console.log('✅ Token válido:', decoded);
        res.status(200).json({ message: 'Token válido.', user: decoded });
    } catch (err) {
        console.error('⛔ Erro ao verificar o token:', err.message);
        res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
});

module.exports = router;
