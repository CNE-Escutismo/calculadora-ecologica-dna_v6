let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

/* ===== Navegação ===== */
function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);

  const results = document.getElementById('results');
  if (results) results.style.display = 'none';
  const slidesWrap = document.getElementById('slides');
  if (slidesWrap) slidesWrap.style.display = 'block';
}

function startQuiz() {
  const home = document.getElementById('home');
  if (home) home.style.display = 'none';
  showSlide(0);
}

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
    slide.style.display = 'none';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  slides[index].style.display = 'block';
  setTimeout(() => slides[index].classList.add('active'), 10);
  updateProgressBar(index);
  revealCheckpoints(index);
}

function revealCheckpoints(currentIndex) {
  const checkpoints = [0, 4, 9, 13, 17, 21];
  checkpoints.forEach(i => {
    const cp = document.getElementById(`cp-${i}`);
    if (cp && currentIndex >= i) cp.classList.add('visible');
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
    const home = document.getElementById('home');
    if (home) home.style.display = 'block';
    slides[currentSlide].style.display = 'none';
  }
}

function updateProgressBar(index) {
  const progress = ((index + 1) / slides.length) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${progress}%`;
}

/* ===== Pontuação ===== */
function classificarRefeicoesVegetarianas(vegetarianas, total) {
  if (total === 0) return 4;
  const p = vegetarianas / total;
  if (p === 0)   return 4;
  if (p <= 0.2)  return 3;
  if (p <= 0.5)  return 2;
  return 1;
}

// Índice (0–4) para uso no score
function calcularImpactoDeslocacaoIndice() {
  const pessoas   = parseFloat(document.getElementById('q1')?.value) || 0;
  const distancia = parseFloat(document.getElementById('q2')?.value) || 0;
  const veiculos  = parseInt(document.getElementById('q4')?.value) || 0;
  const tipo      = parseInt(document.getElementById('q3')?.value) || 0;

  const fatores = { 0: 0.00, 1: 0.03, 2: 0.05, 3: 0.21 };
  if (pessoas === 0 || veiculos === 0) return 0;

  const impacto = (distancia / (pessoas * veiculos)) * (fatores[tipo] || 0);

  if (impacto <= 0.05) return 0;
  if (impacto <= 0.10) return 1;
  if (impacto <= 0.20) return 2;
  if (impacto <= 0.30) return 3;
  return 4;
}

// kg CO2 para mostrar (aproximação simples)
function calcularCO2DeslocacaoKg() {
  const pessoas   = parseFloat(document.getElementById('q1')?.value) || 0;
  const distancia = parseFloat(document.getElementById('q2')?.value) || 0;
  let veiculos    = parseInt(document.getElementById('q4')?.value) || 0;
  const tipo      = parseInt(document.getElementById('q3')?.value) || 0;

  const F_TREM_PPKM = 0.03;
  const F_BUS_PPKM  = 0.05;
  const F_CARRO_VKM = 0.21;

  if (tipo === 0) return 0; // a pé/bicicleta
  if (tipo === 1) return distancia * pessoas * F_TREM_PPKM;
  if (tipo === 2) return distancia * pessoas * F_BUS_PPKM;
  if (tipo === 3) {
    if (veiculos <= 0) veiculos = 1;
    return distancia * veiculos * F_CARRO_VKM;
  }
  return 0;
}

/* ===== Resultados ===== */
function showResults() {
  const results = document.getElementById('results');
  const slidesWrap = document.getElementById('slides');
  if (!results) return;

  // Alimentação
  const vegetarianas   = parseInt(document.getElementById('q11_vegetarianas')?.value) || 0;
  const totalRefeicoes = parseInt(document.getElementById('q11_total')?.value) || 0;
  const scoreRefeicoes = classificarRefeicoesVegetarianas(vegetarianas, totalRefeicoes);

  // Deslocações (índice p/ score + kg p/ mostrar)
  const indiceDesloc = calcularImpactoDeslocacaoIndice();
  const kgDesloc     = calcularCO2DeslocacaoKg();
  const deslocacoes  = indiceDesloc;

  // Tipologia
  let tipologia = 0;
  tipologia += parseInt(document.getElementById('q5')?.value) || 0;
  tipologia += parseInt(document.getElementById('q6')?.value) || 0;
  tipologia += parseInt(document.getElementById('q7')?.value) || 0;
  tipologia += parseInt(document.getElementById('q8')?.value) || 0;

  // Alimentação (resto)
  let alimentacao = scoreRefeicoes;
  alimentacao += parseInt(document.getElementById('q9')?.value) || 0;
  alimentacao += parseInt(document.getElementById('q10')?.value) || 0;

  // Água
  let agua = 0;
  agua += parseInt(document.getElementById('q12')?.value) || 0;
  agua += parseInt(document.getElementById('q13')?.value) || 0;
  agua += parseInt(document.getElementById('q14')?.value) || 0;

  // Energia
  let energia = 0;
  energia += parseInt(document.getElementById('q15')?.value) || 0;
  energia += parseInt(document.getElementById('q16')?.value) || 0;
  energia += parseInt(document.getElementById('q17')?.value) || 0;

  // Resíduos
  let residuos = 0;
  residuos += parseInt(document.getElementById('q18')?.value) || 0;
  residuos += parseInt(document.getElementById('q19')?.value) || 0;
  residuos += parseInt(document.getElementById('q20')?.value) || 0;

  // Total e mensagem
  const total = deslocacoes + tipologia + alimentacao + agua + energia + residuos;

  let message = "";
  if (total < 26)      message = "Baixa";
  else if (total < 38) message = "Moderada";
  else                 message = "Alta";

  const statusClass = message === 'Baixa' ? 'status-low'
                    : message === 'Moderada' ? 'status-mid'
                    : 'status-high';

  // Troca de ecrã
  if (slidesWrap) slidesWrap.style.display = 'none';
  results.style.display = 'block';

  // Elementos *dentro* do results
  const resultEl   = results.querySelector('#result');
  const resultCOEl = results.querySelector('#resultCO');
  const chartWrap  = results.querySelector('#chart-container');
  const canvas     = results.querySelector('#footprintChart');
  const tipEl      = results.querySelector('#eco-tip');

  if (resultEl) {
    resultEl.innerHTML =
      `O valor é de <span class="result-highlight">${total}</span>, ` +
      `logo a tua ponderação é <span class="status ${statusClass}">${message}</span>.`;
  }

  if (resultCOEl) {
    const kgFmt = kgDesloc.toFixed(1).replace('.', ',');
    resultCOEl.innerHTML = `🚗 Emissões de deslocação: <strong>${kgFmt} kg CO₂</strong>`;
  }

  /* ===== Gráfico de Barras (Horizontal) ===== */
  if (chartWrap) chartWrap.style.display = 'block';

  if (canvas) {
    if (window.footprintChart) {
      try { window.footprintChart.destroy(); } catch (e) {}
      window.footprintChart = null;
    }

    const labels = ['Deslocações', 'Tipologia de Atividade', 'Alimentação', 'Água', 'Energia', 'Resíduos'];
    const values = [deslocacoes, tipologia, alimentacao, agua, energia, residuos];
    const colors = ['#FFA500', '#868686', '#2E8B57', '#4682B4', '#FFD700', '#800080'];

    const rowHeight = 44;
    canvas.height = labels.length * rowHeight;

    requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      window.footprintChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Pontuação',
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
            borderRadius: 8,
            barThickness: 28
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              ticks: { stepSize: 2 },
              grid: { color: 'rgba(0,0,0,0.06)' }
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 12 }
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw}`
              }
            }
          },
          animation: {
            duration: 350
          }
        }
      });
    });
  }

  /* ===== Dicas — 1 aleatória por categoria ===== */
  const categorias = ['Deslocações', 'Tipologia de Atividade', 'Alimentação', 'Água', 'Energia', 'Resíduos'];

