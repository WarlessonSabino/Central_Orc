function formatQuantidadeDosagem(valor) {
    // Extrair a parte numérica e a unidade de medida
    let match = valor.match(/^([\d.]+)\s*(\S+.*)$/);
    if (!match) return valor; // Retorna como está se não corresponder ao formato esperado

    let numero = parseFloat(match[1]); // Converte para número
    let unidade = match[2].trim(); // Remove espaços extras da unidade

    // Se a unidade for '%' e o número for inteiro, remover decimais desnecessários
    if (unidade === "%" && Number.isInteger(numero)) {
        return `${numero}${unidade}`; // Exemplo: "4%"
    }

    // Se for um número inteiro, remove a parte decimal
    if (Number.isInteger(numero)) {
        return `${numero} ${unidade}`;
    } else {
        return `${numero.toString().replace(/\.?0+$/, '')} ${unidade}`; // Remove zeros desnecessários
    }
}



    const formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 });

    document.getElementById('fetchData').addEventListener('click', async () => {
        const cdfil = document.getElementById('cdfil').value; // Código da filial
        const nrorc = document.getElementById('nrorc').value; // Número do orçamento

        // Limpar os resultados anteriores
        document.getElementById('options').innerHTML = '';
        document.getElementById('selectedOrcamentos').innerHTML = '';
        document.getElementById('totals').innerHTML = `
            <div>💰 Total Bruto: <span>R$ 0.00</span></div>
            <div>🎉 Total Desconto: <span>R$ 0.00</span></div>
            <div>💲 Total Geral: <span>R$ 0.00</span></div>
        `;
        document.getElementById('results').style.display = 'none';
        document.getElementById('copyButton').style.display = 'none';

        if (!cdfil || !nrorc) {
            alert('Por favor, preencha os campos de filial e número do orçamento.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/requisicoes?nrorc=${nrorc}&cdfil=${cdfil}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados');
            }

            const data = await response.json();
            renderResults(data);

            document.getElementById('results').style.display = 'block';
            document.getElementById('copyButton').style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });
