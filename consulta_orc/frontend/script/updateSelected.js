function updateSelected() {
    const selectedContainer = document.getElementById('selectedOrcamentos');
    const totalsContainer = document.getElementById('totals');

    selectedContainer.innerHTML = '';
    let totalBruto = 0; // Total bruto
    let totalDesconto = 0; // Total de desconto
    let totalGeral = 0; // Total geral
    let copiedText = ''; // Texto a ser copiado

    const introMessage = `
✨ Obrigado por escolher nossa farmácia de manipulação! ✨

Fiz seu orçamento com todo cuidado e atenção que você merece!

`;
    const conclusionMessage = `
Assim que aprovado, nossa equipe começa imediatamente a manipular sua fórmula com todo o cuidado que você merece.

Qualquer dúvida, estamos prontos para ajudar! Conte conosco para sua saúde e bem-estar! 


Conte conosco para sua saúde e bem-estar!

`;

    copiedText += introMessage;

    document.querySelectorAll('.orcamento-checkbox:checked').forEach(checkbox => {
        const numero = checkbox.getAttribute('data-numero');
        const detalhes = JSON.parse(checkbox.getAttribute('data-detalhes'));
        const formattedNumero = numero.replace(/\s+/g, ''); 

        // Consolidar os componentes
        const componentesArray = detalhes.map(item => {
        const quantidadeFormatada = formatQuantidadeDosagem(item['Quantidade Dosagem']);
        return `${item['Componentes da Fórmula']}: ${quantidadeFormatada}`;
    });

        const componentesHtml = componentesArray.join('<br>');
        const componentesText = componentesArray.join('\n');

        const item = detalhes[0]; 
        const bruto = parseFloat(item['Valor_Bruto']);
        const desconto = parseFloat(item['Valor_Desconto']);
        const geral = parseFloat(item['Valor a Pagar']);

        totalBruto += bruto;
        totalDesconto += desconto;
        totalGeral += geral;

        const formattedBruto = formatter.format(bruto);
        const formattedDesconto = formatter.format(desconto);
        const formattedGeral = formatter.format(geral);

        const message = document.createElement('div');
        message.classList.add('message');
        message.innerHTML = `
            <strong>📝 Orçamento N:</strong> ${numero}<br><br>                
            <strong>Fórmula Farmacêutica:</strong> ${item['Fórmula Farmacêutica']}<br>
            <strong>Quantidade:</strong> ${item['Quantidade']} <strong>Quantidade de Potes:</strong> ${item['Quantidade Potes']}<br><br> 
            <strong>📦 Fórmula Manipulada:</strong><br>${componentesHtml}<br><br>
            <strong>Bruto:</strong> R$ ${formattedBruto} 
            | <strong>Desconto:</strong> R$ ${formattedDesconto} 
            | <strong>Geral:</strong> R$ ${formattedGeral}
        `;
        selectedContainer.appendChild(message);

        copiedText += `
📝 ORC:${formattedNumero} | Quantidade: ${item['Quantidade']} | Potes: ${item['Quantidade Potes']}


Fórmula Manipulada:
${componentesText}

${desconto > 0 ? `Sub-Total: R$ ${formattedBruto} | Total de Descontos: R$ ${formattedDesconto} | Total: R$ ${formattedGeral}` : `Total: R$ ${formattedGeral}`}

`;
    });

    if (totalDesconto > 0) {
        copiedText += `
Totais Consolidados:
💰 SUB-TOTAL: R$ ${formatter.format(totalBruto)}
🎉 TOTAL DE DESCONTOS: R$ ${formatter.format(totalDesconto)}
💲 TOTAL: R$ ${formatter.format(totalGeral)}

`;
    } else {
        copiedText += `
Totais Consolidados:
💰 SUB-TOTAL: R$ ${formatter.format(totalBruto)}
💲 TOTAL: R$ ${formatter.format(totalGeral)}

`;
    }
    copiedText += conclusionMessage;

    totalsContainer.innerHTML = `
        <div>💰 Total Bruto: <span>R$ ${formatter.format(totalBruto)}</span></div>
        <div>🎉 Total Desconto: <span>R$ ${formatter.format(totalDesconto)}</span></div>
        <div>💲 Total Geral: <span>R$ ${formatter.format(totalGeral)}</span></div>
    `;

    document.getElementById('copyButton').onclick = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copiedText).then(() => {
                alert('Orçamentos copiados com sucesso!');
            }).catch(err => {
                console.error('Erro ao copiar para a área de transferência:', err);
                alert('Não foi possível copiar os orçamentos automaticamente. Tente copiar manualmente.');
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = copiedText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('Orçamentos copiados com sucesso!');
            } catch (err) {
                console.error('Erro ao copiar usando execCommand:', err);
                alert('Não foi possível copiar os orçamentos automaticamente. Tente copiar manualmente.');
            }
            document.body.removeChild(textarea);
        }
    };
}

document.getElementById('calculator').addEventListener('click', function (event) {
const calculator = document.getElementById('calculator');
if (!calculator.classList.contains('expanded')) {
    calculator.classList.add('expanded');
}
event.stopPropagation();
});

