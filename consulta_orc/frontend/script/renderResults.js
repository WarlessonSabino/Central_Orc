function renderResults(data) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    // Agrupar orçamentos únicos
    const groupedData = data.reduce((acc, item) => {
        const numero = item['N° Orçamento'];
        const status = item['Status']; // Obtendo o status

        if (!acc[numero]) {
            acc[numero] = { status, detalhes: [] };
        }
        acc[numero].detalhes.push(item);
        return acc;
    }, {});

    // Renderizar números únicos com status
    Object.keys(groupedData).forEach(numero => {
        const { status, detalhes } = groupedData[numero];

        const option = document.createElement('div');
        option.innerHTML = `
            <label>
                <input type="checkbox" class="orcamento-checkbox" 
                    data-numero="${numero}" 
                    data-status="${status}"
                    data-detalhes='${JSON.stringify(detalhes)}'>
                ${numero}  ${status} 
            </label>
        `;
        optionsContainer.appendChild(option);
    });

    // Selecionar todos ou desmarcar todos
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.checked = false; // Resetar estado
    selectAllCheckbox.addEventListener('change', () => {
        const isChecked = selectAllCheckbox.checked;
        document.querySelectorAll('.orcamento-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
            checkbox.dispatchEvent(new Event('change')); // Atualizar seleção
        });
    });

    // Atualizar os resultados ao clicar em um checkbox
    document.querySelectorAll('.orcamento-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelected);
    });
}