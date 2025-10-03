document.addEventListener('DOMContentLoaded', function() {
    // ... (nenhuma mudança na seleção de elementos)
    const freteForm = document.getElementById('freteForm');
    const resultadoDiv = document.getElementById('resultado');

    // ** ÁREA DE CONFIGURAÇÃO DOS CUSTOS **

    // Taxas Percentuais
    const TAXA_AD_VALOREM = 0.005; 
    const TAXA_GRIS = 0.003;

    // Custos para Carga FRACIONADA
    const FRETE_MINIMO_FRACIONADO = 50.00;
    const CUSTO_KM_FRACIONADO = 1.80;
    const CUSTO_KG_FRACIONADO = 0.45;

    // Custos para Carga INTEIRA (LOTAÇÃO)
    const TAXA_FIXA_INTEIRA = 150.00;
    const CUSTO_KM_INTEIRA = 4.50;

    // ** NOVA LÓGICA DE PREÇO REGRESSIVO PARA TAXA POR NOTA **
    function calcularCustoTotalPorNotas(totalNotas) {
        let taxaAplicada;
        if (totalNotas <= 10) {
            // Faixa 1: Até 10 notas, custo normal
            taxaAplicada = 4.50;
        } else if (totalNotas <= 50) {
            // Faixa 2: De 11 a 50 notas, um pequeno desconto
            taxaAplicada = 3.50;
        } else {
            // Faixa 3: Acima de 50 notas, um desconto maior
            taxaAplicada = 2.50;
        }
        // Retorna o custo total: quantidade de notas x a taxa da faixa correspondente
        return totalNotas * taxaAplicada;
    }

    freteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // ... (nenhuma mudança na captura de valores)
        const tipoFrete = document.getElementById('tipoFrete').value;
        const totalNotas = parseInt(document.getElementById('totalNotas').value);
        const valorNota = parseFloat(document.getElementById('valorNota').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const km = parseFloat(document.getElementById('km').value);

        // ... (nenhuma mudança na validação)
        if (isNaN(totalNotas) || isNaN(valorNota) || isNaN(peso) || isNaN(km) || totalNotas <= 0 || valorNota <= 0 || peso <= 0 || km <= 0) {
            resultadoDiv.innerHTML = `<p class="error">Por favor, insira valores válidos e positivos em todos os campos.</p>`;
            return;
        }

        let freteBase = 0;
        // ... (nenhuma mudança no cálculo do frete base)
        if (tipoFrete === 'fracionado') {
            let calculo = (km * CUSTO_KM_FRACIONADO) + (peso * CUSTO_KG_FRACIONADO);
            freteBase = Math.max(calculo, FRETE_MINIMO_FRACIONADO);
        } else {
            freteBase = TAXA_FIXA_INTEIRA + (km * CUSTO_KM_INTEIRA);
        }

        // Cálculo das taxas Ad Valorem e GRIS
        const valorAdValorem = valorNota * TAXA_AD_VALOREM;
        const valorGris = valorNota * TAXA_GRIS;
        
        // ** CÁLCULO ATUALIZADO USANDO A FUNÇÃO DE PREÇO REGRESSIVO **
        const valorTaxaPorNotas = calcularCustoTotalPorNotas(totalNotas);
        
        // Cálculo do valor total do frete
        const valorTotal = freteBase + valorAdValorem + valorGris + valorTaxaPorNotas;

        // Exibe o resultado detalhado
        exibirResultado({
            freteBase: freteBase,
            adValorem: valorAdValorem,
            gris: valorGris,
            taxaNotas: valorTaxaPorNotas,
            total: valorTotal
        });
    });

    // ... (nenhuma mudança nas funções exibirResultado e formatarMoeda)
    function exibirResultado(valores) {
        resultadoDiv.innerHTML = `
            <h3>Detalhamento do Frete</h3>
            <p>Frete Base: <strong>${formatarMoeda(valores.freteBase)}</strong></p>
            <p>Ad Valorem (Seguro): <strong>${formatarMoeda(valores.adValorem)}</strong></p>
            <p>GRIS (Gerenciamento de Risco): <strong>${formatarMoeda(valores.gris)}</strong></p>
            <p>Taxa por Notas Fiscais: <strong>${formatarMoeda(valores.taxaNotas)}</strong></p>
            <p class="total">Valor Total do Frete: <strong>${formatarMoeda(valores.total)}</strong></p>
        `;
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
});