// Fechar a calculadora ao clicar no botão "X"
document.getElementById('closeCalculator').addEventListener('click', function (event) {
document.getElementById('calculator').classList.remove('expanded');
event.stopPropagation();
});




// Cálculo de preço ajustado conforme a duração do tratamento
document.getElementById('calculatePrice').addEventListener('click', () => {
const tempoTratamentoAtual = parseInt(document.getElementById('currentTreatment').value);
const simularPara = parseInt(document.getElementById('simulateFor').value);
const totalGeral = parseFloat(document.querySelectorAll('#totals span')[2].innerText.replace('R$', '').replace('.', '').replace(',', '.'));

let multiplicador;
let multiplicadorMes;

if (tempoTratamentoAtual === 30) {
    switch (simularPara) {
        case 30: multiplicador = 1; multiplicadorMes = 1; break;
        case 60: multiplicador = 1.74; multiplicadorMes = 2; break;
        case 90: multiplicador = 2.47; multiplicadorMes = 3; break;
        case 120: multiplicador = 3.1; multiplicadorMes = 4; break;
    }
} else if (tempoTratamentoAtual === 60) {
    switch (simularPara) {
        case 30: multiplicador = 0.57; multiplicadorMes = 1; break;
        case 60: multiplicador = 1; multiplicadorMes = 2; break;
        case 90: multiplicador = 1.42; multiplicadorMes = 3; break;
        case 120: multiplicador = 1.85; multiplicadorMes = 4; break;
    }
}

// Cálculo do novo valor ajustado
const precoCalculado = totalGeral * multiplicador / multiplicadorMes;
const valorTotal = precoCalculado * multiplicadorMes;
const descontoAplicado = (totalGeral * multiplicadorMes) - valorTotal;

// Atualizar a exibição na calculadora
document.getElementById('calculationResult').innerHTML = `
    <p><strong>💰 Valor Total:</strong> R$ ${formatter.format(valorTotal.toFixed(2))}</p>
    <p><strong>📆 Valor por Mês:</strong> R$ ${formatter.format(precoCalculado.toFixed(2))}</p>
    <p><strong>🎉 Desconto Aplicado:</strong> R$ ${formatter.format(descontoAplicado.toFixed(2))}</p>
`;
});


// Lógica para expandir e colapsar a calculadora
const toggleCalculator = document.getElementById('toggleCalculator');
const calculatorContent = document.getElementById('calculatorContent');
const calculator = document.getElementById('calculator');

toggleCalculator.addEventListener('click', () => {
    calculator.classList.toggle('expanded');
    calculatorContent.classList.toggle('active');
});

document.getElementById('applyCalculation').addEventListener('click', () => {
const tempoTratamentoAtual = parseInt(document.getElementById('currentTreatment').value);
const simularPara = parseInt(document.getElementById('simulateFor').value);
const totalGeral = parseFloat(document.querySelectorAll('#totals span')[2].innerText.replace('R$', '').replace('.', '').replace(',', '.'));

let multiplicador;
let multiplicadorMes;

if (tempoTratamentoAtual === 30) {
switch (simularPara) {
    case 30:
        multiplicador = 1;
        multiplicadorMes = 1;
        break;
    case 60:
        multiplicador = 1.74;
        multiplicadorMes = 2;
        break;
    case 90:
        multiplicador = 2.47;
        multiplicadorMes = 3;
        break;
    case 120:
        multiplicador = 3.1;
        multiplicadorMes = 4;
        break;
}
} else if (tempoTratamentoAtual === 60) {
switch (simularPara) {
    case 30:
        multiplicador = 0.57;
        multiplicadorMes = 1;
        break;
    case 60:
        multiplicador = 1;
        multiplicadorMes = 2;
        break;
    case 90:
        multiplicador = 1.42;
        multiplicadorMes = 3;
        break;
    case 120:
        multiplicador = 1.85;
        multiplicadorMes = 4;
        break;
}
}

const precoCalculado = totalGeral * multiplicador * multiplicadorMes;
const formattedPrice = formatter.format(precoCalculado.toFixed(2));

// Atualizar os orçamentos exibidos
document.querySelectorAll('.message').forEach(message => {
const tempoTratamentoTexto = `<strong>📅 Tratamento para:</strong> ${simularPara} dias<br>`;
const novoValor = `<strong>💲 Novo Valor:</strong> R$ ${formattedPrice}`;

// Removendo os valores antigos
message.innerHTML = message.innerHTML.replace(/<strong>Bruto:<\/strong>.*?<br>/, '');
message.innerHTML = message.innerHTML.replace(/<strong>Desconto:<\/strong>.*?<br>/, '');
message.innerHTML = message.innerHTML.replace(/<strong>Geral:<\/strong>.*?<br>/, '');

// Adicionando a nova informação com tratamento ajustado
message.innerHTML += `<br>${tempoTratamentoTexto}${novoValor}`;
});

alert(`Orçamentos atualizados para tratamento de ${simularPara} dias com valor R$ ${formattedPrice}!`);
});