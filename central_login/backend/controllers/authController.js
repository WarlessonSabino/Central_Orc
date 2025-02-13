const bcrypt = require('bcryptjs');
const { findUserByEmail } = require('../models/userModel');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.senha_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        return res.json({ message: "Login bem-sucedido!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
};

module.exports = { login };
