/* =========================================================================
   MOTOR DE REVISÃO ESPAÇADA — Algoritmo SM-2 (SuperMemo 2)
   -------------------------------------------------------------------------
   É o algoritmo clássico usado por Anki e afins. Para cada card guardamos:
     - ef (fator de facilidade, começa em 2.5)
     - intervalo (dias até a próxima revisão)
     - repeticoes (acertos consecutivos)
     - proximaRevisao (timestamp)
   Qualidade da resposta (q): 0 a 5.
     0-2 = errou/difícil  →  reinicia o ciclo
     3-5 = acertou        →  aumenta o intervalo
   ========================================================================= */

const SRS = {
  /** Estado inicial de um card novo. */
  novoCard() {
    return { ef: 2.5, intervalo: 0, repeticoes: 0, proximaRevisao: Date.now(), historico: [] };
  },

  /**
   * Atualiza o card conforme a qualidade da resposta.
   * @param {object} card  estado atual do card
   * @param {number} q     qualidade de 0 a 5
   * @returns {object}     novo estado do card
   */
  revisar(card, q) {
    const c = Object.assign({}, card);
    c.historico = (card.historico || []).concat([{ q, data: Date.now() }]);

    if (q < 3) {
      // Errou: reinicia repetições, revê no dia seguinte
      c.repeticoes = 0;
      c.intervalo = 1;
    } else {
      // Acertou: calcula novo intervalo
      c.repeticoes = (card.repeticoes || 0) + 1;
      if (c.repeticoes === 1) c.intervalo = 1;
      else if (c.repeticoes === 2) c.intervalo = 6;
      else c.intervalo = Math.round((card.intervalo || 1) * (card.ef || 2.5));
    }

    // Atualiza o fator de facilidade (nunca abaixo de 1.3)
    let ef = (card.ef || 2.5) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (ef < 1.3) ef = 1.3;
    c.ef = Math.round(ef * 100) / 100;

    const MS_DIA = 24 * 60 * 60 * 1000;
    c.proximaRevisao = Date.now() + c.intervalo * MS_DIA;
    return c;
  },

  /** True se o card está vencido (deve ser revisado agora). */
  estaVencido(card) {
    if (!card || card.proximaRevisao == null) return true;
    return Date.now() >= card.proximaRevisao;
  },

  /** Texto amigável do próximo vencimento. */
  descreveVencimento(card) {
    if (!card || this.estaVencido(card)) return "Revisar agora";
    const dias = Math.ceil((card.proximaRevisao - Date.now()) / (24 * 60 * 60 * 1000));
    return dias <= 1 ? "Amanhã" : `Em ${dias} dias`;
  },
};
