/* =========================================================================
   GAMIFICAÇÃO — o que vicia o aluno a aprender
   -------------------------------------------------------------------------
   Sistema de PATENTES (XP), OFENSIVA de dias (streak), COMBO de acertos,
   META diária, CONQUISTAS, SONS e CONFETE. Tudo persistido no localStorage.
   ========================================================================= */

/* ---- Escada de patentes (sobe conforme o XP total) ------------------------ */
const PATENTES = [
  { nome: "Recruta",            xp: 0,     simbolo: "🔰" },
  { nome: "Soldado 2ª Classe",  xp: 100,   simbolo: "🎖️" },
  { nome: "Soldado 1ª Classe",  xp: 300,   simbolo: "🎖️" },
  { nome: "Cabo",               xp: 600,   simbolo: "⋀" },
  { nome: "3º Sargento",        xp: 1000,  simbolo: "⋀⋀" },
  { nome: "2º Sargento",        xp: 1600,  simbolo: "⋀⋀⋀" },
  { nome: "1º Sargento",        xp: 2400,  simbolo: "★" },
  { nome: "Subtenente",         xp: 3400,  simbolo: "★☆" },
  { nome: "Aspirante a Oficial",xp: 4600,  simbolo: "◆" },
  { nome: "2º Tenente",         xp: 6000,  simbolo: "◆◆" },
  { nome: "1º Tenente",         xp: 7600,  simbolo: "◆◆◆" },
  { nome: "Capitão",            xp: 9400,  simbolo: "◆◆◆◆" },
  { nome: "Major",              xp: 11400, simbolo: "✶" },
  { nome: "Tenente-Coronel",    xp: 13600, simbolo: "✶✶" },
  { nome: "Coronel",            xp: 16000, simbolo: "✶✶✶" },
];

const META_DIARIA_XP = 50;

/* ---- Mascote e frases motivacionais -------------------------------------- */
const MASCOTE = { nome: "Sgt. Coruja", emoji: "🦉" };

const FRASES = [
  "A farda que você sonha se conquista uma questão por vez.",
  "Disciplina é escolher o que você quer MAIS do que o que você quer AGORA.",
  "Cada acerto de hoje é um concorrente a menos amanhã.",
  "O aprovado é o desistente que tentou mais uma vez.",
  "Não conte os dias. Faça os dias contarem.",
  "A aprovação não é sorte: é constância disfarçada de talento.",
  "Estudar cansa. Reprovar cansa mais.",
  "Sua futura patente começa no material de hoje.",
  "Foco no edital, olhos na farda. 🎖️",
  "Quem domina o básico com constância, vence o avançado.",
  "1% melhor por dia é um aprovado no fim do ano.",
  "Enquanto você treina, você vence. Continue.",
  "Dor de estudar é temporária. Orgulho da posse é para sempre.",
  "Você não precisa ser o mais inteligente — precisa ser o mais constante.",
  "O simulado é o campo de treino. A prova é a batalha. Treine mais.",
  "Errar é dado, não derrota: cada erro corrigido é ponto garantido.",
  "A meta não muda. Só a sua determinação de bater ela hoje.",
  "Grandes aprovações são feitas de pequenos dias de estudo.",
  "Ninguém sente sua vontade. Todo mundo vê seu resultado.",
  "Respira, foca e resolve mais uma. É assim que se passa.",
];

