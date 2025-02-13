const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes'); 
const tokenRoutes = require('./routes/tokenRoutes'); 


require('dotenv').config(); // Carrega as variáveis do .env

const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Define a origem permitida para evitar CORS aberto
app.use(express.json()); // Substitui body-parser

// Rota pública (teste)
app.get('/', (req, res) => {
    res.send('Servidor rodando! 🚀');
});

// Rotas de autenticação (login, registro, etc.)
app.use('/api/auth', authRoutes);

// Rotas para validar token
app.use('/api', tokenRoutes)

// Rota protegida (exemplo)
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Você acessou uma rota protegida!', user: req.user });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});