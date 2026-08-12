/* =========================================================================
   APLICAÇÃO — Sistema de Estudos PMGO
   -------------------------------------------------------------------------
   Controla navegação entre telas e toda a interface. Sem frameworks.
   ========================================================================= */

const App = {
  el: null,
  materiaSelecionada: null, // filtro atual (id da matéria) ou null = todas

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
      simulado: () => this.telaSimulado(),
      desempenho: () => this.telaDesempenho(),
      plano: () => this.telaPlano(),
    };
    (telas[rota] || telas.inicio)();
    window.scrollTo(0, 0);
  },

  /* ------------------------------------------------------------------ */
  /* TELA: INÍCIO                                                        */
  /* ------------------------------------------------------------------ */
  telaInicio() {
    const d = Store.carregar();
    const totalCards = FLASHCARDS.length;
    const vencidos = FLASHCARDS.filter((f) => SRS.estaVencido(Store.estadoCard(f.id))).length;
    const totalQ = QUESTIONS.length;
    const respondidas = Object.keys(d.questoes).length;
    const simulados = d.simulados.length;

    this.el.innerHTML = `
      <section class="hero">
        <h1>Preparação <span class="grifo">Soldado PMGO</span></h1>
        <p class="sub">Método comprovado: recordação ativa + revisão espaçada + simulados.
        Estude todo dia, revise o que o sistema mandar e faça simulados. É assim que se passa.</p>
      </section>

      <div class="cards-grid">
        ${this._cardResumo("📇", "Flashcards para revisar hoje", `${vencidos}`, `de ${totalCards} no total`, "flashcards", vencidos > 0 ? "alerta" : "ok")}
        ${this._cardResumo("❓", "Banco de questões", `${respondidas}/${totalQ}`, "questões praticadas", "questoes", "info")}
        ${this._cardResumo("📝", "Simulados feitos", `${simulados}`, "clique para iniciar", "simulado", "info")}
      </div>

      <h2 class="secao-titulo">Matérias do edital</h2>
      <div class="materias-lista">
        ${SUBJECTS.map((s) => this._itemMateria(s)).join("")}
      </div>

      <div class="aviso-edital">
        ⚠️ <strong>Confira sempre o edital vigente.</strong> O conteúdo, os pesos e a legislação
        podem mudar a cada concurso. Use este sistema como treino, não como fonte oficial.
      </div>
    `;

    this.el.querySelectorAll("[data-ir]").forEach((b) =>
      b.addEventListener("click", () => this.navegar(b.dataset.ir))
    );
    this.el.querySelectorAll("[data-materia-detalhe]").forEach((b) =>
      b.addEventListener("click", () => this.abrirDetalheMateria(b.dataset.materiaDetalhe))
    );
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
          <span class="materia-peso">peso ${s.peso}</span>
        </div>
        <div class="barra"><div class="barra-fill" style="width:${perc}%"></div></div>
        <div class="materia-rodape">${est.respondidas} respondidas · ${perc}% de acerto</div>
      </button>`;
  },

  abrirDetalheMateria(id) {
    const s = SUBJECTS.find((x) => x.id === id);
    if (!s) return;
    this.el.innerHTML = `
      <button class="voltar" id="voltar">← Voltar</button>
      <section class="hero compacto" style="--cor:${s.cor}">
        <h1>${s.nome}</h1>
        <p class="sub">Peso ${s.peso} · ${s.topicos.length} tópicos no edital</p>
      </section>
      <h2 class="secao-titulo">Conteúdo programático</h2>
      <ul class="topicos">
        ${s.topicos.map((t, i) => `<li><span class="num">${i + 1}</span>${t}</li>`).join("")}
      </ul>
      <div class="acoes-materia">
        <button class="btn primario" id="praticar">Praticar questões desta matéria</button>
        <button class="btn" id="revisar">Revisar flashcards</button>
      </div>
    `;
    document.getElementById("voltar").addEventListener("click", () => this.navegar("inicio"));
    document.getElementById("praticar").addEventListener("click", () => {
      this.materiaSelecionada = id;
      this.navegar("questoes");
    });
    document.getElementById("revisar").addEventListener("click", () => {
      this.materiaSelecionada = id;
      this.navegar("flashcards");
    });
  },

  /* ------------------------------------------------------------------ */
  /* TELA: FLASHCARDS (revisão espaçada)                                */
  /* ------------------------------------------------------------------ */
  telaFlashcards() {
    const filtro = this.materiaSelecionada;
    let cards = FLASHCARDS.filter((f) => !filtro || f.materia === filtro);
    // Prioriza vencidos
    cards = cards
      .map((c) => ({ card: c, estado: Store.estadoCard(c.id) }))
      .sort((a, b) => a.estado.proximaRevisao - b.estado.proximaRevisao);

    const vencidos = cards.filter((c) => SRS.estaVencido(c.estado));
    const fila = vencidos.length ? vencidos : cards.slice(0, 1);

    this.el.innerHTML = `
      <div class="topo-tela">
        <h1>📇 Flashcards</h1>
        ${this._seletorMateria()}
      </div>
      <p class="sub">Leia a pergunta, tente responder de cabeça, depois vire o card e avalie
      honestamente. O sistema decide quando você revê cada um de novo.</p>
      <div id="area-card"></div>
    `;
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
          <p>Você revisou todos os cards pendentes. Volte amanhã para os próximos.</p>
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
      <div class="progresso-fila">Card ${idx + 1} de ${lista.length}</div>
    `;
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
        const q = parseInt(b.dataset.q, 10);
        const novo = SRS.revisar(Store.estadoCard(card.id), q);
        Store.atualizarCard(card.id, novo);
        this._mostrarProximoCard(lista, idx + 1);
      });
    });
  },

  /* ------------------------------------------------------------------ */
  /* TELA: QUESTÕES                                                     */
  /* ------------------------------------------------------------------ */
  telaQuestoes() {
    const filtro = this.materiaSelecionada;
    const lista = QUESTIONS.filter((q) => !filtro || q.materia === filtro);
    this.el.innerHTML = `
      <div class="topo-tela">
        <h1>❓ Questões</h1>
        ${this._seletorMateria()}
      </div>
      <p class="sub">${lista.length} questões disponíveis. Responda, veja o gabarito comentado
      e aprenda com o erro — é assim que o conteúdo fixa.</p>
      <div id="area-questoes"></div>
    `;
    this._bindSeletorMateria(() => this.telaQuestoes());
    this._renderQuestoes(lista);
  },

  _renderQuestoes(lista) {
    const area = document.getElementById("area-questoes");
    if (!lista.length) {
      area.innerHTML = `<div class="vazio">Nenhuma questão para este filtro ainda.</div>`;
      return;
    }
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
        <div class="explicacao oculto">
          <strong>💡 Comentário:</strong> ${q.explicacao}
        </div>
      </article>`;
  },

  /* ------------------------------------------------------------------ */
  /* TELA: SIMULADO                                                     */
  /* ------------------------------------------------------------------ */
  telaSimulado() {
    this.el.innerHTML = `
      <h1>📝 Simulado</h1>
      <p class="sub">Prova cronometrada com questões sorteadas de todas as matérias.
      Simule a pressão real da prova. Ao final você vê seu desempenho por matéria.</p>
      <div class="config-simulado">
        <label>Número de questões:
          <select id="qtd">
            <option value="5">5 (rápido)</option>
            <option value="10" selected>10</option>
            <option value="20">20 (completo)</option>
          </select>
        </label>
        <button class="btn primario" id="iniciar">Iniciar simulado</button>
      </div>
    `;
    document.getElementById("iniciar").addEventListener("click", () => {
      const qtd = parseInt(document.getElementById("qtd").value, 10);
      this._iniciarSimulado(qtd);
    });
  },

  _iniciarSimulado(qtd) {
    const embaralhado = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, Math.min(qtd, QUESTIONS.length));
    const respostas = new Array(embaralhado.length).fill(null);
    let atual = 0;
    const inicio = Date.now();

    const render = () => {
      const q = embaralhado[atual];
      const materia = SUBJECTS.find((s) => s.id === q.materia);
      const letras = ["A", "B", "C", "D", "E"];
      this.el.innerHTML = `
        <div class="simulado-topo">
          <span>Questão ${atual + 1} de ${embaralhado.length}</span>
          <span class="chip" style="--cor:${materia.cor}">${materia.nome}</span>
        </div>
        <div class="barra"><div class="barra-fill" style="width:${((atual) / embaralhado.length) * 100}%"></div></div>
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
          ${atual === embaralhado.length - 1
            ? '<button class="btn primario" id="finalizar">Finalizar e ver resultado</button>'
            : '<button class="btn primario" id="prox">Próxima →</button>'}
        </div>
      `;
      this.el.querySelectorAll(".alt").forEach((alt) => {
        alt.addEventListener("click", () => {
          respostas[atual] = parseInt(alt.dataset.i, 10);
          render();
        });
      });
      const ant = document.getElementById("ant");
      const prox = document.getElementById("prox");
      const fin = document.getElementById("finalizar");
      if (ant) ant.addEventListener("click", () => { atual--; render(); });
      if (prox) prox.addEventListener("click", () => { atual++; render(); });
      if (fin) fin.addEventListener("click", () => finalizar());
    };

    const finalizar = () => {
      let acertos = 0;
      const porMateria = {};
      embaralhado.forEach((q, i) => {
        const acertou = respostas[i] === q.correta;
        if (acertou) acertos++;
        const m = porMateria[q.materia] || { total: 0, acertos: 0 };
        m.total++;
        if (acertou) m.acertos++;
        porMateria[q.materia] = m;
        Store.registrarQuestao(q, acertou);
      });
      const tempo = Math.round((Date.now() - inicio) / 1000);
      const resultado = { data: Date.now(), total: embaralhado.length, acertos, tempo, porMateria };
      Store.registrarSimulado(resultado);
      this._resultadoSimulado(resultado, embaralhado, respostas);
    };

    render();
  },

  _resultadoSimulado(res, questoes, respostas) {
    const perc = Math.round((res.acertos / res.total) * 100);
    const min = Math.floor(res.tempo / 60);
    const seg = res.tempo % 60;
    const aprovado = perc >= 60;
    const letras = ["A", "B", "C", "D", "E"];

    this.el.innerHTML = `
      <div class="resultado-simulado ${aprovado ? "aprovado" : "reprovado"}">
        <div class="nota-grande">${perc}%</div>
        <p>${res.acertos} de ${res.total} questões · ${min}min ${seg}s</p>
        <p class="veredito">${aprovado ? "🎯 Bom desempenho! Continue assim." : "📚 Abaixo de 60%. Reforce as matérias fracas."}</p>
      </div>
      <h2 class="secao-titulo">Desempenho por matéria</h2>
      <div class="materias-lista">
        ${Object.entries(res.porMateria).map(([mid, m]) => {
          const s = SUBJECTS.find((x) => x.id === mid);
          const p = Math.round((m.acertos / m.total) * 100);
          return `<div class="materia-item estatico" style="--cor:${s.cor}">
            <div class="materia-cabecalho"><span class="materia-nome">${s.nome}</span><span>${m.acertos}/${m.total}</span></div>
            <div class="barra"><div class="barra-fill" style="width:${p}%"></div></div>
          </div>`;
        }).join("")}
      </div>
      <h2 class="secao-titulo">Gabarito comentado</h2>
      <div id="gabarito">
        ${questoes.map((q, i) => {
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
            <div class="explicacao"><strong>💡 Comentário:</strong> ${q.explicacao}</div>
          </article>`;
        }).join("")}
      </div>
      <div class="acoes-materia">
        <button class="btn primario" id="novo">Fazer outro simulado</button>
        <button class="btn" id="ver-desempenho">Ver meu desempenho geral</button>
      </div>
    `;
    document.getElementById("novo").addEventListener("click", () => this.navegar("simulado"));
    document.getElementById("ver-desempenho").addEventListener("click", () => this.navegar("desempenho"));
  },

  /* ------------------------------------------------------------------ */
  /* TELA: DESEMPENHO                                                   */
  /* ------------------------------------------------------------------ */
  telaDesempenho() {
    const d = Store.carregar();
    const totalResp = Object.values(d.estatMateria).reduce((a, m) => a + m.respondidas, 0);
    const totalAcertos = Object.values(d.estatMateria).reduce((a, m) => a + m.acertos, 0);
    const percGeral = totalResp ? Math.round((totalAcertos / totalResp) * 100) : 0;

    // Identifica pontos fracos
    const materiasComDados = SUBJECTS.map((s) => {
      const m = d.estatMateria[s.id] || { respondidas: 0, acertos: 0 };
      const perc = m.respondidas ? Math.round((m.acertos / m.respondidas) * 100) : null;
      return { s, m, perc };
    });
    const fracas = materiasComDados
      .filter((x) => x.perc !== null && x.perc < 70)
      .sort((a, b) => a.perc - b.perc);

    this.el.innerHTML = `
      <h1>📊 Meu desempenho</h1>
      <div class="stats-linha">
        <div class="stat"><div class="stat-valor">${percGeral}%</div><div class="stat-legenda">acerto geral</div></div>
        <div class="stat"><div class="stat-valor">${totalResp}</div><div class="stat-legenda">questões respondidas</div></div>
        <div class="stat"><div class="stat-valor">${d.simulados.length}</div><div class="stat-legenda">simulados</div></div>
      </div>

      ${fracas.length ? `
        <div class="alerta-fracas">
          <h3>🎯 Foque nestas matérias (acerto abaixo de 70%)</h3>
          <ul>${fracas.map((x) => `<li>${x.s.nome} — <strong>${x.perc}%</strong> de acerto</li>`).join("")}</ul>
        </div>` : (totalResp ? `<div class="alerta-fracas ok"><h3>✅ Bom trabalho! Nenhuma matéria crítica no momento.</h3></div>` : "")}

      <h2 class="secao-titulo">Acerto por matéria</h2>
      <div class="materias-lista">
        ${materiasComDados.map((x) => `
          <div class="materia-item estatico" style="--cor:${x.s.cor}">
            <div class="materia-cabecalho">
              <span class="materia-nome">${x.s.nome}</span>
              <span>${x.perc === null ? "—" : x.perc + "%"}</span>
            </div>
            <div class="barra"><div class="barra-fill" style="width:${x.perc || 0}%"></div></div>
            <div class="materia-rodape">${x.m.respondidas} respondidas</div>
          </div>`).join("")}
      </div>

      ${d.simulados.length ? `
        <h2 class="secao-titulo">Histórico de simulados</h2>
        <table class="tabela">
          <thead><tr><th>Data</th><th>Acertos</th><th>%</th><th>Tempo</th></tr></thead>
          <tbody>
            ${d.simulados.slice().reverse().map((s) => {
              const dt = new Date(s.data);
              const p = Math.round((s.acertos / s.total) * 100);
              return `<tr><td>${dt.toLocaleDateString("pt-BR")} ${dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>${s.acertos}/${s.total}</td><td>${p}%</td><td>${Math.floor(s.tempo / 60)}min</td></tr>`;
            }).join("")}
          </tbody>
        </table>` : ""}

      <div class="acoes-materia">
        <button class="btn" id="exportar">⬇ Exportar progresso</button>
        <button class="btn perigo" id="resetar">🗑 Zerar progresso</button>
      </div>
    `;

    document.getElementById("exportar").addEventListener("click", () => {
      const blob = new Blob([Store.exportar()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pmgo-progresso.json";
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById("resetar").addEventListener("click", () => {
      if (confirm("Tem certeza? Isso apaga TODO o seu progresso.")) {
        Store.resetar();
        this.telaDesempenho();
      }
    });
  },

  /* ------------------------------------------------------------------ */
  /* TELA: PLANO DE ESTUDOS                                             */
  /* ------------------------------------------------------------------ */
  telaPlano() {
    this.el.innerHTML = `
      <h1>🗓️ Plano de estudos</h1>
      <p class="sub">Rotina recomendada baseada no método de alta performance para concursos.
      Constância vence intensidade: melhor 2h todo dia do que 12h só no domingo.</p>

      <div class="plano-passos">
        <div class="passo"><span class="passo-num">1</span>
          <div><strong>Revisão espaçada (15–20 min)</strong><br>
          Todo dia comece pelos <em>flashcards vencidos</em>. É o que consolida a memória de longo prazo.</div>
        </div>
        <div class="passo"><span class="passo-num">2</span>
          <div><strong>Teoria + questões (60–90 min)</strong><br>
          Estude 1 tópico novo e resolva questões dele em seguida. Aprender fazendo fixa muito mais.</div>
        </div>
        <div class="passo"><span class="passo-num">3</span>
          <div><strong>Corrija seus erros (15 min)</strong><br>
          Leia o comentário de cada questão que errou. O erro é o melhor professor.</div>
        </div>
        <div class="passo"><span class="passo-num">4</span>
          <div><strong>Simulado semanal</strong><br>
          Uma vez por semana faça um simulado cronometrado completo e revise o desempenho por matéria.</div>
        </div>
      </div>

      <h2 class="secao-titulo">Ciclo semanal sugerido</h2>
      <table class="tabela">
        <thead><tr><th>Dia</th><th>Foco</th></tr></thead>
        <tbody>
          <tr><td>Seg</td><td>Português + Flashcards</td></tr>
          <tr><td>Ter</td><td>Direito Constitucional + Legislação PM</td></tr>
          <tr><td>Qua</td><td>RLM + Informática</td></tr>
          <tr><td>Qui</td><td>Direito Penal + Direito Administrativo</td></tr>
          <tr><td>Sex</td><td>Direitos Humanos + Atualidades de Goiás</td></tr>
          <tr><td>Sáb</td><td>Simulado completo + correção</td></tr>
          <tr><td>Dom</td><td>Revisão geral dos erros da semana</td></tr>
        </tbody>
      </table>

      <div class="aviso-edital">
        💡 <strong>Dica de ouro:</strong> ajuste o foco pelas suas matérias fracas na aba
        <em>Desempenho</em>. O sistema mostra exatamente onde você precisa reforçar.
      </div>
    `;
  },

  /* ------------------------------------------------------------------ */
  /* COMPONENTES REUTILIZÁVEIS                                          */
  /* ------------------------------------------------------------------ */
  _seletorMateria() {
    return `
      <select class="seletor-materia" id="seletor-materia">
        <option value="">Todas as matérias</option>
        ${SUBJECTS.map((s) => `<option value="${s.id}" ${this.materiaSelecionada === s.id ? "selected" : ""}>${s.nome}</option>`).join("")}
      </select>`;
  },
  _bindSeletorMateria(recarregar) {
    const sel = document.getElementById("seletor-materia");
    if (sel) sel.addEventListener("change", () => {
      this.materiaSelecionada = sel.value || null;
      recarregar();
    });
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
