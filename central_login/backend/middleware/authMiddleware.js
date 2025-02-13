const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrai o token do cabeçalho 'Authorization'

    if (!token) {
        return res.status(401).json({ message: 'Token ausente. Acesso negado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token com a chave secreta
        req.user = decoded; // Adiciona os dados decodificados ao objeto req
        next(); // Continua para a próxima função (rota protegida)
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;
