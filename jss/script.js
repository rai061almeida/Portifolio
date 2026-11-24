// ===== Site do Rai =====
// Tudo aqui é JavaScript puro, sem bibliotecas.

const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ----- Foto de perfil -----
// Coloque o arquivo 1.jpeg na mesma pasta do index.html.
(function carregarFoto() {
  const img = document.getElementById('foto');
  const placeholder = document.getElementById('foto-ph');
  const teste = new Image();
  teste.onload = function () {
    img.src = teste.src;
    img.hidden = false;
    placeholder.hidden = true;
  };
  teste.src = '1.jpeg';
})();

// ----- Texto que se digita sozinho -----
(function digitar() {
  const alvo = document.getElementById('typed');
  const papeis = ['estudante de Engenharia de Software', 'encarregado de FLV', 'dev em formação'];
  if (reducedMotion) {
    alvo.textContent = papeis[0];
    return;
  }
  let papel = 0;
  let letras = 0;
  let apagando = false;
  let pausa = 0;

  setInterval(function () {
    if (pausa > 0) { pausa--; return; }
    const texto = papeis[papel];
    if (!apagando) {
      if (letras < texto.length) {
        letras++;
      } else {
        apagando = true;
        pausa = 22;
      }
    } else if (letras > 0) {
      letras--;
    } else {
      apagando = false;
      papel = (papel + 1) % papeis.length;
    }
    alvo.textContent = texto.slice(0, letras);
  }, 70);
})();

// ----- Abas do perfil -----
(function abas() {
  const conteudo = {
    faculdade: {
      titulo: 'Engenharia de Software na UDF',
      texto: 'Estou cursando Engenharia de Software. É aqui que eu aprendo a transformar problema em código.'
    },
    trabalho: {
      titulo: 'Encarregado de FLV',
      texto: 'No dia a dia eu cuido do setor de frutas, legumes e verduras. Prazo, estoque e gente: tudo isso também conta na hora de desenvolver software.'
    },
    codigo: {
      titulo: 'Onde eu quero chegar',
      texto: '[Conte aqui o que você já programa, o que está estudando e o que quer construir.]'
    }
  };
  const botoes = document.querySelectorAll('.tab');
  const titulo = document.getElementById('tab-title');
  const texto = document.getElementById('tab-text');

  function mostrar(id) {
    titulo.textContent = conteudo[id].titulo;
    texto.textContent = conteudo[id].texto;
    botoes.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.tab === id ? 'true' : 'false');
    });
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () { mostrar(b.dataset.tab); });
  });
  mostrar('faculdade');
})();