/* ---- Conquistas (medalhas) ------------------------------------------------ */
const ACHIEVEMENTS = [
  { id: "tiro1",    icone: "🎯", nome: "Primeiro Tiro",   desc: "Responda sua 1ª questão",         cond: (g) => g.stats.respondidas >= 1 },
  { id: "estudante",icone: "📚", nome: "Estudante",        desc: "Responda 50 questões",            cond: (g) => g.stats.respondidas >= 50 },
  { id: "veterano", icone: "🧠", nome: "Veterano",         desc: "Responda 200 questões",           cond: (g) => g.stats.respondidas >= 200 },
  { id: "mestre",   icone: "👑", nome: "Mestre dos Editais",desc: "Responda 500 questões",          cond: (g) => g.stats.respondidas >= 500 },
  { id: "combo10",  icone: "⚡", nome: "Combo x10",        desc: "10 acertos seguidos",             cond: (g) => g.stats.melhorCombo >= 10 },
  { id: "combo25",  icone: "🌟", nome: "Imparável",        desc: "25 acertos seguidos",             cond: (g) => g.stats.melhorCombo >= 25 },
  { id: "streak3",  icone: "🔥", nome: "Ofensiva de 3",    desc: "Estude 3 dias seguidos",          cond: (g) => g.streak.count >= 3 },
  { id: "streak7",  icone: "🔥", nome: "Ofensiva de 7",    desc: "Estude 7 dias seguidos",          cond: (g) => g.streak.count >= 7 },
  { id: "streak30", icone: "🏆", nome: "Ofensiva de 30",   desc: "Estude 30 dias seguidos",         cond: (g) => g.streak.count >= 30 },
  { id: "flash50",  icone: "🃏", nome: "Revisor",          desc: "Revise 50 flashcards",            cond: (g) => g.stats.flashcards >= 50 },
  { id: "aprovado", icone: "✅", nome: "Aprovado!",        desc: "Passe num simulado (60% + não zerar)", cond: (g) => g.stats.passouSimulado },
  { id: "notamax",  icone: "💯", nome: "Nota Máxima",      desc: "Gabarite 100% num simulado",      cond: (g) => g.stats.notaMax >= 100 },
  { id: "dedicado", icone: "📝", nome: "Dedicado",         desc: "Faça 10 simulados",               cond: (g) => g.stats.simulados >= 10 },
  { id: "sargento", icone: "⋀⋀", nome: "Graduado",         desc: "Alcance a patente de 3º Sargento", cond: (g) => g.xp >= 1000 },
  { id: "oficial",  icone: "◆◆", nome: "Oficial",          desc: "Alcance a patente de 2º Tenente", cond: (g) => g.xp >= 6000 },
];

