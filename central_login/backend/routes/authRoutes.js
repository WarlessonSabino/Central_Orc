const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Adicionado para criptografia de senha
const pool = require('../dbconfig/db'); 
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware de autenticação
const router = express.Router();

// Rota pública (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta a tabela "colaboradores" no banco de dados
        const query = 'SELECT id, nome, email, senha, tipo FROM colaboradores WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        const user = result.rows[0];

        // ⚠️ Se as senhas no banco NÃO estiverem criptografadas, compare diretamente
        if (user.senha !== password) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gera um token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, nome: user.nome, tipo: user.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;
