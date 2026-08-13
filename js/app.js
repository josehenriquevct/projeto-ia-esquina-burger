/* =========================================================================
   APLICAÇÃO — Sistema de Estudos PMGO (Soldado Combatente / AOCP)
   Sem frameworks. Calibrado pela prova real do Edital 002/2022.
   ========================================================================= */

const App = {
  el: null,
  materiaSelecionada: null,

  init() {
    this.el = document.getElementById("app");
    this.bindNav();
    this.navegar("inicio");
  },

  bindNav() {
    document.querySelectorAll("[data-rota]").forEach((btn) => {
      btn.addEventListener("click", () => this.navegar(btn.dataset.rota));
    });
  },

  navegar(rota) {
    document.querySelectorAll("[data-rota]").forEach((b) =>
      b.classList.toggle("ativo", b.dataset.rota === rota)
    );
    const telas = {
      inicio: () => this.telaInicio(),
      flashcards: () => this.telaFlashcards(),
      questoes: () => this.telaQuestoes(),
      resumos: () => this.telaResumos(),
      simulado: () => this.telaSimulado(),
      desempenho: () => this.telaDesempenho(),
      plano: () => this.telaPlano(),
      prova: () => this.telaProva(),
    };
    (telas[rota] || telas.inicio)();
    window.scrollTo(0, 0);
  },

  nomeMateria(id) {
    const s = SUBJECTS.find((x) => x.id === id);
    return s ? s.nome : id;
  },

  /* ================================================================== */
  /* INÍCIO                                                              */
  /* ================================================================== */
  telaInicio() {
    const d = Store.carregar();
    const vencidos = FLASHCARDS.filter((f) => SRS.estaVencido(Store.estadoCard(f.id))).length;
    const respondidas = Object.keys(d.questoes).length;
    const simulados = d.simulados.length;

    this.el.innerHTML = `
      <section class="hero">
        <h1>Preparação <span class="grifo">Soldado PMGO</span></h1>
        <p class="sub">Calibrado pela prova real: banca <strong>${EXAM.banca}</strong>,
        Edital <strong>${EXAM.edital}</strong>. Método: recordação ativa + revisão espaçada + simulados.</p>
      </section>

      <div class="faixa-regra">
        🎯 <strong>Regra de aprovação:</strong> acertar ≥ <strong>${EXAM.minPontos} pontos</strong>
        (60% dos ${EXAM.pontosObjetiva}) <u>e não zerar em nenhuma matéria</u>.
        Redação vale ${EXAM.pontosRedacao} pontos à parte (mín. ${EXAM.redacaoMin}).
      </div>

      <div class="cards-grid">
        ${this._cardResumo("📇", "Flashcards p/ revisar hoje", `${vencidos}`, `de ${FLASHCARDS.length}`, "flashcards", vencidos > 0 ? "alerta" : "ok")}
        ${this._cardResumo("❓", "Questões praticadas", `${respondidas}/${QUESTIONS.length}`, "banco no estilo AOCP", "questoes", "info")}
        ${this._cardResumo("📝", "Simulados feitos", `${simulados}`, "modelo real da prova", "simulado", "info")}
      </div>

      <h2 class="secao-titulo">Grade da prova — 50 questões + redação</h2>
      <p class="sub" style="text-align:left;margin:0 0 12px">Clique numa matéria para ver o conteúdo e praticar.
      A cor da barra mostra seu % de acerto. Ordenadas por <strong>prioridade de estudo</strong>.</p>
      <div class="materias-lista">
        ${[...SUBJECTS].sort((a, b) => a.prioridade - b.prioridade || b.pontos - a.pontos)
          .map((s) => this._itemMateria(s)).join("")}
      </div>

      <div class="aviso-edital">
        ⚠️ <strong>Confira sempre o edital vigente.</strong> O próximo concurso deve trazer
        <strong>cota racial de 20%</strong> (Lei 23.389/2025) e <strong>lista única sem teto de vagas femininas</strong>
        (ADI 7.490). Material de estudo independente, não oficial.
      </div>
    `;

    this.el.querySelectorAll("[data-ir]").forEach((b) =>
      b.addEventListener("click", () => this.navegar(b.dataset.ir)));
    this.el.querySelectorAll("[data-materia-detalhe]").forEach((b) =>
      b.addEventListener("click", () => this.abrirDetalheMateria(b.dataset.materiaDetalhe)));
  },

  _cardResumo(icone, titulo, valor, legenda, rota, tom) {
    return `
      <button class="card-resumo tom-${tom}" data-ir="${rota}">
        <div class="card-icone">${icone}</div>
        <div class="card-valor">${valor}</div>
        <div class="card-titulo">${titulo}</div>
        <div class="card-legenda">${legenda}</div>
      </button>`;
  },

  _itemMateria(s) {
    const d = Store.carregar();
    const est = d.estatMateria[s.id] || { respondidas: 0, acertos: 0 };
    const perc = est.respondidas ? Math.round((est.acertos / est.respondidas) * 100) : 0;
    return `
      <button class="materia-item" data-materia-detalhe="${s.id}" style="--cor:${s.cor}">
        <div class="materia-cabecalho">
          <span class="materia-nome">${s.nome}</span>
          <span class="materia-peso prio-${s.prioridade}">P${s.prioridade}</span>
        </div>
        <div class="materia-info">${s.questoesProva} questões · peso ${s.pesoProva} · <strong>${s.pontos} pts</strong></div>
        <div class="barra"><div class="barra-fill" style="width:${perc}%"></div></div>
        <div class="materia-rodape">${est.respondidas} respondidas · ${perc}% de acerto</div>
      </button>`;
  },

  abrirDetalheMateria(id) {
    const s = SUBJECTS.find((x) => x.id === id);
    if (!s) return;
    const nQ = QUESTIONS.filter((q) => q.materia === id).length;
    this.el.innerHTML = `
      <button class="voltar" id="voltar">← Voltar</button>
      <section class="hero compacto" style="--cor:${s.cor}">
        <h1>${s.nome}</h1>
        <p class="sub">${s.questoesProva} questões · peso ${s.pesoProva} · ${s.pontos} pontos · prioridade ${s.prioridade}</p>
      </section>
      <h2 class="secao-titulo">Conteúdo que efetivamente cai</h2>
      <ul class="topicos">
        ${s.topicos.map((t, i) => `<li><span class="num">${i + 1}</span>${t}</li>`).join("")}
      </ul>
      <div class="acoes-materia">
        <button class="btn primario" id="praticar">Praticar questões (${nQ})</button>
        <button class="btn" id="resumo">📖 Ver resumo</button>
        <button class="btn" id="revisar">Revisar flashcards</button>
      </div>
    `;
    document.getElementById("voltar").addEventListener("click", () => this.navegar("inicio"));
    document.getElementById("praticar").addEventListener("click", () => { this.materiaSelecionada = id; this.navegar("questoes"); });
    document.getElementById("resumo").addEventListener("click", () => { this.materiaSelecionada = id; this.navegar("resumos"); });
    document.getElementById("revisar").addEventListener("click", () => { this.materiaSelecionada = id; this.navegar("flashcards"); });
  },

  /* ================================================================== */
  /* FLASHCARDS                                                          */
  /* ================================================================== */
  telaFlashcards() {
    const filtro = this.materiaSelecionada;
    let cards = FLASHCARDS.filter((f) => !filtro || f.materia === filtro)
      .map((c) => ({ card: c, estado: Store.estadoCard(c.id) }))
      .sort((a, b) => a.estado.proximaRevisao - b.estado.proximaRevisao);
    const vencidos = cards.filter((c) => SRS.estaVencido(c.estado));
    const fila = vencidos.length ? vencidos : cards.slice(0, 1);

    this.el.innerHTML = `
      <div class="topo-tela"><h1>📇 Flashcards</h1>${this._seletorMateria()}</div>
      <p class="sub">Leia, tente responder de cabeça, vire o card e avalie com honestidade.
      O algoritmo SM-2 decide quando você revê cada um.</p>
      <div id="area-card"></div>`;
    this._bindSeletorMateria(() => this.telaFlashcards());
    this._mostrarProximoCard(fila.map((c) => c.card), 0);
  },

  _mostrarProximoCard(lista, idx) {
    const area = document.getElementById("area-card");
    if (!area) return;
    if (idx >= lista.length) {
      area.innerHTML = `
        <div class="parabens">
          <div class="parabens-icone">✅</div>
          <h2>Revisão concluída!</h2>
          <p>Você revisou os cards pendentes. Volte amanhã para os próximos.</p>
          <button class="btn primario" id="voltar-inicio">Voltar ao início</button>
        </div>`;
      document.getElementById("voltar-inicio").addEventListener("click", () => this.navegar("inicio"));
      return;
    }
    const card = lista[idx];
    const materia = SUBJECTS.find((s) => s.id === card.materia);
    area.innerHTML = `
      <div class="flashcard" id="flashcard">
        <div class="flashcard-tag" style="--cor:${materia.cor}">${materia.nome}</div>
        <div class="flashcard-conteudo">
          <div class="flashcard-frente">${card.frente}</div>
          <div class="flashcard-verso oculto">${card.verso}</div>
        </div>
        <div class="flashcard-dica" id="dica">Clique no card para ver a resposta</div>
      </div>
      <div class="avaliacao oculto" id="avaliacao">
        <p>Como foi lembrar?</p>
        <div class="avaliacao-botoes">
          <button class="aval erro" data-q="0">Errei</button>
          <button class="aval dificil" data-q="3">Difícil</button>
          <button class="aval bom" data-q="4">Bom</button>
          <button class="aval facil" data-q="5">Fácil</button>
        </div>
      </div>
      <div class="progresso-fila">Card ${idx + 1} de ${lista.length}</div>`;
    const fc = document.getElementById("flashcard");
    const verso = fc.querySelector(".flashcard-verso");
    const dica = document.getElementById("dica");
    const aval = document.getElementById("avaliacao");
    let virado = false;
    fc.addEventListener("click", () => {
      if (virado) return;
      virado = true;
      verso.classList.remove("oculto");
      fc.classList.add("virado");
      dica.textContent = "Avalie sua resposta abaixo 👇";
      aval.classList.remove("oculto");
    });
    aval.querySelectorAll(".aval").forEach((b) => {
      b.addEventListener("click", () => {
        const novo = SRS.revisar(Store.estadoCard(card.id), parseInt(b.dataset.q, 10));
        Store.atualizarCard(card.id, novo);
        this._mostrarProximoCard(lista, idx + 1);
      });
    });
  },

  /* ================================================================== */
  /* QUESTÕES                                                            */
  /* ================================================================== */
  telaQuestoes() {
    const filtro = this.materiaSelecionada;
    const lista = QUESTIONS.filter((q) => !filtro || q.materia === filtro);
    this.el.innerHTML = `
      <div class="topo-tela"><h1>❓ Questões</h1>${this._seletorMateria()}</div>
      <p class="sub">${lista.length} questões no estilo AOCP. Atenção aos comandos
      <strong>INCORRETA / NÃO / EXCETO</strong> — caem em ~16% da prova. Leia o gabarito comentado.</p>
      <div id="area-questoes"></div>`;
    this._bindSeletorMateria(() => this.telaQuestoes());
    this._renderQuestoes(lista);
  },

  _renderQuestoes(lista) {
    const area = document.getElementById("area-questoes");
    if (!lista.length) { area.innerHTML = `<div class="vazio">Nenhuma questão para este filtro.</div>`; return; }
    area.innerHTML = lista.map((q, i) => this._cardQuestao(q, i)).join("");
    lista.forEach((q) => {
      const bloco = area.querySelector(`[data-qid="${q.id}"]`);
      const alts = bloco.querySelectorAll(".alt");
      alts.forEach((alt) => {
        alt.addEventListener("click", () => {
          if (bloco.classList.contains("respondida")) return;
          const escolha = parseInt(alt.dataset.i, 10);
          const acertou = escolha === q.correta;
          bloco.classList.add("respondida");
          alts.forEach((a, ai) => {
            if (ai === q.correta) a.classList.add("correta");
            else if (ai === escolha) a.classList.add("errada");
            a.style.pointerEvents = "none";
          });
          bloco.querySelector(".explicacao").classList.remove("oculto");
          bloco.querySelector(".resultado").innerHTML = acertou
            ? '<span class="tag-ok">✔ Você acertou!</span>'
            : '<span class="tag-err">✘ Resposta incorreta</span>';
          Store.registrarQuestao(q, acertou);
        });
      });
    });
  },

  _cardQuestao(q, i) {
    const materia = SUBJECTS.find((s) => s.id === q.materia);
    const letras = ["A", "B", "C", "D", "E"];
    return `
      <article class="questao" data-qid="${q.id}">
        <div class="questao-meta">
          <span class="chip" style="--cor:${materia.cor}">${materia.nome}</span>
          <span class="chip nivel-${q.nivel}">${q.nivel}</span>
          <span class="questao-num">Questão ${i + 1}</span>
        </div>
        <p class="questao-enunciado">${q.enunciado}</p>
        <div class="alternativas">
          ${q.alternativas.map((a, ai) => `
            <button class="alt" data-i="${ai}">
              <span class="alt-letra">${letras[ai]}</span>
              <span class="alt-texto">${a}</span>
            </button>`).join("")}
        </div>
        <div class="resultado"></div>
        <div class="explicacao oculto"><strong>💡 Comentário:</strong> ${q.explicacao}</div>
      </article>`;
  },

  /* ================================================================== */
  /* SIMULADO — replica o modelo real (distribuição por matéria)         */
  /* ================================================================== */
  telaSimulado() {
    this.el.innerHTML = `
      <h1>📝 Simulado</h1>
      <p class="sub">Prova cronometrada montada na <strong>proporção real</strong> da grade AOCP.
      Ao final você vê se bateu a regra dos <strong>60% + não zerar</strong> e o desempenho por matéria.</p>
      <div class="config-simulado">
        <label>Tamanho:
          <select id="qtd">
            <option value="10">10 questões (rápido)</option>
            <option value="25">25 questões (metade)</option>
            <option value="50" selected>50 questões (prova cheia)</option>
          </select>
        </label>
        <button class="btn primario" id="iniciar">Iniciar simulado</button>
      </div>
      <div class="aviso-edital" style="margin-top:16px">
        ℹ️ O banco de questões atual é uma amostra; num simulado de 50 algumas matérias
        repetem questões. Vou expandir o banco quando você pedir — aí a proporção fica exata.
      </div>`;
    document.getElementById("iniciar").addEventListener("click", () =>
      this._iniciarSimulado(parseInt(document.getElementById("qtd").value, 10)));
  },

  // Monta a prova respeitando a proporção de questões por matéria da grade real.
  _montarProva(qtd) {
    const totalGrade = SUBJECTS.reduce((a, s) => a + s.questoesProva, 0); // 50
    const selecionadas = [];
    SUBJECTS.forEach((s) => {
      const alvo = Math.max(1, Math.round((s.questoesProva / totalGrade) * qtd));
      const pool = QUESTIONS.filter((q) => q.materia === s.id).sort(() => Math.random() - 0.5);
      for (let i = 0; i < alvo; i++) {
        if (pool.length) selecionadas.push(pool[i % pool.length]);
      }
    });
    // Ajusta ao tamanho pedido
    const prova = selecionadas.sort(() => Math.random() - 0.5).slice(0, qtd);
    return prova;
  },

  _iniciarSimulado(qtd) {
    const prova = this._montarProva(qtd);
    const respostas = new Array(prova.length).fill(null);
    let atual = 0;
    const inicio = Date.now();

    const render = () => {
      const q = prova[atual];
      const materia = SUBJECTS.find((s) => s.id === q.materia);
      const letras = ["A", "B", "C", "D", "E"];
      this.el.innerHTML = `
        <div class="simulado-topo">
          <span>Questão ${atual + 1} de ${prova.length}</span>
          <span class="chip" style="--cor:${materia.cor}">${materia.nome}</span>
        </div>
        <div class="barra"><div class="barra-fill" style="width:${(atual / prova.length) * 100}%"></div></div>
        <article class="questao destaque">
          <p class="questao-enunciado">${q.enunciado}</p>
          <div class="alternativas">
            ${q.alternativas.map((a, ai) => `
              <button class="alt ${respostas[atual] === ai ? "marcada" : ""}" data-i="${ai}">
                <span class="alt-letra">${letras[ai]}</span>
                <span class="alt-texto">${a}</span>
              </button>`).join("")}
          </div>
        </article>
        <div class="simulado-nav">
          <button class="btn" id="ant" ${atual === 0 ? "disabled" : ""}>← Anterior</button>
          ${atual === prova.length - 1
            ? '<button class="btn primario" id="finalizar">Finalizar e ver resultado</button>'
            : '<button class="btn primario" id="prox">Próxima →</button>'}
        </div>`;
      this.el.querySelectorAll(".alt").forEach((alt) => {
        alt.addEventListener("click", () => { respostas[atual] = parseInt(alt.dataset.i, 10); render(); });
      });
      const ant = document.getElementById("ant");
      const prox = document.getElementById("prox");
      const fin = document.getElementById("finalizar");
      if (ant) ant.addEventListener("click", () => { atual--; render(); });
      if (prox) prox.addEventListener("click", () => { atual++; render(); });
      if (fin) fin.addEventListener("click", finalizar);
    };

    const finalizar = () => {
      let acertos = 0;
      const porMateria = {};
      prova.forEach((q, i) => {
        const acertou = respostas[i] === q.correta;
        if (acertou) acertos++;
        const m = porMateria[q.materia] || { total: 0, acertos: 0 };
        m.total++; if (acertou) m.acertos++;
        porMateria[q.materia] = m;
        Store.registrarQuestao(q, acertou);
      });
      const tempo = Math.round((Date.now() - inicio) / 1000);
      const resultado = { data: Date.now(), total: prova.length, acertos, tempo, porMateria };
      Store.registrarSimulado(resultado);
      this._resultadoSimulado(resultado, prova, respostas);
    };
    render();
  },

  _resultadoSimulado(res, prova, respostas) {
    const perc = Math.round((res.acertos / res.total) * 100);
    const min = Math.floor(res.tempo / 60), seg = res.tempo % 60;
    const letras = ["A", "B", "C", "D", "E"];

    // Regra real: >=60% E não zerar nenhuma matéria presente na prova
    const zerou = Object.entries(res.porMateria).filter(([, m]) => m.acertos === 0)
      .map(([mid]) => this.nomeMateria(mid));
    const passou60 = perc >= EXAM.minPercent;
    const aprovado = passou60 && zerou.length === 0;

    let veredito;
    if (aprovado) veredito = "🎯 Dentro do critério: ≥60% e sem zerar nenhuma matéria.";
    else if (!passou60 && zerou.length) veredito = `❌ Abaixo de 60% e zerou: ${zerou.join(", ")}.`;
    else if (!passou60) veredito = "❌ Abaixo dos 60% exigidos. Reforce as matérias fracas.";
    else veredito = `⚠️ Bateu os 60%, mas ZEROU em: ${zerou.join(", ")} — isso ELIMINA na prova real!`;

    this.el.innerHTML = `
      <div class="resultado-simulado ${aprovado ? "aprovado" : "reprovado"}">
        <div class="nota-grande">${perc}%</div>
        <p>${res.acertos} de ${res.total} questões · ${min}min ${seg}s</p>
        <p class="veredito">${veredito}</p>
      </div>
      <h2 class="secao-titulo">Desempenho por matéria</h2>
      <div class="materias-lista">
        ${Object.entries(res.porMateria).map(([mid, m]) => {
          const s = SUBJECTS.find((x) => x.id === mid);
          const p = Math.round((m.acertos / m.total) * 100);
          const zero = m.acertos === 0;
          return `<div class="materia-item estatico ${zero ? "zerada" : ""}" style="--cor:${s.cor}">
            <div class="materia-cabecalho"><span class="materia-nome">${s.nome}</span>
              <span>${m.acertos}/${m.total}${zero ? " ⚠️" : ""}</span></div>
            <div class="barra"><div class="barra-fill" style="width:${p}%"></div></div>
          </div>`;
        }).join("")}
      </div>
      <h2 class="secao-titulo">Gabarito comentado</h2>
      ${prova.map((q, i) => {
        const materia = SUBJECTS.find((s) => s.id === q.materia);
        const acertou = respostas[i] === q.correta;
        return `<article class="questao respondida">
          <div class="questao-meta">
            <span class="chip" style="--cor:${materia.cor}">${materia.nome}</span>
            ${acertou ? '<span class="tag-ok">✔ acertou</span>' : '<span class="tag-err">✘ errou</span>'}
          </div>
          <p class="questao-enunciado">${q.enunciado}</p>
          <p class="gab-linha"><strong>Sua resposta:</strong> ${respostas[i] != null ? letras[respostas[i]] + ") " + q.alternativas[respostas[i]] : "— (em branco)"}</p>
          <p class="gab-linha"><strong>Correta:</strong> ${letras[q.correta]}) ${q.alternativas[q.correta]}</p>
          <div class="explicacao"><strong>💡</strong> ${q.explicacao}</div>
        </article>`;
      }).join("")}
      <div class="acoes-materia">
        <button class="btn primario" id="novo">Fazer outro simulado</button>
        <button class="btn" id="ver-desempenho">Ver desempenho geral</button>
      </div>`;
    document.getElementById("novo").addEventListener("click", () => this.navegar("simulado"));
    document.getElementById("ver-desempenho").addEventListener("click", () => this.navegar("desempenho"));
  },

  /* ================================================================== */
  /* DESEMPENHO                                                          */
  /* ================================================================== */
  telaDesempenho() {
    const d = Store.carregar();
    const totalResp = Object.values(d.estatMateria).reduce((a, m) => a + m.respondidas, 0);
    const totalAcertos = Object.values(d.estatMateria).reduce((a, m) => a + m.acertos, 0);
    const percGeral = totalResp ? Math.round((totalAcertos / totalResp) * 100) : 0;

    const materiasComDados = SUBJECTS.map((s) => {
      const m = d.estatMateria[s.id] || { respondidas: 0, acertos: 0 };
      const perc = m.respondidas ? Math.round((m.acertos / m.respondidas) * 100) : null;
      return { s, m, perc };
    });
    const fracas = materiasComDados.filter((x) => x.perc !== null && x.perc < 70).sort((a, b) => a.perc - b.perc);

    this.el.innerHTML = `
      <h1>📊 Meu desempenho</h1>
      <div class="stats-linha">
        <div class="stat"><div class="stat-valor">${percGeral}%</div><div class="stat-legenda">acerto geral</div></div>
        <div class="stat"><div class="stat-valor">${totalResp}</div><div class="stat-legenda">questões respondidas</div></div>
        <div class="stat"><div class="stat-valor">${d.simulados.length}</div><div class="stat-legenda">simulados</div></div>
      </div>
      ${fracas.length ? `
        <div class="alerta-fracas">
          <h3>🎯 Foque nestas matérias (acerto &lt; 70%)</h3>
          <ul>${fracas.map((x) => `<li>${x.s.nome} — <strong>${x.perc}%</strong> (${x.s.pontos} pts na prova)</li>`).join("")}</ul>
        </div>` : (totalResp ? `<div class="alerta-fracas ok"><h3>✅ Nenhuma matéria crítica no momento.</h3></div>` : "")}
      <h2 class="secao-titulo">Acerto por matéria</h2>
      <div class="materias-lista">
        ${materiasComDados.map((x) => `
          <div class="materia-item estatico" style="--cor:${x.s.cor}">
            <div class="materia-cabecalho"><span class="materia-nome">${x.s.nome}</span>
              <span>${x.perc === null ? "—" : x.perc + "%"}</span></div>
            <div class="barra"><div class="barra-fill" style="width:${x.perc || 0}%"></div></div>
            <div class="materia-rodape">${x.m.respondidas} respondidas · ${x.s.pontos} pts</div>
          </div>`).join("")}
      </div>
      ${d.simulados.length ? `
        <h2 class="secao-titulo">Histórico de simulados</h2>
        <table class="tabela">
          <thead><tr><th>Data</th><th>Acertos</th><th>%</th><th>Tempo</th></tr></thead>
          <tbody>${d.simulados.slice().reverse().map((s) => {
            const dt = new Date(s.data), p = Math.round((s.acertos / s.total) * 100);
            return `<tr><td>${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
              <td>${s.acertos}/${s.total}</td><td>${p}%</td><td>${Math.floor(s.tempo / 60)}min</td></tr>`;
          }).join("")}</tbody>
        </table>` : ""}
      <div class="acoes-materia">
        <button class="btn" id="exportar">⬇ Exportar progresso</button>
        <button class="btn perigo" id="resetar">🗑 Zerar progresso</button>
      </div>`;
    document.getElementById("exportar").addEventListener("click", () => {
      const blob = new Blob([Store.exportar()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "pmgo-progresso.json"; a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById("resetar").addEventListener("click", () => {
      if (confirm("Tem certeza? Isso apaga TODO o seu progresso.")) { Store.resetar(); this.telaDesempenho(); }
    });
  },

  /* ================================================================== */
  /* PLANO — priorizado por densidade (pontos/hora)                      */
  /* ================================================================== */
  telaPlano() {
    this.el.innerHTML = `
      <h1>🗓️ Plano de estudos</h1>
      <p class="sub">Ordem derivada da <strong>densidade de pontos por hora</strong> medida na prova real.
      A lógica: onde você ganha mais pontos com menos horas, você estuda primeiro.</p>

      ${STUDY_PRIORITY.map((f) => `
        <div class="faixa-card" style="--cor:${f.cor}">
          <div class="faixa-cab">Faixa ${f.faixa} — ${f.titulo}</div>
          <ul class="faixa-itens">
            ${f.itens.map((it) => `<li><strong>${this.nomeMateria(it.materia)}:</strong> ${it.nota}</li>`).join("")}
          </ul>
        </div>`).join("")}

      <div class="faixa-regra" style="margin-top:20px">
        💡 <strong>O item mais subvalorizado:</strong> a <strong>REDAÇÃO (25 pts)</strong> vale o equivalente a
        duas disciplinas jurídicas somadas — e é a que os candidatos menos treinam. Não a deixe para o fim.
      </div>

      <h2 class="secao-titulo">Alocação de tempo sugerida</h2>
      <table class="tabela">
        <thead><tr><th>Bloco</th><th>Pontos</th><th>% do tempo</th></tr></thead>
        <tbody>${TIME_ALLOCATION.map((t) => `<tr><td>${t.grupo}</td><td>${t.pontos}</td><td>${t.percent}%</td></tr>`).join("")}</tbody>
      </table>

      <h2 class="secao-titulo">Rotina diária (alta performance)</h2>
      <div class="plano-passos">
        <div class="passo"><span class="passo-num">1</span><div><strong>Revisão espaçada (15–20 min)</strong><br>Comece pelos flashcards vencidos. Consolida memória de longo prazo.</div></div>
        <div class="passo"><span class="passo-num">2</span><div><strong>Teoria + questões (60–90 min)</strong><br>1 tópico novo e resolva questões dele em seguida. Aprender fazendo fixa mais.</div></div>
        <div class="passo"><span class="passo-num">3</span><div><strong>Corrija seus erros (15 min)</strong><br>Leia o comentário de cada questão errada. O erro é o melhor professor.</div></div>
        <div class="passo"><span class="passo-num">4</span><div><strong>Simulado semanal</strong><br>1x por semana, cronometrado, e revise o desempenho por matéria.</div></div>
      </div>

      <div class="aviso-edital">
        ⚠️ <strong>3 avisos da análise da banca AOCP:</strong> (1) comando negativo em ~16% das questões — grife
        "INCORRETA/NÃO/EXCETO"; (2) ~6 questões de Certo/Errado com 4 assertivas — treine esse formato;
        (3) a AOCP quase não anula questão (2% e 0%) — não conte com recurso, resolva na preparação.
      </div>`;
  },

  /* ================================================================== */
  /* PROVA & TAF — página de referência                                  */
  /* ================================================================== */
  telaProva() {
    this.el.innerHTML = `
      <h1>🎖️ Prova &amp; TAF</h1>
      <p class="sub">Tudo o que define aprovação além do conteúdo: estrutura da prova, redação,
      teste físico e o checklist que você deve começar hoje.</p>

      <h2 class="secao-titulo">Estrutura da prova objetiva</h2>
      <table class="tabela">
        <thead><tr><th>Matéria</th><th>Questões</th><th>Peso</th><th>Pontos</th></tr></thead>
        <tbody>
          ${SUBJECTS.map((s) => `<tr><td>${s.nome}</td><td>${s.questoesProva}</td><td>${s.pesoProva}</td><td>${s.pontos}</td></tr>`).join("")}
          <tr class="tr-total"><td><strong>Total objetiva</strong></td><td><strong>${EXAM.totalQuestoes}</strong></td><td>—</td><td><strong>${EXAM.pontosObjetiva}</strong></td></tr>
          <tr class="tr-total"><td><strong>Redação</strong></td><td>1</td><td>—</td><td><strong>${EXAM.pontosRedacao}</strong></td></tr>
        </tbody>
      </table>
      <div class="faixa-regra" style="margin-top:14px">
        🎯 <strong>Aprovação:</strong> ≥ ${EXAM.minPontos} pontos (60%) <u>e ${EXAM.regraExtra}</u>
        Prova de A a E, sem penalização por erro — <strong>nunca deixe questão em branco.</strong>
      </div>

      <h2 class="secao-titulo">✍️ Redação — ${REDACAO.pontos} pontos (mín. ${REDACAO.minimo})</h2>
      <div class="passo"><div>
        <strong>${REDACAO.tipo}</strong> · ${REDACAO.linhas}.<br>
        <em>Tema real de 2022:</em> "${REDACAO.temaReal2022}"<br><br>
        <strong>Critérios (5,0 cada):</strong>
        <ul class="lista-simples">${REDACAO.criterios.map((c) => `<li>${c}</li>`).join("")}</ul>
        <strong>Atributos da Redação Oficial (decore):</strong> ${REDACAO.atributosRedacaoOficial.join(" · ")}.
      </div></div>

      <h2 class="secao-titulo">💪 TAF — Teste de Aptidão Física</h2>
      <div class="faixa-regra">
        ${TAF.regra.map((r) => `✔ ${r}`).join("<br>")}
      </div>
      <p class="sub" style="text-align:left"><strong>Alvo masculino:</strong> ${TAF.alvoMasculino}<br>
      <strong>Alvo feminino:</strong> ${TAF.alvoFeminino}</p>

      <h3 class="sub-titulo">Tabela masculina</h3>
      ${this._tabelaTaf(TAF.masculino)}
      <h3 class="sub-titulo">Tabela feminina</h3>
      ${this._tabelaTaf(TAF.feminino)}
      <p class="sub" style="text-align:left">⚠️ A <strong>natação (25 m)</strong> é apto/inapto e elimina
      independentemente da nota. Se não sabe nadar, comece agora.</p>

      <h2 class="secao-titulo">✅ Checklist não-intelectual (comece hoje)</h2>
      <ul class="topicos">
        ${CHECKLIST.map((c, i) => `<li><span class="num">${i + 1}</span>${c}</li>`).join("")}
      </ul>`;
  },

  _tabelaTaf(t) {
    return `<div class="tabela-scroll"><table class="tabela compacta">
      <thead><tr>${t.colunas.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
      <tbody>${t.linhas.map((l) => `<tr>${l.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>`;
  },

  /* ================================================================== */
  /* RESUMOS — teoria por matéria                                        */
  /* ================================================================== */
  telaResumos() {
    const filtro = this.materiaSelecionada;
    const ordenadas = [...SUBJECTS].sort((a, b) => a.prioridade - b.prioridade || b.pontos - a.pontos)
      .filter((s) => !filtro || s.id === filtro);
    this.el.innerHTML = `
      <div class="topo-tela"><h1>📖 Resumos</h1>${this._seletorMateria()}</div>
      <p class="sub">Teoria condensada no que a banca AOCP realmente cobra. Use para revisar antes
      das questões. Ordenado por prioridade de estudo.</p>
      <div id="area-resumos">
        ${ordenadas.map((s) => this._blocoResumo(s)).join("")}
      </div>`;
    this._bindSeletorMateria(() => this.telaResumos());
    this.el.querySelectorAll(".resumo-cab").forEach((cab) => {
      cab.addEventListener("click", () => {
        const corpo = cab.nextElementSibling;
        corpo.classList.toggle("oculto");
        cab.querySelector(".resumo-seta").textContent = corpo.classList.contains("oculto") ? "▸" : "▾";
      });
    });
    this.el.querySelectorAll("[data-praticar]").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); this.materiaSelecionada = b.dataset.praticar; this.navegar("questoes"); }));
  },

  _blocoResumo(s) {
    const secoes = (typeof RESUMOS !== "undefined" && RESUMOS[s.id]) || [];
    const nQ = QUESTIONS.filter((q) => q.materia === s.id).length;
    const aberto = this.materiaSelecionada === s.id; // aberto se filtrado
    return `
      <div class="resumo-card" style="--cor:${s.cor}">
        <div class="resumo-cab">
          <div>
            <span class="resumo-seta">${aberto ? "▾" : "▸"}</span>
            <strong>${s.nome}</strong>
            <span class="materia-peso prio-${s.prioridade}">P${s.prioridade}</span>
          </div>
          <span class="resumo-pts">${s.pontos} pts</span>
        </div>
        <div class="resumo-corpo ${aberto ? "" : "oculto"}">
          ${secoes.length ? secoes.map((sec) => `
            <div class="resumo-secao">
              <h4>${sec.titulo}</h4>
              <ul>${sec.pontos.map((p) => `<li>${p}</li>`).join("")}</ul>
            </div>`).join("") : '<p class="sub">Resumo em construção para esta matéria.</p>'}
          <button class="btn primario btn-pequeno" data-praticar="${s.id}">Praticar ${nQ} questões desta matéria →</button>
        </div>
      </div>`;
  },

  /* ================================================================== */
  /* COMPONENTES                                                         */
  /* ================================================================== */
  _seletorMateria() {
    return `<select class="seletor-materia" id="seletor-materia">
      <option value="">Todas as matérias</option>
      ${SUBJECTS.map((s) => `<option value="${s.id}" ${this.materiaSelecionada === s.id ? "selected" : ""}>${s.nome}</option>`).join("")}
    </select>`;
  },
  _bindSeletorMateria(recarregar) {
    const sel = document.getElementById("seletor-materia");
    if (sel) sel.addEventListener("change", () => { this.materiaSelecionada = sel.value || null; recarregar(); });
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