// ----- Terminal -----
(function terminal() {
  const saida = document.getElementById('term-out');
  const form = document.getElementById('term-form');
  const campo = document.getElementById('cmd');

  const respostas = {
    ajuda: ['comandos: sobre, estudos, trabalho, skills, projetos, musica, contato, flv, hack, limpar'],
    sobre: ['Rai, 25 anos. Moro em Samambaia Sul, no DF.', 'Estudo Engenharia de Software na UDF e trabalho como encarregado de FLV.'],
    estudos: ['Engenharia de Software · UDF · cursando'],
    trabalho: ['Encarregado de FLV: frutas, legumes e verduras.'],
    skills: ['[adicione aqui suas linguagens e ferramentas]'],
    projetos: ['[adicione aqui seus projetos]'],
    musica: ['Veja a seção "A trilha do código", logo abaixo.'],
    contato: ['e-mail: [seu@email.com]', 'github: [seu usuário]'],
    flv: ['estoque do hortifruti: ok', 'bugs conhecidos: 0 (até o próximo commit)'],
    hack: ['acessando o mainframe...', 'acesso negado. Aqui só tem hortifruti e código.'],
    sudo: ['boa tentativa. Aqui só o Rai tem permissão.']
  };

  function linha(texto, classe) {
    const div = document.createElement('div');
    div.textContent = texto;
    if (classe) div.className = classe;
    saida.appendChild(div);
    saida.scrollTop = saida.scrollHeight;
  }

  function abertura() {
    const linhas = [
      '[ ok ] iniciando sistema...',
      '[ ok ] perfil carregado: Rai, 25 anos',
      '[ ok ] acesso liberado. Toque em um comando ou digite ajuda.'
    ];
    linhas.forEach(function (t, i) {
      if (reducedMotion) { linha(t); return; }
      setTimeout(function () { linha(t); }, 400 * (i + 1));
    });
  }

  function executar(entrada) {
    const cmd = entrada.trim();
    if (!cmd) return;
    const chave = cmd.toLowerCase();

    if (chave === 'limpar' || chave === 'clear') {
      saida.textContent = '';
      abertura();
      return;
    }

    linha('$ ' + cmd, 'cmd');
    if (Object.prototype.hasOwnProperty.call(respostas, chave)) {
      respostas[chave].forEach(function (t) { linha(t); });
    } else {
      linha('comando não encontrado: ' + cmd, 'err');
      linha('digite ajuda para ver os comandos.', 'err');
    }
  }

  document.querySelectorAll('.chip').forEach(function (b) {
    b.addEventListener('click', function () { executar(b.dataset.cmd); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    executar(campo.value);
    campo.value = '';
  });

  abertura();
})();

// ----- Chuva de código (Matrix) -----
const chuva = (function () {
  const canvas = document.getElementById('rain');
  const ctx = canvas.getContext('2d');
  const caracteres = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789$#<>/;'.split('');
  const tamanho = 16;
  let largura = 0;
  let altura = 0;
  let gotas = [];
  let ligada = false;
  let ultimo = 0;

  function ajustar() {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;
    const colunas = Math.floor(largura / tamanho);
    gotas = [];
    for (let i = 0; i < colunas; i++) {
      gotas.push(Math.floor(Math.random() * -60));
    }
  }

  function desenhar(agora) {
    if (!ligada) return;
    requestAnimationFrame(desenhar);
    if (agora - ultimo < 55) return;
    ultimo = agora;

    // O fundo semi-transparente deixa o rastro desaparecendo aos poucos.
    ctx.fillStyle = 'rgba(2, 10, 4, 0.12)';
    ctx.fillRect(0, 0, largura, altura);
    ctx.font = tamanho + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < gotas.length; i++) {
      const letra = caracteres[Math.floor(Math.random() * caracteres.length)];
      const x = i * tamanho;
      const y = gotas[i] * tamanho;
      ctx.fillStyle = '#00ff66';
      ctx.fillText(letra, x, y);
      if (y > altura && Math.random() > 0.975) gotas[i] = 0;
      gotas[i]++;
    }
  }

  function ligar() {
    if (ligada) return;
    ligada = true;
    ajustar();
    requestAnimationFrame(desenhar);
  }

  function desligar() {
    ligada = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', function () { if (ligada) ajustar(); });

  return { ligar: ligar, desligar: desligar, estaLigada: function () { return ligada; } };
})();

// ----- Botões do topo -----
(function botoes() {
  const btnCrt = document.getElementById('btn-crt');
  const btnChuva = document.getElementById('btn-rain');

  function marcarCrt(ligado) {
    document.body.classList.toggle('crt-off', !ligado);
    btnCrt.setAttribute('aria-pressed', String(ligado));
    btnCrt.textContent = ligado ? 'CRT: ligado' : 'CRT: desligado';
  }

  function marcarChuva(ligada) {
    if (ligada) chuva.ligar(); else chuva.desligar();
    btnChuva.setAttribute('aria-pressed', String(ligada));
    btnChuva.textContent = ligada ? 'Chuva: ligada' : 'Chuva: desligada';
  }

  btnCrt.addEventListener('click', function () {
    marcarCrt(!document.body.classList.contains('crt-off'));
  });
  btnChuva.addEventListener('click', function () {
    marcarChuva(!chuva.estaLigada());
  });

  // Quem pediu movimento reduzido no sistema começa com a chuva desligada.
  marcarChuva(!reducedMotion);
})();