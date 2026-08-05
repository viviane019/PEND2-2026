// ============================================================
// DIOR DASHBOARD · Lógica e Manipulação de Estado em Memória
// ============================================================

// ---------- Massa de Dados (Dataset Inicial) ----------
const sensoresIniciais = [
  { id: 1, nome: "Sensor Galpão A", tipo: "Temperatura", valor: 24.5, unidade: "°C", status: "normal" },
  { id: 2, nome: "Sensor Estufa 02", tipo: "Umidade", valor: 88.0, unidade: "%", status: "critico" },
  { id: 3, nome: "Sensor Compressor", tipo: "Pressão", valor: 6.2, unidade: "bar", status: "normal" },
  { id: 4, nome: "Sensor Câmara Fria", tipo: "Temperatura", valor: -2.1, unidade: "°C", status: "normal" },
  { id: 5, nome: "Sensor Almoxarifado", tipo: "Umidade", valor: 45.5, unidade: "%", status: "normal" },
  { id: 6, nome: "Sensor Caldeira", tipo: "Temperatura", valor: 98.4, unidade: "°C", status: "critico" }
];

// ---------- Referências ao DOM ----------
const gridSensores = document.getElementById('gridSensores');
const filtroTipo = document.getElementById('filtroTipo');
const btnAtualizar = document.getElementById('btnAtualizar');
const ultimaAtualizacao = document.getElementById('timestamp');
const anoAtual = document.getElementById('ano');
const statusDot = document.getElementById('pontoStatus');
const statusText = document.getElementById('textoStatus');

// ---------- Ícones por tipo de sensor ----------
const iconPorTipo = {
  'Temperatura': '🌡️',
  'Umidade': '💧',
  'Pressão': '⚙️'
};

// ---------- Regra de Negócio Visual: leitura crítica ----------
function definirStatusAtualizado(sensor) {
  // Recalcula o status com base no valor (regra do enunciado:
  // temperatura > 35°C é crítico, além dos críticos já definidos)
  if (sensor.tipo === 'Temperatura' && sensor.valor > 35) {
    sensor.status = 'critico';
  }
  return sensor;
}

// ---------- Renderização Dinâmica do DOM ----------
function renderizarDashboard(listaSensores) {
  // Limpa o container principal
  gridSensores.innerHTML = '';

if (listaSensores.length === 0) {
    gridSensores.innerHTML = '<p style="color:#6b6b6b">Nenhum sensor encontrado.</p>';
    return;
  }

  // Percorre o array gerando a estrutura HTML de cada card
  listaSensores.forEach(sensor => {
    const card = document.createElement('article');
    card.classList.add('card');

    // Regra de negócio visual: status crítico adiciona a classe .card-alerta
    if (sensor.status === 'critico') {
      card.classList.add('card-alerta');
    }

    card.innerHTML = `
      <div class="card-topo">
        <span>${iconPorTipo[sensor.tipo] || '📟'}</span>
        <span class="chip ${sensor.status === 'critico' ? 'critico' : 'normal'}">${sensor.status}</span>
      </div>
      <h3>${sensor.nome}</h3>
      <p class="meta">${sensor.tipo}</p>
      <p class="valor">${sensor.valor.toFixed(1)} ${sensor.unidade}</p>
    `;

    gridSensores.appendChild(card);
  });
}

// ---------- Filtros em Memória ----------
function aplicarFiltro() {
  const tipoSelecionado = filtroTipo.value;

  let listaFiltrada;
  if (tipoSelecionado === 'Todos') {
    listaFiltrada = sensoresIniciais;
  } else {
    // Usa .filter() para gerar nova lista apenas com o tipo selecionado
    listaFiltrada = sensoresIniciais.filter(sensor => sensor.tipo === tipoSelecionado);
  }

  renderizarDashboard(listaFiltrada);
}

// ---------- Atualização do Footer (Timestamp) ----------
function atualizarFooter() {
  const agora = new Date();
  const horas = agora.getHours().toString().padStart(2, '0');
  const minutos = agora.getMinutes().toString().padStart(2, '0');
  const segundos = agora.getSeconds().toString().padStart(2, '0');
  ultimaAtualizacao.textContent = `${horas}:${minutos}:${segundos}`;
}

// ---------- Simulação de Atualização (Tempo Real) ----------
function atualizarSensores() {
  // Percorre o array e altera levemente os valores usando Math.random()
  sensoresIniciais.forEach(sensor => {
    // Variação de até ±10% do valor atual
    const variacao = (Math.random() - 0.5) * 2 * sensor.valor * 0.1;
    sensor.valor = Math.max(0, sensor.valor + variacao);
    // Recalcula o status de acordo com a regra de negócio
    definirStatusAtualizado(sensor);
  });

  // Re-renderiza mantendo o filtro ativo
  aplicarFiltro();
  // Atualiza o timestamp no rodapé
  atualizarFooter();
}

// ---------- Status da Conexão (simulado) ----------
function simularConexao() {
  // Simula alternância esporádica Online/Offline
  const online = Math.random() > 0.1;
  if (online) {
    statusText.textContent = 'Online';
    statusDot.classList.remove('offline');
  } else {
    statusText.textContent = 'Offline';
    statusDot.classList.add('offline');
  }
}

// ---------- Inicialização ----------
function iniciar() {
  anoAtual.textContent = new Date().getFullYear();

  // Evento de escuta no select (filtro)
  filtroTipo.addEventListener('change', aplicarFiltro);

  // Botão de atualizar dados
  btnAtualizar.addEventListener('click', atualizarSensores);

  // Atualização automática a cada 30 segundos
  setInterval(atualizarSensores, 30000);

  // Simulação de conexão a cada 15 segundos
  setInterval(simularConexao, 15000);

  // Renderização inicial
  simularConexao();
  atualizarFooter();
  renderizarDashboard(sensoresIniciais);
}

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', iniciar);