/* ---- Data local (YYYY-MM-DD) --------------------------------------------- */
function _hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function _ontem() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ========================================================================= */
const Gamify = {
  combo: 0, // acertos seguidos na sessão

  _default() {
    return {
      xp: 0,
      streak: { count: 0, ultimoDia: null },
      dia: { data: null, xp: 0 },
      conquistas: {}, // id -> timestamp
      stats: { respondidas: 0, acertos: 0, flashcards: 0, simulados: 0, melhorCombo: 0, notaMax: 0, passouSimulado: false },
      historico: {},   // 'YYYY-MM-DD' -> xp do dia
      desafio: null,   // desafio do dia
      som: true,
    };
  },

  estado() {
    const d = Store.carregar();
    if (!d.gamify) d.gamify = this._default();
    // proteção contra estados antigos
    d.gamify.stats = Object.assign(this._default().stats, d.gamify.stats || {});
    return d.gamify;
  },
  _salvar() { Store.salvar(); },

  /* ---- Patente / nível ---- */
  patente(g = this.estado()) {
    let atual = PATENTES[0], prox = null;
    for (let i = 0; i < PATENTES.length; i++) {
      if (g.xp >= PATENTES[i].xp) { atual = PATENTES[i]; prox = PATENTES[i + 1] || null; }
    }
    const nivel = PATENTES.indexOf(atual);
    let progresso = 100, faltam = 0;
    if (prox) {
      const base = atual.xp, teto = prox.xp;
      progresso = Math.round(((g.xp - base) / (teto - base)) * 100);
      faltam = teto - g.xp;
    }
    return { atual, prox, nivel, progresso, faltam };
  },

  /* ---- Ofensiva (streak) diária ---- */
  checkin() {
    const g = this.estado();
    const hoje = _hoje();
    if (g.streak.ultimoDia === hoje) return; // já contou hoje
    if (g.streak.ultimoDia === _ontem()) g.streak.count += 1;
    else g.streak.count = 1;
    g.streak.ultimoDia = hoje;
    this._salvar();
  },

  _diaAtual(g) {
    const hoje = _hoje();
    if (g.dia.data !== hoje) g.dia = { data: hoje, xp: 0 };
    return g.dia;
  },

  /* ---- Ganho de XP (retorna info p/ UI: subiu de nível?) ---- */
  addXP(n) {
    const g = this.estado();
    const antes = this.patente(g).nivel;
    g.xp += n;
    this._diaAtual(g).xp += n;
    // histórico diário (mantém últimos ~30 dias)
    if (!g.historico) g.historico = {};
    const hoje = _hoje();
    g.historico[hoje] = (g.historico[hoje] || 0) + n;
    const chaves = Object.keys(g.historico).sort();
    while (chaves.length > 30) { delete g.historico[chaves.shift()]; }
    const depois = this.patente(g).nivel;
    this._salvar();
    return { ganho: n, subiuNivel: depois > antes, novaPatente: PATENTES[depois] };
  },

  /* ---- Frases motivacionais ---- */
  frase() { return FRASES[Math.floor(Math.random() * FRASES.length)]; },
  fraseDoDia() {
    const d = new Date();
    const idx = (d.getFullYear() + d.getMonth() * 31 + d.getDate()) % FRASES.length;
    return FRASES[idx];
  },
  mascoteFala() {
    const g = this.estado();
    const meta = this.metaDiaria();
    if (meta.batida) return `Meta batida hoje! Ofensiva de ${g.streak.count} dia(s). Orgulho da tropa! 🔥`;
    if (g.streak.count >= 3) return `${g.streak.count} dias seguidos! Não quebre a ofensiva — bora bater a meta.`;
    if (g.xp === 0) return "Bem-vindo, recruta! Responda sua primeira questão e comece a subir de patente.";
    return this.fraseDoDia();
  },

  /* ---- Histórico semanal (últimos 7 dias) ---- */
  historicoSemana() {
    const g = this.estado();
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      out.push({ label: dias[d.getDay()], data: key, xp: (g.historico && g.historico[key]) || 0, hoje: i === 0 });
    }
    return out;
  },

  /* ---- Desafio diário ---- */
  _gerarDesafio() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const dayIdx = Math.floor((d - start) / 86400000);
    const materia = SUBJECTS[dayIdx % SUBJECTS.length];
    const alvos = [5, 6, 8, 10];
    const alvo = alvos[dayIdx % alvos.length];
    return { data: _hoje(), materiaId: materia.id, materiaNome: materia.nome, alvo, progresso: 0, feito: false, recompensa: alvo * 10 + 30 };
  },
  desafioHoje() {
    const g = this.estado();
    if (!g.desafio || g.desafio.data !== _hoje()) { g.desafio = this._gerarDesafio(); this._salvar(); }
    return g.desafio;
  },
  registrarDesafio(materiaId) {
    const des = this.desafioHoje();
    if (des.feito || des.materiaId !== materiaId) return null;
    des.progresso += 1;
    if (des.progresso >= des.alvo) {
      des.feito = true; this._salvar();
      const lvl = this.addXP(des.recompensa);
      return { concluido: true, recompensa: des.recompensa, subiuNivel: lvl.subiuNivel, novaPatente: lvl.novaPatente };
    }
    this._salvar();
    return { concluido: false, progresso: des.progresso, alvo: des.alvo };
  },

  /* ---- Eventos de estudo ---- */
  // Resposta em modo prática. Retorna {xp, combo, subiuNivel, novaPatente, novas[], desafio}
  responder(acertou, materiaId) {
    this.checkin();
    const g = this.estado();
    g.stats.respondidas += 1;
    let xp = 2; // consolação — errar também ensina
    if (acertou) {
      g.stats.acertos += 1;
      this.combo += 1;
      if (this.combo > g.stats.melhorCombo) g.stats.melhorCombo = this.combo;
      xp = 10 + Math.min(this.combo - 1, 10); // bônus de combo até +10
    } else {
      this.combo = 0;
    }
    this._salvar();
    const lvl = this.addXP(xp);
    const novas = this.checarConquistas();
    let desafio = null;
    if (acertou && materiaId) {
      desafio = this.registrarDesafio(materiaId);
      if (desafio && desafio.concluido) novas.push(...this.checarConquistas());
    }
    return { xp, combo: this.combo, acertou, subiuNivel: lvl.subiuNivel, novaPatente: lvl.novaPatente, novas, desafio };
  },

  flashcard(q) {
    this.checkin();
    const g = this.estado();
    g.stats.flashcards += 1;
    this._salvar();
    const xp = q >= 4 ? 6 : (q === 3 ? 3 : 1);
    const lvl = this.addXP(xp);
    const novas = this.checarConquistas();
    return { xp, subiuNivel: lvl.subiuNivel, novaPatente: lvl.novaPatente, novas };
  },

  simulado(res, aprovado) {
    this.checkin();
    const g = this.estado();
    g.stats.simulados += 1;
    const perc = Math.round((res.acertos / res.total) * 100);
    if (perc > g.stats.notaMax) g.stats.notaMax = perc;
    if (aprovado) g.stats.passouSimulado = true;
    this._salvar();
    let xp = res.acertos * 3 + 10;      // recompensa por simulado
    if (aprovado) xp += 40;
    if (perc === 100) xp += 60;
    const lvl = this.addXP(xp);
    const novas = this.checarConquistas();
    return { xp, subiuNivel: lvl.subiuNivel, novaPatente: lvl.novaPatente, novas };
  },

  /* ---- Conquistas: retorna as recém-desbloqueadas ---- */
  checarConquistas() {
    const g = this.estado();
    const novas = [];
    ACHIEVEMENTS.forEach((a) => {
      if (!g.conquistas[a.id] && a.cond(g)) {
        g.conquistas[a.id] = Date.now();
        novas.push(a);
      }
    });
    if (novas.length) this._salvar();
    return novas;
  },

  metaDiaria() {
    const g = this.estado();
    const dia = this._diaAtual(g);
    const pct = Math.min(100, Math.round((dia.xp / META_DIARIA_XP) * 100));
    return { xp: dia.xp, meta: META_DIARIA_XP, pct, batida: dia.xp >= META_DIARIA_XP };
  },

  toggleSom() { const g = this.estado(); g.som = !g.som; this._salvar(); return g.som; },
  somAtivo() { return this.estado().som; },
  resetCombo() { this.combo = 0; },
};

