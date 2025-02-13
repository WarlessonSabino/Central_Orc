document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores dos campos
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Verifica se os campos estão preenchidos
    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        // Faz a requisição para o backend
        const response = await fetch('http://localhost:3100/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) // Envia os dados no corpo da requisição
        });

        const data = await response.json();

        if (response.ok) {
            // Armazena o token no sessionStorage
            sessionStorage.setItem('token', data.token);

            alert('Login bem-sucedido!');
            // Redireciona para a página principal (URL absoluta)
            window.location.href = 'http://systempharmes.ddns.net/front.html';
        } else {
            alert(`Erro: ${data.message || 'Credenciais inválidas'}`);
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    }
});
