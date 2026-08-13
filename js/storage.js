/* =========================================================================
   ARMAZENAMENTO LOCAL — progresso do aluno (localStorage)
   -------------------------------------------------------------------------
   Guarda: estado dos flashcards (SRS), histórico de questões, resultados de
   simulados e estatísticas por matéria. Tudo fica no navegador do usuário.
   ========================================================================= */

const Store = {
  CHAVE: "pmgo_estudo_v1",

  _dados: null,

  _padrao() {
    return {
      cards: {},          // { cardId: estadoSRS }
      questoes: {},       // { questaoId: { tentativas, acertos, ultima } }
      erradas: {},        // { questaoId: true }  — última resposta foi errada
      aulas: {},          // { aulaId: { dominada:bool, melhorPct } }
      simulados: [],      // [{ data, total, acertos, tempo, porMateria }]
      estatMateria: {},   // { materiaId: { respondidas, acertos } }
      criadoEm: Date.now(),
    };
  },

  carregar() {
    if (this._dados) return this._dados;
    try {
      const raw = localStorage.getItem(this.CHAVE);
      this._dados = raw ? JSON.parse(raw) : this._padrao();
    } catch (e) {
      this._dados = this._padrao();
    }
    return this._dados;
  },

  salvar() {
    try {
      localStorage.setItem(this.CHAVE, JSON.stringify(this._dados));
    } catch (e) {
      console.warn("Não foi possível salvar o progresso:", e);
    }
  },

  // ---- Flashcards ----
  estadoCard(id) {
    const d = this.carregar();
    if (!d.cards[id]) d.cards[id] = SRS.novoCard();
    return d.cards[id];
  },
  atualizarCard(id, estado) {
    const d = this.carregar();
    d.cards[id] = estado;
    this.salvar();
  },

  // ---- Questões ----
  registrarQuestao(questao, acertou) {
    const d = this.carregar();
    const q = d.questoes[questao.id] || { tentativas: 0, acertos: 0, ultima: null };
    q.tentativas += 1;
    if (acertou) q.acertos += 1;
    q.ultima = Date.now();
    d.questoes[questao.id] = q;

    // caderno de erros: entra ao errar, sai ao acertar
    if (!d.erradas) d.erradas = {};
    if (acertou) delete d.erradas[questao.id];
    else d.erradas[questao.id] = true;

    const m = d.estatMateria[questao.materia] || { respondidas: 0, acertos: 0 };
    m.respondidas += 1;
    if (acertou) m.acertos += 1;
    d.estatMateria[questao.materia] = m;

    this.salvar();
  },

  idsErrados() {
    const d = this.carregar();
    return Object.keys(d.erradas || {});
  },

  // ---- Aulas (trilha de aprendizado) ----
  marcarAula(aulaId, pct) {
    const d = this.carregar();
    if (!d.aulas) d.aulas = {};
    const a = d.aulas[aulaId] || { dominada: false, melhorPct: 0 };
    a.melhorPct = Math.max(a.melhorPct, pct);
    if (pct >= 70) a.dominada = true;
    d.aulas[aulaId] = a;
    this.salvar();
    return a;
  },
  aulaInfo(aulaId) {
    const d = this.carregar();
    return (d.aulas && d.aulas[aulaId]) || { dominada: false, melhorPct: 0 };
  },

  // ---- Simulados ----
  registrarSimulado(resultado) {
    const d = this.carregar();
    d.simulados.push(resultado);
    this.salvar();
  },

  // ---- Utilidades ----
  resetar() {
    this._dados = this._padrao();
    this.salvar();
  },

  exportar() {
    return JSON.stringify(this.carregar(), null, 2);
  },

  importar(json) {
    try {
      const obj = JSON.parse(json);
      if (!obj || typeof obj !== "object" ||
          (!("gamify" in obj) && !("simulados" in obj) && !("cards" in obj))) return false;
      this._dados = obj;
      this.salvar();
      return true;
    } catch (e) {
      return false;
    }
  },
};