/* ========================================================================= */
/* SONS — Web Audio API (sem arquivos externos)                              */
/* ========================================================================= */
const Som = {
  _ctx: null,
  _ac() {
    if (!Gamify.somAtivo()) return null;
    try { if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    if (this._ctx.state === "suspended") this._ctx.resume();
    return this._ctx;
  },
  _tocar(freqs, dur = 0.12, tipo = "sine", vol = 0.08) {
    const ac = this._ac(); if (!ac) return;
    let t = ac.currentTime;
    freqs.forEach((f) => {
      const osc = ac.createOscillator(), g = ac.createGain();
      osc.type = tipo; osc.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g); g.connect(ac.destination);
      osc.start(t); osc.stop(t + dur);
      t += dur * 0.8;
    });
  },
  acerto()    { this._tocar([660, 880], 0.12, "sine", 0.07); },
  comboAlto() { this._tocar([660, 880, 1175], 0.10, "sine", 0.07); },
  erro()      { this._tocar([200, 150], 0.16, "sawtooth", 0.05); },
  levelup()   { this._tocar([523, 659, 784, 1047], 0.16, "triangle", 0.09); },
  conquista() { this._tocar([784, 988, 1319], 0.16, "triangle", 0.08); },
};

/* ========================================================================= */
/* CONFETE — canvas overlay (sem libs)                                       */
/* ========================================================================= */
const Confete = {
  disparar(qtd = 120) {
    const canvas = document.createElement("canvas");
    canvas.className = "confete-canvas";
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const cores = ["#d4af37", "#f0d878", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#14b8a6"];
    const parts = Array.from({ length: qtd }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      r: 4 + Math.random() * 6,
      c: cores[Math.floor(Math.random() * cores.length)],
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: -0.2 + Math.random() * 0.4,
    }));
    let frames = 0;
    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.05;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      frames++;
      if (frames < 160) requestAnimationFrame(anim);
      else canvas.remove();
    };
    anim();
  },
};
