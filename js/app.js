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
    // nuvem: ao entrar/sair, atualiza HUD e a tela de Perfil (se aberta)
    if (typeof Cloud !== "undefined") {
      Cloud.init(() => {
        this.renderHud();
        if (this._rota === "perfil") this.telaPerfil();
        else if (this._rota === "inicio") this.telaInicio();
      });
    }
    if (Gamify.precisaOnboarding()) this.onboarding();
    else this.navegar("inicio");
  },

  /* Tela de boas-vindas (primeira vez): mascote + escolha de meta diária */
  onboarding() {
    const ov = document.createElement("div");
    ov.className = "onboarding-overlay";
    ov.innerHTML = `
      <div class="onboarding-card">
        <div class="ob-mascote">${MASCOTE.emoji}</div>
        <h2>Bem-vindo, futuro Soldado!</h2>
        <p>Eu sou o <strong>${MASCOTE.nome}</strong> e vou te acompanhar até a farda. 🎖️</p>
        <div class="ob-campo">
          <label for="ob-nome">Como quer ser chamado(a)?</label>
          <input id="ob-nome" type="text" maxlength="24" autocomplete="name" placeholder="Seu nome ou nome de guerra" />
        </div>
        <p class="ob-meta-titulo">Escolha sua <strong>meta diária</strong> <small>(dá pra mudar depois)</small></p>
        <div class="ob-metas">
          ${META_OPCOES.map((m) => `
            <button class="ob-meta ${m.id === "regular" ? "sugerida" : ""}" data-xp="${m.xp}">
              <strong>${m.nome}</strong>
              <span>${m.xp} XP</span>
              <small>${m.desc}</small>
            </button>`).join("")}
        </div>
      </div>`;
    document.body.appendChild(ov);
    setTimeout(() => { const i = document.getElementById("ob-nome"); if (i) i.focus(); }, 100);
    ov.querySelectorAll(".ob-meta").forEach((b) => b.addEventListener("click", () => {
      const nome = (document.getElementById("ob-nome").value || "").trim();
      Gamify.definirNome(nome);
      Gamify.definirMeta(parseInt(b.dataset.xp, 10));
      Som.levelup(); Confete.disparar(120);
      ov.remove();
      this.navegar("inicio");
    }));
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
      erros: () => this.telaErros(),
      aulas: () => this.telaAulas(),
      resumos: () => this.telaResumos(),
      simulado: () => this.telaSimulado(),
      desempenho: () => this.telaDesempenho(),
      plano: () => this.telaPlano(),
      prova: () => this.telaProva(),
      perfil: () => this.telaPerfil(),
    };
    this._rota = rota;
    (telas[rota] || telas.inicio)();
    this.renderHud();
    this.renderBottomNav(rota);
    window.scrollTo(0, 0);
  },

  /* Navegação inferior estilo app (mobile) */
  renderBottomNav(rota) {
    const bn = document.getElementById("bottomnav");
    if (!bn) return;
    const grupo = { inicio: "inicio", aulas: "aulas", questoes: "questoes", erros: "questoes",
      flashcards: "questoes", simulado: "simulado", perfil: "perfil" };
    const ativo = grupo[rota] || rota;
    const itens = [
      ["inicio", "🏠", "Início"],
      ["aulas", "📘", "Aprender"],
      ["questoes", "✍️", "Praticar"],
      ["simulado", "📝", "Simular"],
      ["perfil", "🎖️", "Perfil"],
    ];
    bn.innerHTML = itens.map(([r, ic, lb]) =>
      `<button class="bn-item ${ativo === r ? "ativo" : ""}" data-bn="${r}">
        <span class="bn-ic">${ic}</span><span class="bn-lb">${lb}</span></button>`).join("");
    bn.querySelectorAll("[data-bn]").forEach((b) => b.addEventListener("click", () => {
      this.materiaSelecionada = null;
      this.navegar(b.dataset.bn);
    }));
  },

  /* Decide o "próximo passo" ideal do aluno (o botão Continuar) */
  _proximoPasso() {
    const ordem = [...SUBJECTS].sort((a, b) => a.prioridade - b.prioridade);
    for (const s of ordem) {
      const arr = (typeof AULAS !== "undefined" && AULAS[s.id]) || [];
      for (let i = 0; i < arr.length; i++) {
        if (!Store.aulaInfo(arr[i].id).dominada)
          return { tipo: "aula", materia: s.id, idx: i, titulo: arr[i].titulo, sub: `${s.nome} · Aula ${i + 1}`, cta: "Continuar aprendendo", ic: "📘" };
      }
    }
    const venc = FLASHCARDS.filter((f) => SRS.estaVencido(Store.estadoCard(f.id))).length;
    if (venc) return { tipo: "flash", titulo: `Revisar ${venc} flashcard(s)`, sub: "Revisão espaçada de hoje", cta: "Revisar agora", ic: "📇" };
    const des = Gamify.desafioHoje();
    if (!des.feito) return { tipo: "desafio", materia: des.materiaId, titulo: `Desafio: ${des.alvo} de ${des.materiaNome}`, sub: `+${des.recompensa} XP`, cta: "Encarar desafio", ic: "🎯" };
    return { tipo: "simulado", titulo: "Fazer um simulado", sub: "Modelo real da prova", cta: "Começar", ic: "📝" };
  },

  _executarProximo(p) {
    if (p.tipo === "aula") this.telaAula(p.materia, p.idx);
    else if (p.tipo === "flash") { this.materiaSelecionada = null; this.navegar("flashcards"); }
    else if (p.tipo === "desafio") { this.materiaSelecionada = p.materia; this.navegar("questoes"); }
    else this.navegar("simulado");
  },

  /* ================================================================== */
  /* HUD — barra fixa de patente / XP / ofensiva / meta                  */
  /* ================================================================== */
  renderHud() {
    const hud = document.getElementById("hud");
    if (!hud) return;
    const g = Gamify.estado();
    const p = Gamify.patente(g);
    const meta = Gamify.metaDiaria();
    hud.innerHTML = `
      <button class="hud-item hud-patente" data-hud="perfil" title="Sua patente">
        <span class="hud-simbolo">${p.atual.simbolo}</span>
        <span class="hud-txt">
          <span class="hud-nome">${p.atual.nome}</span>
          <span class="hud-xp">${g.xp} XP${p.prox ? ` · faltam ${p.faltam}` : " · MÁX"}</span>
        </span>
        <span class="hud-barra"><span class="hud-barra-fill" style="width:${p.progresso}%"></span></span>
      </button>
      <button class="hud-item hud-streak ${meta.batida ? "brilho" : ""}" data-hud="perfil" title="Ofensiva de dias">
        <span class="hud-fogo">🔥</span><span class="hud-streak-num">${g.streak.count}</span>
        ${g.freeze ? `<span class="hud-freeze" title="Protetores de ofensiva">❄️${g.freeze}</span>` : ""}
      </button>
      <button class="hud-item hud-meta" data-hud="perfil" title="Meta diária de XP">
        <span class="hud-ring" style="--pct:${meta.pct}">
          <span class="hud-ring-txt">${meta.pct}%</span>
        </span>
      </button>
      <button class="hud-item hud-som" data-hud="som" title="Ligar/desligar som">${Gamify.somAtivo() ? "🔊" : "🔇"}</button>
    `;
    hud.querySelectorAll("[data-hud='perfil']").forEach((b) => b.addEventListener("click", () => this.navegar("perfil")));
    const som = hud.querySelector("[data-hud='som']");
    if (som) som.addEventListener("click", () => { Gamify.toggleSom(); this.renderHud(); });
  },

  /* Feedback visual+sonoro de uma resposta (modo prática). */
  _feedbackResposta(ancora, r) {
    // popup de XP
    this._popupXP(ancora, `+${r.xp} XP`, r.acertou);
    if (r.acertou) {
      (r.combo >= 5 ? Som.comboAlto() : Som.acerto());
      if (r.combo >= 3) this._toastCombo(r.combo);
    } else {
      Som.erro();
    }
    this.renderHud();
    if (r.metaBatidaAgora) this._toastMeta(r.ganhoFreeze);
    if (r.semanaConcluida) setTimeout(() => this._toastSemana(r.bonusSemana), 500);
    if (r.desafio && r.desafio.concluido) this._toastDesafio(r.desafio.recompensa);
    if (r.subiuNivel || (r.desafio && r.desafio.subiuNivel)) this._modalLevelUp(r.novaPatente || (r.desafio && r.desafio.novaPatente));
    (r.novas || []).forEach((a, i) => setTimeout(() => this._toastConquista(a), 400 + i * 900));
  },

  _toastMeta(ganhoFreeze) {
    Som.conquista();
    Confete.disparar(120);
    const el = document.createElement("div");
    el.className = "toast-conquista meta";
    el.innerHTML = `<span class="tc-icone">🎯</span>
      <span class="tc-txt"><strong>Meta diária concluída!</strong><br>Ofensiva garantida hoje 🔥${ganhoFreeze ? " · +1 Protetor de Ofensiva ❄️" : ""}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("sai"), 3400);
    setTimeout(() => el.remove(), 4000);
  },

  _toastSemana(bonus) {
    Som.levelup();
    Confete.disparar(180);
    const el = document.createElement("div");
    el.className = "toast-conquista semana";
    el.innerHTML = `<span class="tc-icone">🏆</span>
      <span class="tc-txt"><strong>Desafio SEMANAL concluído!</strong><br>+${bonus} XP de bônus · +1 Protetor ❄️ · ${Gamify.frase()}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("sai"), 4000);
    setTimeout(() => el.remove(), 4600);
  },

  _toastDesafio(recompensa) {
    Som.conquista();
    Confete.disparar(110);
    const el = document.createElement("div");
    el.className = "toast-conquista desafio";
    el.innerHTML = `<span class="tc-icone">🎯</span>
      <span class="tc-txt"><strong>Desafio diário concluído!</strong><br>+${recompensa} XP de bônus · ${Gamify.frase()}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("sai"), 3600);
    setTimeout(() => el.remove(), 4200);
  },

  _popupXP(ancora, texto, positivo) {
    if (!ancora) return;
    const rect = ancora.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "xp-popup " + (positivo ? "pos" : "neg");
    el.textContent = texto;
    el.style.left = (rect.right - 60) + "px";
    el.style.top = (rect.top + window.scrollY + 4) + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  },

  _toastCombo(combo) {
    const el = document.createElement("div");
    el.className = "toast-combo";
    el.innerHTML = `⚡ COMBO x${combo}!`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  },

  _toastConquista(a) {
    Som.conquista();
    Confete.disparar(80);
    const el = document.createElement("div");
    el.className = "toast-conquista";
    el.innerHTML = `<span class="tc-icone">${a.icone}</span>
      <span class="tc-txt"><strong>Conquista desbloqueada!</strong><br>${a.nome} — ${a.desc}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("sai"), 3200);
    setTimeout(() => el.remove(), 3800);
  },

  _modalLevelUp(patente) {
    Som.levelup();
    Confete.disparar(160);
    const ov = document.createElement("div");
    ov.className = "levelup-overlay";
    ov.innerHTML = `
      <div class="levelup-card">
        <div class="levelup-simbolo">${patente.simbolo}</div>
        <div class="levelup-tag">PROMOÇÃO!</div>
        <h2>Você agora é</h2>
        <div class="levelup-nome">${patente.nome}</div>
        <div class="levelup-frase">"${Gamify.frase()}"</div>
        <button class="btn primario" id="lu-ok">Continuar 🎖️</button>
      </div>`;
    document.body.appendChild(ov);
    const fechar = () => ov.remove();
    ov.addEventListener("click", (e) => { if (e.target === ov) fechar(); });
    ov.querySelector("#lu-ok").addEventListener("click", fechar);
  },

  nomeMateria(id) {
    const s = SUBJECTS.find((x) => x.id === id);
    return s ? s.nome : id;
  },

  _aulasTotal() { return Object.values(AULAS).reduce((a, arr) => a + arr.length, 0); },
  _aulasDominadas() {
    let n = 0;
    Object.values(AULAS).forEach((arr) => arr.forEach((a) => { if (Store.aulaInfo(a.id).dominada) n++; }));
    return n;
  },

  _esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },

  _salvarBackup() {
    const nome = (Gamify.nome() || "aluno").replace(/[^a-zA-Z0-9_-]+/g, "_") || "aluno";
    const blob = new Blob([Store.exportar()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `progresso-pmgo-${nome}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    const st = document.getElementById("backup-status");
    if (st) st.innerHTML = "✅ Backup salvo! Guarde o arquivo — é a sua garantia de não perder o progresso.";
  },

  _restaurarBackup(file) {
    const st = document.getElementById("backup-status");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (Store.importar(reader.result)) {
        Som.levelup(); Confete.disparar(120);
        if (st) st.innerHTML = "✅ Progresso restaurado com sucesso!";
        setTimeout(() => { this.renderHud(); this.telaPerfil(); }, 400);
      } else {
        Som.erro();
        if (st) st.innerHTML = "❌ Arquivo inválido. Selecione um backup gerado pelo Estudo PMGO.";
      }
    };
    reader.onerror = () => { if (st) st.innerHTML = "❌ Não foi possível ler o arquivo."; };
    reader.readAsText(file);
  },

  /* Painel do admin (só o e-mail admin, e protegido pelas regras do Firestore) */
  telaAdmin() {
    window.scrollTo(0, 0);
    this.el.innerHTML = `
      <button class="voltar" id="voltar-admin">← Voltar ao perfil</button>
      <h1>👑 Painel do admin</h1>
      <p class="sub">Uso do app (dados sincronizados na nuvem). Só você enxerga isto.</p>
      <div id="admin-conteudo"><div class="vazio">Carregando…</div></div>`;
    document.getElementById("voltar-admin").addEventListener("click", () => this.navegar("perfil"));
    Cloud.listarUsuarios().then((lista) => {
      lista.sort((a, b) => b.xp - a.xp);
      const total = lista.length;
      const totalXP = lista.reduce((a, u) => a + u.xp, 0);
      const ativos = lista.filter((u) => u.atualizadoEm && (Date.now() - u.atualizadoEm) < 7 * 864e5).length;
      const cont = document.getElementById("admin-conteudo");
      if (!cont) return;
      cont.innerHTML = `
        <div class="stats-linha">
          <div class="stat"><div class="stat-valor">${total}</div><div class="stat-legenda">usuários</div></div>
          <div class="stat"><div class="stat-valor">${ativos}</div><div class="stat-legenda">ativos (7 dias)</div></div>
          <div class="stat"><div class="stat-valor">${totalXP}</div><div class="stat-legenda">XP somado</div></div>
        </div>
        <h2 class="secao-titulo">🏆 Ranking</h2>
        ${total ? `<div class="tabela-scroll"><table class="tabela">
          <thead><tr><th>#</th><th>Aluno</th><th>Patente</th><th>XP</th><th>🔥</th><th>Quest.</th><th>Simul.</th><th>Últ. acesso</th></tr></thead>
          <tbody>${lista.map((u, i) => {
            const pat = (typeof Gamify !== "undefined") ? Gamify.patente({ xp: u.xp }).atual.nome : "";
            const dt = u.atualizadoEm ? new Date(u.atualizadoEm).toLocaleDateString("pt-BR") : "—";
            const nome = this._esc(u.nome || (u.email || "").split("@")[0] || "—");
            return `<tr><td>${i + 1}</td><td>${nome}</td><td>${pat}</td><td><strong>${u.xp}</strong></td><td>${u.streak}</td><td>${u.respondidas}</td><td>${u.simulados}</td><td>${dt}</td></tr>`;
          }).join("")}</tbody>
        </table></div>` : `<div class="vazio">Ainda ninguém com progresso salvo na nuvem.</div>`}
        <button class="btn" id="admin-refresh" style="margin-top:14px">↻ Atualizar</button>`;
      const r = document.getElementById("admin-refresh");
      if (r) r.addEventListener("click", () => this.telaAdmin());
    }).catch((e) => {
      const cont = document.getElementById("admin-conteudo");
      if (cont) cont.innerHTML = `<div class="vazio">Não consegui carregar (${this._esc((e && e.message) || String(e))}).<br>
        Confirme no Firestore a <strong>regra de admin</strong> (leitura da coleção pelo seu e-mail).</div>`;
    });
  },

  /* ================================================================== */
  /* INÍCIO                                                              */
  /* ================================================================== */
  telaInicio() {
    const d = Store.carregar();
    const vencidos = FLASHCARDS.filter((f) => SRS.estaVencido(Store.estadoCard(f.id))).length;
    const respondidas = Object.keys(d.questoes).length;
    const simulados = d.simulados.length;
    const g = Gamify.estado();
    const meta = Gamify.metaDiaria();
    const des = Gamify.desafioHoje();
    const errosN = Store.idsErrados().length;
    const fala = Gamify.mascoteFala();
    const desPct = Math.min(100, Math.round((des.progresso / des.alvo) * 100));
    const prox = this._proximoPasso();
    const motiv = meta.batida
      ? `✅ Meta de hoje batida! Ofensiva de <strong>${g.streak.count} dia(s)</strong> 🔥 mantida.`
      : `🔥 Ofensiva de <strong>${g.streak.count} dia(s)</strong> · faltam <strong>${meta.meta - meta.xp} XP</strong> para bater a meta de hoje. Bora?`;

    this.el.innerHTML = `
      <section class="hero">
        <h1>Preparação <span class="grifo">Soldado PMGO</span></h1>
        <p class="sub">Calibrado pela prova real: banca <strong>${EXAM.banca}</strong>,
        Edital <strong>${EXAM.edital}</strong>. Método: recordação ativa + revisão espaçada + simulados.</p>
      </section>

      <div class="mascote-box">
        <div class="mascote-avatar">${MASCOTE.emoji}</div>
        <div class="mascote-balao">
          <div class="mascote-nome">${MASCOTE.nome}</div>
          <div class="mascote-fala">${fala}</div>
        </div>
      </div>

      <button class="continuar-card" id="continuar">
        <div class="continuar-ic">${prox.ic}</div>
        <div class="continuar-txt">
          <div class="continuar-label">${prox.cta.toUpperCase()}</div>
          <div class="continuar-titulo">${prox.titulo}</div>
          <div class="continuar-sub">${prox.sub}</div>
        </div>
        <div class="continuar-seta">▶</div>
      </button>

      <div class="motiv-banner ${meta.batida ? "ok" : ""}">${motiv}</div>

      <div class="destaque-grid">
        <div class="desafio-card ${des.feito ? "feito" : ""}">
          <div class="desafio-cab"><span>🎯 Desafio de hoje</span>${des.feito ? '<span class="tag-ok">✔ concluído</span>' : `<span>+${des.recompensa} XP</span>`}</div>
          <div class="desafio-txt">Acerte <strong>${des.alvo}</strong> questões de <strong>${des.materiaNome}</strong></div>
          <div class="barra"><div class="barra-fill" style="width:${desPct}%"></div></div>
          <div class="desafio-prog">${des.progresso}/${des.alvo}</div>
          ${des.feito ? "" : `<button class="btn primario btn-pequeno" id="ir-desafio">Encarar desafio →</button>`}
        </div>
        <button class="erros-card ${errosN ? "tem" : ""}" id="ir-erros">
          <div class="erros-icone">🔁</div>
          <div class="erros-num">${errosN}</div>
          <div class="erros-leg">${errosN ? "questões no seu caderno de erros" : "caderno de erros limpo 🎉"}</div>
        </button>
      </div>

      <div class="faixa-regra">
        🎯 <strong>Regra de aprovação:</strong> acertar ≥ <strong>${EXAM.minPontos} pontos</strong>
        (60% dos ${EXAM.pontosObjetiva}) <u>e não zerar em nenhuma matéria</u>.
        Redação vale ${EXAM.pontosRedacao} pontos à parte (mín. ${EXAM.redacaoMin}).
      </div>

      <div class="cards-grid">
        ${this._cardResumo("📘", "Aulas dominadas", `${this._aulasDominadas()}/${this._aulasTotal()}`, "aprenda do zero + teste", "aulas", "ok")}
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
    const irDes = document.getElementById("ir-desafio");
    if (irDes) irDes.addEventListener("click", () => { this.materiaSelecionada = des.materiaId; this.navegar("questoes"); });
    const irErr = document.getElementById("ir-erros");
    if (irErr) irErr.addEventListener("click", () => this.navegar("erros"));
    const cont = document.getElementById("continuar");
    if (cont) cont.addEventListener("click", () => this._executarProximo(prox));
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
        const q = parseInt(b.dataset.q, 10);
        const novo = SRS.revisar(Store.estadoCard(card.id), q);
        Store.atualizarCard(card.id, novo);
        const r = Gamify.flashcard(q);
        this._popupXP(b, `+${r.xp} XP`, true);
        if (q >= 3) Som.acerto(); else Som.erro();
        this.renderHud();
        if (r.metaBatidaAgora) this._toastMeta(r.ganhoFreeze);
        if (r.semanaConcluida) setTimeout(() => this._toastSemana(r.bonusSemana), 500);
        if (r.subiuNivel) this._modalLevelUp(r.novaPatente);
        (r.novas || []).forEach((a, i) => setTimeout(() => this._toastConquista(a), 300 + i * 900));
        this._mostrarProximoCard(lista, idx + 1);
      });
    });
  },

  /* ================================================================== */
  /* QUESTÕES                                                            */
  /* ================================================================== */
  telaQuestoes() {
    Gamify.resetCombo();
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
          Store.registrarQuestao(q, acertou);
          const r = Gamify.responder(acertou, q.materia);
          bloco.querySelector(".resultado").innerHTML = acertou
            ? `<span class="tag-ok">✔ Você acertou! +${r.xp} XP${r.combo >= 2 ? ` · combo x${r.combo}` : ""}</span>`
            : `<span class="tag-err">✘ Resposta incorreta · +${r.xp} XP</span>`;
          this._feedbackResposta(alt, r);
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
  /* ERROS — caderno de erros (revisar só o que errei)                   */
  /* ================================================================== */
  telaErros() {
    Gamify.resetCombo();
    const ids = Store.idsErrados();
    const lista = QUESTIONS.filter((q) => ids.includes(q.id));
    this.el.innerHTML = `
      <h1>🔁 Caderno de erros</h1>
      <p class="sub">Aqui ficam só as questões que você <strong>errou</strong>. Acertar aqui remove a
      questão do caderno. Revisar o próprio erro é a forma mais rápida de virar o jogo.</p>
      ${lista.length ? `<div class="frase-mini">💬 ${Gamify.frase()}</div>` : ""}
      <div id="area-questoes"></div>`;
    if (!lista.length) {
      document.getElementById("area-questoes").innerHTML = `
        <div class="parabens">
          <div class="parabens-icone">🎉</div>
          <h2>Caderno de erros limpo!</h2>
          <p>Você não tem questões erradas pendentes. Continue praticando para manter assim.</p>
          <button class="btn primario" id="ir-questoes">Praticar questões</button>
        </div>`;
      document.getElementById("ir-questoes").addEventListener("click", () => { this.materiaSelecionada = null; this.navegar("questoes"); });
      return;
    }
    this._renderQuestoes(lista);
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

    // Gamificação: XP em lote + celebração
    const gr = Gamify.simulado(res, aprovado);
    if (aprovado || perc === 100) Confete.disparar(perc === 100 ? 200 : 130);
    if (gr.metaBatidaAgora) setTimeout(() => this._toastMeta(gr.ganhoFreeze), 300);
    if (gr.semanaConcluida) setTimeout(() => this._toastSemana(gr.bonusSemana), 700);
    if (gr.subiuNivel) setTimeout(() => this._modalLevelUp(gr.novaPatente), 300);
    (gr.novas || []).forEach((a, i) => setTimeout(() => this._toastConquista(a), 600 + i * 900));

    this.el.innerHTML = `
      <div class="resultado-simulado ${aprovado ? "aprovado" : "reprovado"}">
        <div class="nota-grande">${perc}%</div>
        <p>${res.acertos} de ${res.total} questões · ${min}min ${seg}s</p>
        <p class="veredito">${veredito}</p>
        <p class="xp-ganho">⭐ +${gr.xp} XP ganhos!</p>
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
    this.renderHud();
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
  /* AULAS — trilha de aprendizado (aprender + testar)                   */
  /* ================================================================== */
  telaAulas() {
    const ordenadas = [...SUBJECTS].sort((a, b) => a.prioridade - b.prioridade || b.pontos - a.pontos)
      .filter((s) => (AULAS[s.id] || []).length);
    // progresso global
    let total = 0, dom = 0;
    ordenadas.forEach((s) => (AULAS[s.id] || []).forEach((a) => { total++; if (Store.aulaInfo(a.id).dominada) dom++; }));
    const pctGlobal = total ? Math.round((dom / total) * 100) : 0;

    this.el.innerHTML = `
      <h1>📘 Trilha de aulas</h1>
      <p class="sub">Aqui você <strong>aprende do zero</strong>: leia a aula e, no fim, faça o
      <strong>teste de fixação</strong>. Acertando 70%+, a aula é marcada como <strong>dominada</strong> ✅.
      Estude na ordem de prioridade — de cima para baixo.</p>

      <div class="trilha-progresso">
        <div class="barra"><div class="barra-fill" style="width:${pctGlobal}%"></div></div>
        <span>${dom}/${total} aulas dominadas · ${pctGlobal}%</span>
      </div>

      <div class="frase-mini">💬 ${Gamify.frase()}</div>

      ${ordenadas.map((s) => this._blocoAulasMateria(s)).join("")}
    `;
    this.el.querySelectorAll("[data-aula]").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.bloq) {
          Som.erro();
          b.classList.add("shake");
          setTimeout(() => b.classList.remove("shake"), 420);
          this._toastSimples("🔒 Conclua a aula anterior para desbloquear");
          return;
        }
        this.telaAula(b.dataset.materia, parseInt(b.dataset.aula, 10));
      }));
  },

  _toastSimples(txt) {
    const el = document.createElement("div");
    el.className = "toast-simples";
    el.textContent = txt;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  },

  _blocoAulasMateria(s) {
    const aulas = AULAS[s.id] || [];
    const dom = aulas.filter((a) => Store.aulaInfo(a.id).dominada).length;
    const pct = aulas.length ? Math.round((dom / aulas.length) * 100) : 0;
    let atualMarcado = false;
    const nodes = aulas.map((a, i) => {
      const info = Store.aulaInfo(a.id);
      const desbloq = i === 0 || Store.aulaInfo(aulas[i - 1].id).dominada;
      let estado;
      if (info.dominada) estado = "dom";
      else if (desbloq && !atualMarcado) { estado = "atual"; atualMarcado = true; }
      else if (desbloq) estado = "livre";
      else estado = "bloq";
      const ic = estado === "dom" ? "✅" : (estado === "bloq" ? "🔒" : "★");
      const lado = i % 2 === 0 ? "no-esq" : "no-dir";
      return `<div class="no-wrap ${lado}">
        <button class="no ${estado}" data-aula="${i}" data-materia="${s.id}"${estado === "bloq" ? ' data-bloq="1"' : ""} title="${a.titulo}">
          <span class="no-ic">${ic}</span>
          ${estado === "atual" ? '<span class="no-badge">COMEÇAR</span>' : ""}
        </button>
        <span class="no-label">${a.titulo}</span>
      </div>`;
    }).join("");
    return `
      <div class="aulas-materia" style="--cor:${s.cor}">
        <div class="aulas-mat-cab">
          <span class="materia-nome">${s.nome}</span>
          <span class="aulas-mat-prog">${dom}/${aulas.length} ✅</span>
        </div>
        <div class="barra"><div class="barra-fill" style="width:${pct}%"></div></div>
        <div class="trilha-path">${nodes}</div>
      </div>`;
  },

  telaAula(materiaId, idx) {
    const aulas = AULAS[materiaId] || [];
    const aula = aulas[idx];
    if (!aula) return this.telaAulas();
    const s = SUBJECTS.find((x) => x.id === materiaId);
    const info = Store.aulaInfo(aula.id);

    this.el.innerHTML = `
      <button class="voltar" id="voltar">← Voltar às aulas</button>
      <section class="hero compacto" style="--cor:${s.cor}">
        <h1>${aula.titulo}</h1>
        <p class="sub">${s.nome} · ${aula.min} min de leitura ${info.dominada ? "· ✅ dominada" : ""}</p>
      </section>

      <article class="aula-conteudo">
        ${aula.blocos.map((b) => this._blocoAula(b)).join("")}
      </article>

      <div class="aula-cta">
        <p>Leu com atenção? Agora prove que aprendeu. Você precisa de <strong>70%</strong> para dominar a aula.</p>
        <button class="btn primario" id="testar">📝 Fazer o teste de fixação (${aula.questoes.length} questões)</button>
      </div>
    `;
    document.getElementById("voltar").addEventListener("click", () => this.navegar("aulas"));
    document.getElementById("testar").addEventListener("click", () => this._testeAula(materiaId, idx));
  },

  _blocoAula(b) {
    if (b.h) return `<h3 class="aula-h">${b.h}</h3>`;
    if (b.p) return `<p class="aula-p">${b.p}</p>`;
    if (b.box) return `<div class="aula-box">💡 ${b.box}</div>`;
    if (b.ex) return `<div class="aula-ex"><strong>Exemplo/macete:</strong> ${b.ex}</div>`;
    if (b.lista) return `<ul class="aula-lista">${b.lista.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    return "";
  },

  _testeAula(materiaId, idx) {
    Gamify.resetCombo();
    const aula = AULAS[materiaId][idx];
    const qById = (id) => QUESTIONS.find((q) => q.id === id);
    const prova = aula.questoes.map(qById).filter(Boolean);
    const respostas = new Array(prova.length).fill(null);
    let atual = 0, acertos = 0, xpSessao = 0, maxCombo = 0;
    const inicioT = Date.now();

    const render = () => {
      const q = prova[atual];
      const letras = ["A", "B", "C", "D", "E"];
      const respondida = respostas[atual] !== null;
      this.el.innerHTML = `
        <div class="simulado-topo">
          <span>Teste de fixação · ${atual + 1}/${prova.length}</span>
          <span class="chip" style="--cor:${SUBJECTS.find((s) => s.id === materiaId).cor}">${aula.titulo}</span>
        </div>
        <div class="barra"><div class="barra-fill" style="width:${(atual / prova.length) * 100}%"></div></div>
        <article class="questao destaque">
          <p class="questao-enunciado">${q.enunciado}</p>
          <div class="alternativas">
            ${q.alternativas.map((a, ai) => {
              let cls = "";
              if (respondida) {
                if (ai === q.correta) cls = "correta";
                else if (ai === respostas[atual]) cls = "errada";
              }
              return `<button class="alt ${cls}" data-i="${ai}" ${respondida ? "disabled" : ""}>
                <span class="alt-letra">${letras[ai]}</span><span class="alt-texto">${a}</span></button>`;
            }).join("")}
          </div>
          ${respondida ? `<div class="explicacao"><strong>💡</strong> ${q.explicacao}</div>` : ""}
        </article>
        <div class="simulado-nav">
          <span></span>
          ${respondida ? `<button class="btn primario" id="prox">${atual === prova.length - 1 ? "Ver resultado" : "Próxima →"}</button>` : ""}
        </div>`;
      this.el.querySelectorAll(".alt").forEach((alt) => {
        alt.addEventListener("click", () => {
          if (respostas[atual] !== null) return;
          const esc = parseInt(alt.dataset.i, 10);
          respostas[atual] = esc;
          const acertou = esc === prova[atual].correta;
          if (acertou) acertos++;
          Store.registrarQuestao(prova[atual], acertou);
          const r = Gamify.responder(acertou, prova[atual].materia);
          xpSessao += r.xp; maxCombo = Math.max(maxCombo, r.combo || 0);
          this._feedbackResposta(alt, r);
          render();
        });
      });
      const prox = document.getElementById("prox");
      if (prox) prox.addEventListener("click", () => {
        if (atual === prova.length - 1) finalizar();
        else { atual++; render(); }
      });
    };

    const finalizar = () => {
      const pct = Math.round((acertos / prova.length) * 100);
      const dominou = pct >= 70;
      Store.marcarAula(aula.id, pct);
      const seg = Math.round((Date.now() - inicioT) / 1000);
      const tempo = seg < 60 ? `${seg}s` : `${Math.floor(seg / 60)}min ${seg % 60}s`;
      if (dominou) { Confete.disparar(160); Som.levelup(); } else { Som.erro(); }
      this.el.innerHTML = `
        <div class="sessao-fim ${dominou ? "ok" : "quase"}">
          <div class="sessao-emoji">${dominou ? "🎉" : "💪"}</div>
          <h1>${dominou ? "Aula dominada!" : "Quase lá!"}</h1>
          <p class="sessao-sub">${dominou
            ? "Você provou que aprendeu. Bora pra próxima!"
            : "Releia a aula com calma e refaça — você precisa de 70%."}</p>
        </div>
        <div class="sessao-tiles">
          <div class="stile amarelo"><div class="stile-lb">XP GANHO</div><div class="stile-vl">+${xpSessao}</div></div>
          <div class="stile ${dominou ? "verde" : "laranja"}"><div class="stile-lb">PRECISÃO</div><div class="stile-vl">${pct}%</div></div>
          <div class="stile azul"><div class="stile-lb">MELHOR COMBO</div><div class="stile-vl">${maxCombo}⚡</div></div>
        </div>
        <div class="sessao-tempo">⏱️ ${tempo} · ${acertos}/${prova.length} acertos</div>
        <div class="frase-mini" style="text-align:center">💬 ${Gamify.frase()}</div>
        <div class="acoes-materia" style="justify-content:center">
          ${dominou ? `<button class="btn primario" id="proxima">Próxima aula →</button>` : `<button class="btn primario" id="reler">📖 Reler a aula</button>`}
          <button class="btn" id="voltar-trilha">Voltar à trilha</button>
        </div>`;
      this.renderHud();
      const volt = document.getElementById("voltar-trilha");
      if (volt) volt.addEventListener("click", () => this.navegar("aulas"));
      const rel = document.getElementById("reler");
      if (rel) rel.addEventListener("click", () => this.telaAula(materiaId, idx));
      const prx = document.getElementById("proxima");
      if (prx) prx.addEventListener("click", () => {
        const aulas = AULAS[materiaId];
        if (idx + 1 < aulas.length) this.telaAula(materiaId, idx + 1);
        else this.navegar("aulas");
      });
    };

    render();
  },

  /* ================================================================== */
  /* PERFIL — patente, ofensiva, meta e conquistas                       */
  /* ================================================================== */
  telaPerfil() {
    const g = Gamify.estado();
    const p = Gamify.patente(g);
    const meta = Gamify.metaDiaria();
    const totalConq = ACHIEVEMENTS.length;
    const desbloqueadas = Object.keys(g.conquistas).length;
    const acerto = g.stats.respondidas ? Math.round((g.stats.acertos / g.stats.respondidas) * 100) : 0;

    const nome = Gamify.nome();
    this.el.innerHTML = `
      <h2 class="secao-titulo" style="margin-top:4px">☁️ Conta</h2>
      ${this._cardConta()}
      ${(typeof Cloud !== "undefined" && Cloud.ehAdmin && Cloud.ehAdmin())
        ? `<button class="btn primario btn-pequeno" id="abrir-admin" style="margin-top:10px">👑 Painel do admin</button>` : ""}

      <div class="perfil-hero">
        <div class="perfil-brasao">${p.atual.simbolo}</div>
        <div class="perfil-nome-grande">${nome ? this._esc(nome) : "Defina seu nome"}
          <button class="editar-nome" id="edit-nome" title="Editar nome">✏️</button></div>
        <div class="perfil-patente">${p.atual.nome}</div>
        <div class="perfil-xp">${g.xp} XP total</div>
        <div class="perfil-prog">
          <div class="barra"><div class="barra-fill" style="width:${p.progresso}%"></div></div>
          <span>${p.prox ? `${p.faltam} XP para ${p.prox.nome}` : "Patente máxima alcançada! 🏆"}</span>
        </div>
      </div>

      <div class="perfil-cards">
        <div class="pcard">
          <div class="pcard-icone">🔥</div>
          <div class="pcard-num">${g.streak.count}</div>
          <div class="pcard-leg">dias de ofensiva</div>
        </div>
        <div class="pcard">
          <div class="hud-ring grande" style="--pct:${meta.pct}"><span class="hud-ring-txt">${meta.pct}%</span></div>
          <div class="pcard-leg">meta de hoje<br>${meta.xp}/${meta.meta} XP</div>
        </div>
        <div class="pcard">
          <div class="pcard-icone">❄️</div>
          <div class="pcard-num">${g.freeze}</div>
          <div class="pcard-leg">protetores de ofensiva</div>
        </div>
      </div>

      <h2 class="secao-titulo">🎯 Meta diária</h2>
      <div class="meta-opcoes">
        ${META_OPCOES.map((m) => `
          <button class="meta-opcao ${g.metaXp === m.xp ? "ativa" : ""}" data-meta="${m.xp}">
            <strong>${m.nome}</strong><span>${m.xp} XP</span><small>${m.desc}</small>
          </button>`).join("")}
      </div>

      <div class="stats-linha">
        <div class="stat"><div class="stat-valor">${g.stats.respondidas}</div><div class="stat-legenda">questões</div></div>
        <div class="stat"><div class="stat-valor">${acerto}%</div><div class="stat-legenda">de acerto</div></div>
        <div class="stat"><div class="stat-valor">${g.stats.melhorCombo}</div><div class="stat-legenda">melhor combo</div></div>
      </div>

      <div class="mascote-box">
        <div class="mascote-avatar">${MASCOTE.emoji}</div>
        <div class="mascote-balao">
          <div class="mascote-nome">${MASCOTE.nome}</div>
          <div class="mascote-fala">${Gamify.mascoteFala()}</div>
        </div>
      </div>

      <h2 class="secao-titulo">📈 Evolução da semana (XP por dia)</h2>
      ${this._graficoSemana()}

      <h2 class="secao-titulo">🎯 Desafio de hoje</h2>
      ${this._cardDesafioPerfil()}

      <h2 class="secao-titulo">🏆 Desafio semanal</h2>
      ${this._cardDesafioSemana()}

      <h2 class="secao-titulo">🏅 Conquistas</h2>
      <div class="conquistas-grid">
        ${ACHIEVEMENTS.map((a) => {
          const ok = !!g.conquistas[a.id];
          return `<div class="conquista ${ok ? "ok" : "bloq"}">
            <div class="conq-icone">${ok ? a.icone : "🔒"}</div>
            <div class="conq-nome">${a.nome}</div>
            <div class="conq-desc">${a.desc}</div>
          </div>`;
        }).join("")}
      </div>

      <h2 class="secao-titulo">🎖️ Escada de patentes</h2>
      <div class="patentes-lista">
        ${PATENTES.map((pt, i) => `
          <div class="patente-linha ${i === p.nivel ? "atual" : ""} ${g.xp >= pt.xp ? "conquistada" : ""}">
            <span class="pt-simbolo">${pt.simbolo}</span>
            <span class="pt-nome">${pt.nome}</span>
            <span class="pt-xp">${pt.xp} XP</span>
          </div>`).join("")}
      </div>

      <h2 class="secao-titulo">💾 Meu progresso</h2>
      <div class="progresso-box">
        <p>Seu progresso (provas, aulas, XP, ofensiva) é <strong>salvo automaticamente</strong> neste
        navegador. Para não perder ao trocar de aparelho ou limpar o histórico, guarde um
        <strong>backup</strong> e restaure quando quiser.</p>
        <div class="progresso-acoes">
          <button class="btn primario" id="salvar-backup">⬇️ Salvar backup</button>
          <button class="btn" id="restaurar-backup">⬆️ Restaurar backup</button>
          <input type="file" id="arquivo-backup" accept="application/json,.json" hidden />
        </div>
        <div class="progresso-status" id="backup-status"></div>
      </div>

      <div class="acoes-materia" style="margin-top:20px">
        <button class="btn" id="toggle-som">${Gamify.somAtivo() ? "🔊 Som ligado" : "🔇 Som desligado"}</button>
        <button class="btn perigo" id="zerar-tudo">🗑 Zerar tudo</button>
      </div>
    `;
    document.getElementById("toggle-som").addEventListener("click", (e) => {
      const on = Gamify.toggleSom();
      e.target.textContent = on ? "🔊 Som ligado" : "🔇 Som desligado";
      if (on) Som.acerto();
      this.renderHud();
    });
    document.getElementById("edit-nome").addEventListener("click", () => {
      const atual = Gamify.nome();
      const n = window.prompt("Como quer ser chamado(a)?", atual);
      if (n !== null) { Gamify.definirNome(n.trim()); Som.acerto(); this.telaPerfil(); }
    });
    this._bindConta();
    const adminBtn = document.getElementById("abrir-admin");
    if (adminBtn) adminBtn.addEventListener("click", () => this.telaAdmin());
    document.getElementById("salvar-backup").addEventListener("click", () => this._salvarBackup());
    const inputBk = document.getElementById("arquivo-backup");
    document.getElementById("restaurar-backup").addEventListener("click", () => inputBk.click());
    inputBk.addEventListener("change", (e) => this._restaurarBackup(e.target.files[0]));
    document.getElementById("zerar-tudo").addEventListener("click", () => {
      if (window.confirm("Isso apaga TODO o seu progresso (provas, XP, ofensiva). Tem certeza?\nDica: salve um backup antes.")) {
        Store.resetar();
        try { const d = Store.carregar(); d.gamify = Gamify._default(); Store.salvar(); } catch (err) {}
        location.reload ? location.reload() : this.navegar("inicio");
      }
    });
    const pd = document.getElementById("perfil-desafio");
    if (pd) pd.addEventListener("click", () => { this.materiaSelecionada = Gamify.desafioHoje().materiaId; this.navegar("questoes"); });
    this.el.querySelectorAll("[data-meta]").forEach((b) => b.addEventListener("click", () => {
      Gamify.definirMeta(parseInt(b.dataset.meta, 10));
      Som.acerto();
      this.telaPerfil();
    }));
  },

  _graficoSemana() {
    const semana = Gamify.historicoSemana();
    const max = Math.max(10, ...semana.map((d) => d.xp));
    return `<div class="grafico-semana">
      ${semana.map((d) => {
        const h = Math.round((d.xp / max) * 100);
        return `<div class="gs-col">
          <div class="gs-valor">${d.xp || ""}</div>
          <div class="gs-barra-wrap"><div class="gs-barra ${d.hoje ? "hoje" : ""}" style="height:${Math.max(3, h)}%"></div></div>
          <div class="gs-label ${d.hoje ? "hoje" : ""}">${d.label}</div>
        </div>`;
      }).join("")}
    </div>`;
  },

  _cardDesafioPerfil() {
    const des = Gamify.desafioHoje();
    const pct = Math.min(100, Math.round((des.progresso / des.alvo) * 100));
    return `<div class="desafio-card ${des.feito ? "feito" : ""}">
      <div class="desafio-cab"><span>🎯 ${des.materiaNome}</span>${des.feito ? '<span class="tag-ok">✔ concluído</span>' : `<span>+${des.recompensa} XP</span>`}</div>
      <div class="desafio-txt">Acerte <strong>${des.alvo}</strong> questões desta matéria hoje</div>
      <div class="barra"><div class="barra-fill" style="width:${pct}%"></div></div>
      <div class="desafio-prog">${des.progresso}/${des.alvo}</div>
      ${des.feito ? "" : `<button class="btn primario btn-pequeno" id="perfil-desafio">Ir agora →</button>`}
    </div>`;
  },

  _cardConta() {
    const ok = (typeof Cloud !== "undefined") && Cloud.disponivel();
    if (!ok) {
      return `<div class="conta-box">
        <p>☁️ O login na nuvem ainda <strong>não foi configurado</strong> neste app.
        Enquanto isso, seu progresso fica salvo neste aparelho e você pode usar o
        <strong>backup</strong> abaixo. Assim que o Firebase estiver configurado, o login aparece aqui.</p>
      </div>`;
    }
    const u = Cloud.usuario();
    if (u) {
      return `<div class="conta-box logado">
        <p>✅ Conectado como <strong>${this._esc(u.email || "conta Google")}</strong>.<br>
        Seu progresso está <strong>sincronizado na nuvem</strong> — não se perde mesmo trocando de aparelho.</p>
        <button class="btn" id="conta-sair">Sair</button>
      </div>`;
    }
    return `<div class="conta-box">
      <p>Entre para salvar seu progresso na nuvem e <strong>nunca perder</strong> — funciona em qualquer aparelho.</p>
      <input id="conta-email" type="email" placeholder="seu@email.com" autocomplete="email" />
      <input id="conta-senha" type="password" placeholder="senha (mín. 6 caracteres)" autocomplete="current-password" />
      <div class="conta-acoes">
        <button class="btn primario" id="conta-entrar">Entrar</button>
        <button class="btn" id="conta-criar">Criar conta</button>
      </div>
      <button class="btn conta-google" id="conta-google">🔵 Entrar com Google</button>
      <button class="conta-link" id="conta-esqueci">Esqueci a senha</button>
      <div class="conta-status" id="conta-status"></div>
    </div>`;
  },

  _bindConta() {
    const ok = (typeof Cloud !== "undefined") && Cloud.disponivel();
    if (!ok) return;
    const status = () => document.getElementById("conta-status");
    const msg = (t, erro) => { const s = status(); if (s) { s.textContent = t; s.className = "conta-status" + (erro ? " erro" : " ok"); } };
    const val = (id) => (document.getElementById(id) || {}).value || "";
    const sair = document.getElementById("conta-sair");
    if (sair) sair.addEventListener("click", () => { Cloud.sair().then(() => this.telaPerfil()); });
    const entrar = document.getElementById("conta-entrar");
    if (entrar) entrar.addEventListener("click", () => {
      msg("Entrando...");
      Cloud.entrar(val("conta-email").trim(), val("conta-senha"))
        .then(() => { Som.levelup(); }).catch((e) => msg(Cloud.erroPt(e), true));
    });
    const criar = document.getElementById("conta-criar");
    if (criar) criar.addEventListener("click", () => {
      msg("Criando conta...");
      Cloud.cadastrar(val("conta-email").trim(), val("conta-senha"))
        .then(() => { Som.conquista(); Confete.disparar(80); }).catch((e) => msg(Cloud.erroPt(e), true));
    });
    const google = document.getElementById("conta-google");
    if (google) google.addEventListener("click", () => {
      msg("Abrindo Google...");
      Cloud.entrarGoogle().then(() => { Som.levelup(); }).catch((e) => msg(Cloud.erroPt(e), true));
    });
    const esq = document.getElementById("conta-esqueci");
    if (esq) esq.addEventListener("click", () => {
      const email = val("conta-email").trim();
      if (!email) { msg("Digite seu e-mail acima primeiro.", true); return; }
      Cloud.redefinirSenha(email).then(() => msg("Enviei um e-mail para redefinir a senha."))
        .catch((e) => msg(Cloud.erroPt(e), true));
    });
  },

  _cardDesafioSemana() {
    const d = Gamify.desafioSemana();
    return `<div class="desafio-card semana ${d.feito ? "feito" : ""}">
      <div class="desafio-cab"><span>🏆 XP da semana</span>${d.feito ? '<span class="tag-ok">✔ concluído</span>' : `<span>+${d.recompensa} XP · ❄️</span>`}</div>
      <div class="desafio-txt">Some <strong>${d.alvo} XP</strong> de segunda a domingo (${Gamify.metaAtual()} × 5 dias)</div>
      <div class="barra"><div class="barra-fill" style="width:${d.pct}%"></div></div>
      <div class="desafio-prog">${d.xp}/${d.alvo} XP</div>
    </div>`;
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
