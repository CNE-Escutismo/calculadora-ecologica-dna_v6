let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

/* Checkpoints da barra de progresso */
function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    // Esconder resultados se estiverem visíveis
    document.getElementById('results').style.display = 'none';
    document.getElementById('chart-container').style.display = 'none';
    document.getElementById('eco-tip').style.display = 'none';
    document.getElementById('slides').style.display = 'block';
}

function startQuiz() {
    document.getElementById('home').style.display = 'none';
    showSlide(0);
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });

    });
    slides[index].style.display = 'block';
    setTimeout(() => {
        slides[index].classList.add('active');
    }, 10);
    updateProgressBar(index);
    revealCheckpoints(index);
}

function revealCheckpoints(currentIndex) {
    const checkpoints = [0, 4, 9, 13, 17, 21];
    checkpoints.forEach(i => {
        const cp = document.getElementById(`cp-${i}`);
        if (cp && currentIndex >= i) {
            cp.classList.add('visible');
        }
    });
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    } else {
        document.getElementById('home').style.display = 'block';
        slides[currentSlide].style.display = 'none';
    }
}

function updateProgressBar(index) {
    const progress = ((index + 1) / slides.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Função para classificar com base nas refeições vegetarianas
function classificarRefeicoesVegetarianas(vegetarianas, total) {
    if (total === 0) return 4; // Se não fez refeições, assume-se pegada alta.

    const proporcao = vegetarianas / total;

    if (proporcao === 0) return 4; // Nenhuma refeição vegetariana
    if (proporcao <= 0.2) return 3; // Até 20% vegetariana
    if (proporcao <= 0.5) return 2; // Até 50% vegetariana
    return 1; // Mais de 50% vegetariana
}


function calcularImpactoDeslocacao() {
    const pessoas = parseFloat(document.getElementById('q1').value) || 0;
    const distancia = parseFloat(document.getElementById('q2').value) || 0;
    const veiculos = parseInt(document.getElementById('q4').value) || 0;
    const tipo = parseInt(document.getElementById('q3').value) || 0;

    const fatores = {
        0: 0.00, // Bicicleta/A pé
        1: 0.03, // Comboio
        2: 0.05, // Autocarro
        3: 0.21  // Veículo particular
    };

    if (pessoas === 0 || veiculos === 0) return 0;

    const impacto = (distancia / (pessoas * veiculos)) * (fatores[tipo] || 0);

    // Normalizar para escala de 0 a 4
    if (impacto <= 0.05) return 0;
    if (impacto <= 0.10) return 1;
    if (impacto <= 0.20) return 2;
    if (impacto <= 0.30) return 3;
    return 4;
}

function showResults() {
    // Obter as respostas para as refeições vegetarianas e o total de refeições
    const vegetarianas = parseInt(document.getElementById('q11_vegetarianas').value) || 0;
    const totalRefeicoes = parseInt(document.getElementById('q11_total').value) || 0;

    // Classificar com base nas refeições vegetarianas
    const scoreRefeicoes = classificarRefeicoesVegetarianas(vegetarianas, totalRefeicoes);

    let q1 = parseFloat(document.getElementById('q1').value) || 1; // número de participantes
    let q2 = parseFloat(document.getElementById('q2').value) || 0;
    let q4Original = parseFloat(document.getElementById('q4').value) || 0;

    let tipoTransporte = parseInt(document.getElementById('q3').value) || 0;
    // Declarar variáveis por categoria
    let impactoDeslocacao = calcularImpactoDeslocacao();
    let q4 = Math.min(Math.max(parseInt(q4Original), 0), 3);
    let deslocacoes = impactoDeslocacao;

    let tipologia = 0;
    tipologia += parseInt(document.getElementById('q5').value) || 0;
    tipologia += parseInt(document.getElementById('q6').value) || 0;
    tipologia += parseInt(document.getElementById('q7').value) || 0;
    tipologia += parseInt(document.getElementById('q8').value) || 0;

    let alimentacao = scoreRefeicoes;
    alimentacao += parseInt(document.getElementById('q9').value) || 0;
    alimentacao += parseInt(document.getElementById('q10').value) || 0;

    let agua = 0;
    agua += parseInt(document.getElementById('q12').value) || 0;
    agua += parseInt(document.getElementById('q13').value) || 0;
    agua += parseInt(document.getElementById('q14').value) || 0;

    let energia = 0;
    energia += parseInt(document.getElementById('q15').value) || 0;
    energia += parseInt(document.getElementById('q16').value) || 0;
    energia += parseInt(document.getElementById('q17').value) || 0;

    let residuos = 0;
    residuos += parseInt(document.getElementById('q18').value) || 0;
    residuos += parseInt(document.getElementById('q19').value) || 0;
    residuos += parseInt(document.getElementById('q20').value) || 0;

    // Calcular total
    let total = deslocacoes + tipologia + alimentacao + agua + energia + residuos;

    let message = "";
    if (total < 26) {
        message = "Baixa";
    } else if (total < 38) {
        message = "Moderada";
    } else {
        message = "Alta";
    }

    document.getElementById('slides').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('result').innerHTML = `O valor é de <strong>${total}</strong>, logo, a tua Ponderação é <strong>${message}</strong>`;
    document.getElementById('resultCO').innerHTML += `🚗 Emissões de deslocação: <strong>${impactoDeslocacao} kg CO₂</strong>`;

    // Gerar gráfico circular
    const ctx = document.getElementById('footprintChart').getContext('2d');
    window.footprintChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Deslocações', 'Tipologia de Atividade', 'Alimentação', 'Água', 'Energia', 'Resíduos'],
            datasets: [{
                data: [deslocacoes, tipologia, alimentacao, agua, energia, residuos],
                backgroundColor: ['#FFA500', '#868686', '#2E8B57', '#4682B4', '#FFD700', '#800080'],
                hoverOffset: 10
            }]
        }
    });

    // Determinar as 3 áreas com maior pontuação
    const categorias = ['Deslocações', 'Tipologia de Atividade', 'Alimentação', 'Água', 'Energia', 'Resíduos'];
    const valores = [deslocacoes, tipologia, alimentacao, agua, energia, residuos];
    
    // Obter os 3 maiores valores com seus índices
    const top3 = valores
        .map((valor, index) => ({ valor, index }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 3);

    // Mensagens personalizadas por categoria
    const dicas = {
        'Deslocações': "🚶‍♀️ Considera reduzir o uso de transporte individual. Partilhar boleias ou usar transportes públicos pode fazer uma grande diferença!",
        'Tipologia de Atividade': "📦 Pensa em formas de tornar as tuas atividades mais sustentáveis, como reutilizar materiais ou evitar merchandising desnecessário.",
        'Alimentação': "🥦 Opta por alimentos locais, biológicos e com menos embalagens. Pequenas escolhas fazem grande impacte!",
        'Água': "💧 Reutilizar água e usar métodos de lavagem mais eficientes ajuda a conservar este recurso precioso.",
        'Energia': "🔋 Explora formas de usar energias renováveis e reduzir o consumo energético nas tuas atividades.",
        'Resíduos': "♻️ Reduz, reutiliza e recicla sempre que possível. Uma boa separação de resíduos é essencial!",
        'Alimentação': "🌱 Comprar alimentos de produtores locais ou orgânicos reduz a pegada de carbono associada ao transporte e ao uso de pesticidas e fertilizantes químicos. Apoia a agricultura sustentável!",
        'Alimentação': "🍎 Evitar alimentos altamente processados e optar por opções frescas e naturais também ajuda a diminuir o impacte ambiental. Explora alternativas vegetais sempre que possível, pois a produção animal tem um maior impacte ambiental.",
        'Água': "🚰 Ao lavar alimentos, utiliza a água de maneira eficiente: usa recipientes para capturar a água usada e reaproveita para outras atividades, como regar plantas.",
        'Energia': "🌞 A utilização de fontes renováveis de energia, como solar ou eólica, pode diminuir significativamente o impacte das atividades. Se possível, usa essas fontes para alimentar equipamentos e iluminação.",
        'Resíduos': "🚮 Uma boa prática de separação de resíduos é crucial. Separa os resíduos recicláveis, como plásticos, vidros e papéis, e reencaminha-os corretamente. A compostagem de resíduos orgânicos também é uma excelente forma de reduzir a quantidade de lixo enviado para aterros.",
        'Resíduos': "🛍️ Evita o uso de sacos plásticos descartáveis. Usa sacos de pano, papel ou material reciclado para transportar alimentos e materiais. Sempre que possível, reutiliza embalagens e recipientes."
    };

    // Exibir as 3 dicas com maior impacto
    let dicasTop3 = top3.map(item => `${categorias[item.index]}: ${dicas[categorias[item.index]]}`).join("<br>");
    document.getElementById('eco-tip').innerHTML = `${dicasTop3}`;

    // Exibir o conteúdo da dica
    document.getElementById('eco-tip').style.display = 'block'; // Assegurar que a dica seja visível
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