const dicas = {
  'Deslocações': [
    "🚶‍♀️ Considera reduzir o uso de transporte individual. Partilhar boleias ou usar transportes públicos pode fazer uma grande diferença!",
    "🚲 Se possível, opta por deslocações a pé ou de bicicleta. São opções mais saudáveis e com menor impacte ambiental.",
    "🚗 Sempre que possível, planeia as deslocações para reduzir o tempo de viagem e as emissões de CO₂.",
    "🛑 Não te esqueças de promover o uso de transportes públicos e outras alternativas, sempre que possível. Reduz o impacte ambiental com escolhas mais conscientes.",
    "🚌 Se estiveres a participar numa atividade nacional ou regional, e fores sozinho, pergunta à organização se há boleias ou qual a melhor forma de chegar através de transportes públicos.",
    "📅 Se possível, organiza o programa da atividade com base nos horários dos transportes públicos, para facilitar uma mobilidade mais sustentável."
  ],

  'Tipologia de Atividade': [
    "📦 Pensa em formas de tornar as tuas atividades mais sustentáveis, reduzindo a compra de materiais (podes sempre procurar algo para reutilizar) e evita *merchandising*!",
    "🛠️ Sempre que possível, usa equipamentos e materiais reutilizáveis, para reduzir a produção de resíduos.",
    "📝 O planeamento da atividade é o momento certo para pensar na sustentabilidade da mesma: as deslocações, alimentação, materiais, o orçamento e as atividades que vão fazer, tudo pode ser ajustado para reduzirem o vosso impacte.",
    "💡 Planeia atividades que não envolvam grandes impactes ambientais. O uso de espaços naturais deve ser sempre feito com respeito ao ecossistema, minimizando danos. Segue os seus **princípios** e protege a natureza! Conheces o projeto **Leave no Trace**? <a href='https://ambiente.escutismo.pt/leave-no-trace/' target='_blank'>Sabe mais aqui</a>.",
    "🔄 Se for necessário usar materiais, tenta sempre optar por opções recicláveis e de baixo impacte. O desafio **Escolher Melhor** da **Earth Tribe** promove hábitos sustentáveis! <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/campeoes-da-natureza/' target='_blank'>Sabe mais aqui</a>",
    "🎒 Diz não aos descartáveis! Relembra a tua secção para levar caneca e chávena reutilizável."
  ],

  'Alimentação': [
    "🥦 Opta por alimentos locais ou nacionais. Basta olhares para a etiqueta do produto e ver se é produzido em Portugal. Pequenas escolhas fazem grande impacte!",
    "🌱 Comprar alimentos aos produtores locais ou de produção orgânica reduz a pegada de carbono associada ao transporte, ao uso de pesticidas e fertilizantes químicos.",
    "🍎 No planeamento da ementa da atividade, aceita o desafio de reduzir o consumo de carne e ter uma dieta variada e equilibrada.",
    "🍽️ Reduz o desperdício de alimentos. Planeia bem as refeições e usa as sobras de maneira criativa para evitar desperdícios. Podes usar o guia alimentar para escuteiros para te ajudar nesta tarefa.",
    "🍳 Opta por métodos de preparação de alimentos com baixo consumo de energia, como por exemplo fornos solares, e assim aproveitar para fazer o projeto **Scouts Go Solar**. <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/scouts-go-solar/' target='_blank'>Sabe mais aqui</a>",
    "🍴 Considera realizar atividades pedagógicas sobre alimentação sustentável. O projeto **Escutismo.come** incentiva boas escolhas alimentares com base em produtos locais. <a href='https://ambiente.escutismo.pt/projetos/escutismo-come/' target='_blank'>Sabe mais aqui</a>",
    "🏷️ Escolhe produtos alimentares com certificações ambientais (ex: no chocolate, procura os que têm o símbolo da Rainforest Alliance).",
    "🗓️ Tenta adaptar a ementa aos produtos sazonais e da época. Apesar de termos grande oferta nas grandes superfícies, podemos optar pela fruta e legumes da época, assegurando melhor qualidade.",
    "✅ Verifica na sede se existem alimentos que sobraram de outras atividades e dá preferência aos mesmos, caso se encontrem dentro do prazo de validade, ajudando a reduzir o desperdício alimentar.",
    "⚖️ Se possível, compra a granel! Desta forma, consegues comprar a quantidade que precisas, evitando o desperdício."
  ],

  'Água': [
    "🚰 Ao lavar alimentos, utiliza a água de maneira eficiente: usa recipientes para capturar a água usada e reaproveita para outras tarefas, como regar plantas (isto se a água não estiver contaminada).",
    "💦 Sempre que possível, utiliza sistemas de recolha de água da chuva. É uma ótima forma de aproveitar a água para lavagens simples, para regar as plantas e outras necessidades, sem sobrecarregar o consumo convencional.",
    "🌊 Para atividades perto de corpos d'água, evita usar sabões ou detergentes prejudiciais ao meio ambiente. Opta por opções biodegradáveis e sem químicos agressivos.",
    "💧 Garante que todos os elementos levam um cantil, para evitarem a compra de garrafas descartáveis.",
    "⏱️ Definam um tempo máximo para os banhos (por exemplo, 5 minutos).",
    "🚰 Considera a utilização de um jarro de filtragem de água para reduzir o uso de garrafas plásticas e promover o consumo consciente de água.",
    "🗺️ Faz um projeto **Maré de Mudança** para aprender sobre a conservação da água e ajudar na preservação dos ecossistemas aquáticos. <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/mare-de-mudanca/' target='_blank'>Sabe mais aqui</a>",
    "🚫 Ao realizar a higiene pessoal, fecha a torneira sempre que te ensaboas, escovas os dentes, etc.",
    "🔍 Verifica sempre se as torneiras ficam bem fechadas e sem pingar.",
    "🧼 Lava a loiça em bacias e usa apenas a água disponível nessas bacias."
  ],

  'Energia': [
    "🔋 Explora formas de usar energias renováveis e reduzir o consumo energético nas tuas atividades. Conhece o projeto <a href='https://ambiente.escutismo.pt/projetos/hora-do-planeta/' target='_blank'>Hora do Planeta</a>.",
    "💡 Sempre que possível, desliga os aparelhos eletrónicos quando não estiverem em uso. A economia de energia é uma forma simples de reduzir o impacte ambiental.",
    "🌞 Se possível, opta por alternativas como cozinhar com energia solar, como o desafio **Scouts Go Solar** promove. <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/scouts-go-solar/' target='_blank'>Sabe mais aqui</a>",
    "⚡ Para reduzir o impacte, considera usar lanternas a energia solar durante atividades ao ar livre, promovendo o uso de energias limpas e renováveis.",
    "🍲 Sempre que possível, tapa o tacho ao cozinhar, de forma a não desperdiçar o calor e, consequentemente, o gás utilizado.",
    "🔥 Na fogueira, opta por acendalhas naturais como folhas secas, pequenos galhos ou pinhas.",
    "🔦 Opta por soluções alternativas às lanternas tradicionais, como lanternas à manivela, com pilhas recarregáveis ou que tenham incorporado um painel solar."
  ],

  'Resíduos': [
    "♻️ Reduz, reutiliza e recicla sempre que possível. Uma boa separação de resíduos é essencial! Consulta o nosso guia <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/campeoes-da-natureza/' target='_blank'>Aprende a Reciclar</a>.",
    "🚮 Uma boa prática de separação de resíduos é crucial. Separa os resíduos recicláveis, como plásticos, vidros e papéis, e reencaminha-os corretamente. A compostagem de resíduos orgânicos também é uma excelente forma de reduzir a quantidade de lixo enviado para aterros.",
    "🛍️ Evita o uso de sacos plásticos descartáveis. Usa sacos de pano, papel ou material reciclado para transportar alimentos e materiais. Sempre que possível, reutiliza embalagens e recipientes.",
    "🌍 Participa em atividades de limpeza costeira ou fluvial, como o **Mês do Mar**, para ajudar a preservar o oceano. Menos lixo significa mais vida marinha. <a href='https://ambiente.escutismo.pt/projetos/mes-do-mar/' target='_blank'>Sabe mais aqui</a>.",
    "🌿 Opta por materiais naturais e recicláveis em vez de plásticos descartáveis. A escolha de produtos com menos embalagens ajuda a reduzir a pegada ambiental e a promover um consumo consciente. Sabias que podes fazer um projeto Earth Tribe sobre esta temática? <a href='https://ambiente.escutismo.pt/projetos/earth-tribe/campeoes-da-natureza/' target='_blank'>Sabe mais aqui</a>.",
    "📦 Explora o conceito de economia circular: troca, reutiliza e recicla o que for possível. Participa no projeto **Green Cork**, onde a recolha de rolhas de cortiça contribui para o plantio de árvores. <a href='https://ambiente.escutismo.pt/projetos/green-cork/' target='_blank'>Sabe mais aqui</a>.",
    "🛢️ Não te esqueças de separar os óleos alimentares usados, e colocar num oleão no final da atividade. Desta forma, evitas a contaminação dos solos e das águas."
  ]
};


  if (tipEl) {
    const todasAsDicas = categorias.map(cat => {
      const arr = dicas[cat];
      return arr[Math.floor(Math.random() * arr.length)];
    });

    tipEl.innerHTML = todasAsDicas.join("<hr>");
    tipEl.style.display = 'block';
  }
}
