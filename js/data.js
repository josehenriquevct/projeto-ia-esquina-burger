/* =========================================================================
   BASE DE DADOS DO SISTEMA — PMGO / SOLDADO COMBATENTE
   -------------------------------------------------------------------------
   CALIBRADO PELA PROVA REAL:
     • Banca .......... INSTITUTO AOCP
     • Edital ......... 002/2022 (Soldado de 2ª Classe QPPM — Combatente)
     • Prova .......... 10/07/2022 — 50 questões objetivas + 1 redação
     • Aprovação ...... >= 60% dos 85 pontos da objetiva (= 51 pontos)
                        E NÃO ZERAR EM NENHUMA ÁREA DE CONHECIMENTO.

   A grade de matérias, os pesos e os tópicos abaixo reproduzem a estrutura
   oficial e a INCIDÊNCIA REAL medida questão a questão na prova de 2022.

   ATENÇÃO: sempre confira o EDITAL VIGENTE do seu concurso. Leis mudam e o
   próximo edital deve trazer novidades (cota racial de 20% — Lei 23.389/2025;
   fim do teto de vagas femininas — ADI 7.490).
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1) MATÉRIAS — grade oficial do Soldado Combatente (Edital 002/2022)
   Campos:
     questoesProva : nº de questões na prova real
     pesoProva     : peso de cada questão
     pontos        : questoesProva * pesoProva
     prioridade    : 1 = estude primeiro (maior pontos/hora) ... 3 = manutenção
--------------------------------------------------------------------------------- */
const SUBJECTS = [
  {
    id: "constitucional", nome: "Direito Constitucional", cor: "#a855f7",
    questoesProva: 6, pesoProva: 2, pontos: 12, prioridade: 2,
    topicos: [
      "Princípios fundamentais (arts. 1º a 4º)",
      "Direitos e garantias fundamentais (art. 5º) — com destaque ao inc. XIX (associações)",
      "Tratados internacionais de direitos humanos (art. 5º, §3º)",
      "Organização do Estado e dos Poderes; sucessão presidencial (art. 80)",
      "Administração Pública na Constituição (art. 37)",
      "Defesa do Estado e Segurança Pública (art. 144)",
      "Regime jurídico dos militares dos Estados (art. 42)",
    ],
  },
  {
    id: "administrativo", nome: "Direito Administrativo", cor: "#f97316",
    questoesProva: 6, pesoProva: 2, pontos: 12, prioridade: 2,
    topicos: [
      "Princípios (LIMPE) e Súmula Vinculante 13 (nepotismo)",
      "Poderes administrativos; atos administrativos e espécies",
      "Responsabilidade civil do Estado (risco administrativo — art. 37, §6º)",
      "Agentes públicos e acumulação de cargos",
      "Improbidade administrativa (Lei 8.429/1992)",
      "Lei estadual 13.800/2001 (processo administrativo em Goiás)",
      "Licitações (Lei 14.133/2021) — noções",
    ],
  },
  {
    id: "penal", nome: "Direito Penal", cor: "#ef4444",
    questoesProva: 5, pesoProva: 2, pontos: 10, prioridade: 2,
    topicos: [
      "Aplicação da lei penal no tempo (lex mitior) e no espaço",
      "Leis temporárias e excepcionais (ultratividade)",
      "Conflito aparente de normas (especialidade, subsidiariedade, consunção)",
      "Teoria do crime e excludentes de ilicitude (art. 23)",
      "Crimes contra o patrimônio (roubo majorado — art. 157, §2º)",
      "Lei Maria da Penha (11.340/2006, arts. 1º a 7º)",
    ],
  },
  {
    id: "proc_penal", nome: "Direito Processual Penal", cor: "#0ea5e9",
    questoesProva: 5, pesoProva: 2, pontos: 10, prioridade: 2,
    topicos: [
      "Prisão preventiva (art. 312) e prisão em flagrante",
      "Prisão temporária (Lei 7.960/1989)",
      "Fiança (arbitramento pela autoridade policial) e liberdade provisória",
      "Habeas corpus",
      "Procedimento comum ordinário",
      "Prova e inquérito policial",
    ],
  },
  {
    id: "penal_militar", nome: "Direito Penal Militar", cor: "#eab308",
    questoesProva: 4, pesoProva: 2, pontos: 8, prioridade: 1,
    topicos: [
      "Aplicação da lei penal militar (teoria da ubiquidade — lugar do crime)",
      "Crime militar; imputabilidade; concurso de agentes",
      "Penas (principais e acessórias); pena de morte e de impedimento",
      "Deserção (art. 187 — ausência superior a 8 dias)",
      "Motim (art. 149) e crimes assemelhados",
      "Peculato e embriaguez em serviço (art. 202)",
    ],
  },
  {
    id: "proc_penal_militar", nome: "Direito Processual Penal Militar", cor: "#84cc16",
    questoesProva: 5, pesoProva: 2, pontos: 10, prioridade: 1,
    topicos: [
      "Polícia judiciária militar e IPM (prazos, portaria, delegação)",
      "Ação penal militar; denúncia",
      "Competência da Justiça Militar",
      "Menagem; questões prejudiciais",
      "Provas, nulidades e recursos",
      "Processo especial de deserção",
    ],
  },
  {
    id: "legislacao", nome: "Legislação Extravagante", cor: "#14b8a6",
    questoesProva: 4, pesoProva: 2, pontos: 8, prioridade: 1,
    topicos: [
      "Lei de Drogas (11.343/2006) — a MAIS cobrada do concurso",
      "Estatuto do Desarmamento (10.826/2003)",
      "Crimes Hediondos (8.072/1990)",
      "Juizados Especiais Criminais (9.099/1995)",
      "ECA (8.069/1990) e Crimes Ambientais (9.605/1998) — secundários",
      "(CFO) Estatuto dos PM de Goiás — Lei estadual 8.033/1975",
    ],
  },
  {
    id: "portugues", nome: "Língua Portuguesa", cor: "#3b82f6",
    questoesProva: 10, pesoProva: 1, pontos: 10, prioridade: 3,
    topicos: [
      "Interpretação de texto (prova amarrada a UM texto único)",
      "Classificação do 'se' e funções do 'que'",
      "Colocação pronominal (ênclise, próclise, mesóclise)",
      "Coesão e referência (anáfora/catáfora)",
      "Pontuação e relação semântica de conectivos",
      "Concordância, regência e crase",
      "Redação Oficial (o item mais previsível da prova)",
    ],
  },
  {
    id: "realidade_goias", nome: "Realidade de Goiás", cor: "#22c55e",
    questoesProva: 5, pesoProva: 1, pontos: 5, prioridade: 1,
    topicos: [
      "Mineração colonial / Ciclo do Ouro (séc. XVIII)",
      "Revolta de Trombas e Formoso (conflito agrário)",
      "Escravidão e povos indígenas em Goiás",
      "República Velha, oligarquia Caiado e a ferrovia (1913)",
      "Bacia do Rio Meia Ponte; Chapada dos Veadeiros; relevo",
      "Bioma Cerrado; capital Goiânia (1937)",
      "⚠️ IGNORE atualidades — ZERO questões em 3 provas de 2022",
    ],
  },
];

/* ---------------------------------------------------------------------------
   2) BLUEPRINT DA PROVA + REGRA DE APROVAÇÃO
--------------------------------------------------------------------------------- */
const EXAM = {
  banca: "Instituto AOCP",
  cargo: "Soldado de 2ª Classe (Combatente)",
  edital: "002/2022",
  totalQuestoes: 50,
  pontosObjetiva: 85,
  pontosRedacao: 25,
  minPercent: 60,
  minPontos: 51,          // 60% de 85
  regraExtra: "Não zerar em NENHUMA área de conhecimento.",
  redacaoMin: 15,         // 60% de 25
  alternativas: 5,        // A a E
  semPenalidade: true,    // errar não anula acerto — nunca deixe em branco
  freqComandoNegativo: 0.16, // ~16% das questões: INCORRETA / NÃO / EXCETO
};

/* ---------------------------------------------------------------------------
   3) PRIORIDADE DE ESTUDO (derivada da análise de densidade pontos/hora)
--------------------------------------------------------------------------------- */
const STUDY_PRIORITY = [
  { faixa: 1, titulo: "Retorno altíssimo — estude primeiro", cor: "#22c55e", itens: [
    { materia: "realidade_goias", nota: "Núcleo fechado e minúsculo. Maior pontos/hora do edital. ~10–15h para 4–5 acertos." },
    { materia: "penal_militar", nota: "Lei seca estável desde 1969. 8 pontos que a maioria ignora." },
    { materia: "proc_penal_militar", nota: "10 pontos em lei seca. Junto com o Penal Militar somam 18 pts." },
    { materia: "legislacao", nota: "Foque em 4 leis: Drogas, Desarmamento, Hediondos e JECrim (70% do tempo)." },
  ]},
  { faixa: 2, titulo: "Alto volume, alto retorno absoluto", cor: "#eab308", itens: [
    { materia: "constitucional", nota: "Art. 144 e art. 42 quase garantidos. 12 pontos." },
    { materia: "administrativo", nota: "Princípios, responsabilidade civil, improbidade. 12 pontos." },
    { materia: "penal", nota: "Parte geral aplicada a casos + roubo majorado. 10 pontos." },
    { materia: "proc_penal", nota: "Priorize PRISÕES CAUTELARES — tema mais rentável. 10 pontos." },
  ]},
  { faixa: 3, titulo: "Manutenção — não superinvista", cor: "#f97316", itens: [
    { materia: "portugues", nota: "Peso 1 com 10 questões — metade do retorno por questão. Recorte estreito AOCP." },
  ]},
];

/* Alocação de tempo sugerida (% do cronograma de estudo). */
const TIME_ALLOCATION = [
  { grupo: "Militares (Penal + Proc. Penal Militar)", pontos: 18, percent: 20 },
  { grupo: "Constitucional + Administrativo", pontos: 24, percent: 25 },
  { grupo: "Penal + Processual Penal", pontos: 20, percent: 20 },
  { grupo: "Redação", pontos: 25, percent: 12 },
  { grupo: "Legislação Extravagante (4 leis)", pontos: 8, percent: 12 },
  { grupo: "Português (recorte estreito)", pontos: 10, percent: 8 },
  { grupo: "Realidade de Goiás (núcleo fechado)", pontos: 5, percent: 3 },
];

/* ---------------------------------------------------------------------------
   4) TAF — Teste de Aptidão Física (Tabelas 13.3/13.4 do Edital 002/2022)
   Regra: média dos 4 testes >= 5,0 E pontuar em TODOS E ser apto na natação.
--------------------------------------------------------------------------------- */
const TAF = {
  regra: [
    "Média aritmética simples dos 4 testes ≥ 5,0 pontos.",
    "Pontuar em TODOS os testes — zerar um só já elimina.",
    "Natação 25 m nado livre: APTO/INAPTO (não pontua, mas elimina).",
  ],
  alvoMasculino: "7 barras · 30 flexões · 50 abdominais · 2.500 m em 12 min",
  alvoFeminino: "45\" isometria · 30 flexões · 44 abdominais · 2.100 m em 12 min",
  masculino: {
    colunas: ["Barra fixa", "Flexão de braço", "Abdominal", "Corrida 12 min", "Pontos"],
    linhas: [
      ["2", "20", "40", "2.000 m", "0,0"],
      ["3", "22", "42", "2.100 m", "1,0"],
      ["5", "26", "46", "2.300 m", "3,0"],
      ["7", "30", "50", "2.500 m", "5,0 ← mínimo"],
      ["9", "34", "54", "2.700 m", "7,0"],
      ["12", "40", "60", "3.000 m", "10,0"],
    ],
  },
  feminino: {
    colunas: ["Isometria barra", "Flexão 6 apoios", "Abdominal", "Corrida 12 min", "Pontos"],
    linhas: [
      ["20\"", "20", "34", "1.600 m", "0,0"],
      ["25\"", "22", "36", "1.700 m", "1,0"],
      ["35\"", "26", "40", "1.900 m", "3,0"],
      ["45\"", "30", "44", "2.100 m", "5,0 ← mínimo"],
      ["55\"", "34", "48", "2.300 m", "7,0"],
      ["1'10\"", "40", "54", "2.600 m", "10,0"],
    ],
  },
};

/* ---------------------------------------------------------------------------
   5) REDAÇÃO — 25 pontos (o item mais subvalorizado do concurso)
--------------------------------------------------------------------------------- */
const REDACAO = {
  pontos: 25,
  minimo: 15,
  linhas: "20 a 30 linhas",
  tipo: "Dissertação argumentativa (Soldado)",
  temaReal2022: "O tempo utilizado na internet é prejudicial para as pessoas ou é uma necessidade do mundo contemporâneo?",
  criterios: [
    "Atendimento e desenvolvimento do tema — 5,0",
    "Coesão e coerência — 5,0",
    "Atendimento à estrutura textual — 5,0",
    "Informatividade e argumentação — 5,0",
    "Modalidade gramatical (pontuação, grafia, concordância, regência) — 5,0",
  ],
  atributosRedacaoOficial: ["Impessoalidade", "Clareza", "Concisão", "Formalidade", "Uniformidade", "Padrão culto da linguagem"],
};

/* ---------------------------------------------------------------------------
   6) CHECKLIST NÃO-INTELECTUAL (comece hoje, não quando sair o edital)
--------------------------------------------------------------------------------- */
const CHECKLIST = [
  "Curso superior concluído (qualquer área) — é REQUISITO. Para CFO: bacharel em Direito.",
  "Idade: menos de 30 anos (Soldado) na data provável de publicação do edital.",
  "CNH categoria B ou superior — tirar leva meses.",
  "Natação 25 m: se você não nada, comece AGORA. Elimina independentemente da nota.",
  "TAF: treine os 4 testes até bater a média 5,0 com folga.",
  "Certidões de antecedentes (estadual, federal, eleitoral) e consulta de processos.",
  "Regularização de CPF, restrições cadastrais e dívidas (SPC/Serasa).",
  "Atestado cardiológico atualizado no TAF (validade de 30 dias).",
  "Decisão consciente sobre a CRPM de escolha (3 anos de permanência obrigatória).",
];

/* ---------------------------------------------------------------------------
   7) BANCO DE QUESTÕES — no estilo AOCP (5 alternativas, casos concretos,
   comando negativo, V/F). Baseado na incidência real da prova.
   Formato: { id, materia, nivel, enunciado, alternativas[], correta, explicacao }
--------------------------------------------------------------------------------- */
const QUESTIONS = [
  /* ===================== REALIDADE DE GOIÁS ===================== */
  {
    id: "go1", materia: "realidade_goias", nivel: "facil",
    enunciado: "A ocupação do território goiano no século XVIII foi impulsionada principalmente pela:",
    alternativas: ["Pecuária extensiva de exportação", "Mineração de ouro (bandeiras paulistas)", "Cultura cafeeira", "Construção de ferrovias", "Industrialização"],
    correta: 1,
    explicacao: "O povoamento de Goiás no séc. XVIII foi movido pela MINERAÇÃO DO OURO, a partir das bandeiras paulistas (Bartolomeu Bueno da Silva, o Anhanguera). Ferrovias e industrialização são muito posteriores. Correta: B.",
  },
  {
    id: "go2", materia: "realidade_goias", nivel: "medio",
    enunciado: "A Revolta de Trombas e Formoso, ocorrida em Goiás nos anos 1950, é caracterizada como um movimento de:",
    alternativas: ["Independência separatista", "Resistência camponesa por posse da terra", "Greve de mineradores", "Revolta urbana estudantil", "Conflito religioso"],
    correta: 1,
    explicacao: "Trombas e Formoso foi um CONFLITO AGRÁRIO — resistência de posseiros/camponeses pela permanência na terra contra grileiros, no norte goiano. Correta: B.",
  },
  {
    id: "go3", materia: "realidade_goias", nivel: "facil",
    enunciado: "O principal rio que corta a região metropolitana de Goiânia e importante bacia hidrográfica cobrada em prova é o:",
    alternativas: ["Rio Araguaia", "Rio Tocantins", "Rio Meia Ponte", "Rio Paranaíba", "Rio das Almas"],
    correta: 2,
    explicacao: "A Bacia do RIO MEIA PONTE atravessa Goiânia e caiu diretamente na prova de 2022 (Q11 do Combatente). Correta: C.",
  },
  {
    id: "go4", materia: "realidade_goias", nivel: "facil",
    enunciado: "A Chapada dos Veadeiros, cobrada em prova, destaca-se no relevo goiano por:",
    alternativas: ["Ser a região de menor altitude do estado", "Concentrar os pontos de maior altitude de Goiás", "Ser uma planície litorânea", "Pertencer ao bioma Amazônico", "Ser uma depressão abaixo do nível do mar"],
    correta: 1,
    explicacao: "A Chapada dos Veadeiros concentra os PONTOS DE MAIOR ALTITUDE de Goiás. O estado está no bioma CERRADO. Correta: B.",
  },
  {
    id: "go5", materia: "realidade_goias", nivel: "medio",
    enunciado: "Sobre a Primeira República (República Velha) em Goiás, é correto afirmar que:",
    alternativas: [
      "O poder era exercido por oligarquias, com destaque para a família Caiado, e a ferrovia chegou ao estado em 1913.",
      "Não havia coronelismo, pois o estado era industrializado.",
      "Goiânia já era a capital desde 1900.",
      "O estado foi palco da Guerra dos Farrapos.",
      "A economia baseava-se na indústria automobilística.",
    ],
    correta: 0,
    explicacao: "A República Velha goiana foi marcada pelo domínio OLIGÁRQUICO (família Caiado) e pela chegada da FERROVIA em 1913. Goiânia só viria a ser capital em 1937. Correta: A.",
  },
  {
    id: "go6", materia: "realidade_goias", nivel: "facil",
    enunciado: "Assinale a alternativa correta sobre a capital de Goiás.",
    alternativas: [
      "Goiânia é a capital desde a fundação do estado.",
      "A capital sempre foi Brasília.",
      "A antiga capital era a Cidade de Goiás (Vila Boa); Goiânia tornou-se capital em 1937.",
      "Anápolis é a atual capital.",
      "A capital foi transferida para Rio Verde em 1950.",
    ],
    correta: 2,
    explicacao: "A antiga capital era a CIDADE DE GOIÁS (Vila Boa). A transferência para GOIÂNIA, cidade planejada, ocorreu em 1937. Correta: C.",
  },

  /* ===================== DIREITO PENAL MILITAR ===================== */
  {
    id: "pm1", materia: "penal_militar", nivel: "medio",
    enunciado: "Quanto ao LUGAR do crime, o Direito Penal (comum e militar) adota a teoria da:",
    alternativas: ["Atividade", "Resultado", "Ubiquidade (mista)", "Intenção", "Representação"],
    correta: 2,
    explicacao: "Para o LUGAR do crime adota-se a teoria da UBIQUIDADE (mista): considera-se praticado onde ocorreu a ação/omissão E onde se produziu (ou deveria produzir-se) o resultado. Correta: C.",
  },
  {
    id: "pm2", materia: "penal_militar", nivel: "medio",
    enunciado: "Segundo o Código Penal Militar, o crime de DESERÇÃO consuma-se, em regra, quando a ausência do militar do serviço se prolonga por período superior a:",
    alternativas: ["24 horas", "3 dias", "5 dias", "8 dias", "15 dias"],
    correta: 3,
    explicacao: "A deserção (art. 187 do CPM) consuma-se após decorridos OITO DIAS de ausência (o chamado prazo de graça). Correta: D.",
  },
  {
    id: "pm3", materia: "penal_militar", nivel: "dificil",
    enunciado: "Sobre as penas no Código Penal Militar, assinale a alternativa INCORRETA.",
    alternativas: [
      "A pena de morte é prevista apenas para crimes cometidos em tempo de guerra.",
      "O impedimento é uma das penas principais previstas no CPM.",
      "A pena de morte, quando aplicável, é executada por fuzilamento.",
      "A pena de morte pode ser livremente aplicada em tempo de paz.",
      "A reforma pode figurar como pena acessória.",
    ],
    correta: 3,
    explicacao: "Comando NEGATIVO. A pena de morte no CPM só cabe em TEMPO DE GUERRA — nunca em tempo de paz. Logo a assertiva D é a INCORRETA (a pedida). Correta: D.",
  },
  {
    id: "pm4", materia: "penal_militar", nivel: "medio",
    enunciado: "O crime de MOTIM, no Código Penal Militar, caracteriza-se por:",
    alternativas: [
      "Militar, isoladamente, desobedecer a ordem superior.",
      "Reunião de militares agindo contra a ordem/disciplina, recusando obediência ou praticando violência.",
      "Ausência do serviço por mais de 8 dias.",
      "Abandono de posto por sentinela.",
      "Deixar de cumprir horário de forma isolada.",
    ],
    correta: 1,
    explicacao: "O MOTIM (art. 149 do CPM) exige CONCURSO DE MILITARES reunidos que se insurgem contra a ordem, a disciplina ou a autoridade. A conduta isolada configura outros tipos. Correta: B.",
  },

  /* ===================== DIREITO PROCESSUAL PENAL MILITAR ===================== */
  {
    id: "ppm1", materia: "proc_penal_militar", nivel: "medio",
    enunciado: "O Inquérito Policial Militar (IPM) é presidido por:",
    alternativas: [
      "Delegado de polícia civil.",
      "Oficial designado (autoridade de polícia judiciária militar).",
      "Promotor de Justiça.",
      "Juiz de Direito.",
      "Qualquer praça de serviço.",
    ],
    correta: 1,
    explicacao: "O IPM é procedimento da POLÍCIA JUDICIÁRIA MILITAR, presidido por OFICIAL designado pela autoridade competente. Não é conduzido por delegado civil. Correta: B.",
  },
  {
    id: "ppm2", materia: "proc_penal_militar", nivel: "medio",
    enunciado: "No Processo Penal Militar, a MENAGEM é:",
    alternativas: [
      "Uma modalidade de pena principal.",
      "Espécie de prisão em flagrante.",
      "Uma prisão provisória/medida que permite ao acusado permanecer em liberdade vigiada em local determinado (quartel, cidade).",
      "Um recurso contra a sentença.",
      "A denúncia oferecida pelo MP militar.",
    ],
    correta: 2,
    explicacao: "A MENAGEM é uma custódia mais branda: o acusado fica recolhido a determinado local (quartel, residência, cidade), espécie de liberdade provisória própria do processo militar. Correta: C.",
  },
  {
    id: "ppm3", materia: "proc_penal_militar", nivel: "dificil",
    enunciado: "Sobre a competência da Justiça Militar Estadual, assinale a alternativa INCORRETA.",
    alternativas: [
      "Julga os militares dos Estados nos crimes militares definidos em lei.",
      "Os crimes dolosos contra a vida de civil, praticados por militar estadual, são julgados pelo Tribunal do Júri (Justiça comum).",
      "A Justiça Militar Estadual julga civis pelos crimes comuns.",
      "Cabe-lhe julgar as ações judiciais contra atos disciplinares militares.",
      "É composta, em primeiro grau, por juízes de direito e conselhos de justiça.",
    ],
    correta: 2,
    explicacao: "Comando NEGATIVO. A Justiça Militar ESTADUAL NÃO julga civis (diferente da federal). Crime doloso contra a vida de civil vai ao Júri. Logo C é a INCORRETA pedida. Correta: C.",
  },

  /* ===================== LEGISLAÇÃO EXTRAVAGANTE ===================== */
  {
    id: "leg1", materia: "legislacao", nivel: "medio",
    enunciado: "Na Lei de Drogas (11.343/2006), o chamado 'tráfico privilegiado' (art. 33, §4º) reduz a pena de 1/6 a 2/3 quando o agente:",
    alternativas: [
      "For reincidente específico.",
      "For primário, de bons antecedentes, não se dedicar a atividades criminosas nem integrar organização criminosa.",
      "Comercializar grande quantidade de droga.",
      "Portar arma de fogo no momento.",
      "Praticar o crime nas imediações de escola.",
    ],
    correta: 1,
    explicacao: "O tráfico privilegiado exige CUMULATIVAMENTE: réu primário, bons antecedentes, não se dedicar a atividades criminosas e não integrar organização criminosa. Correta: B.",
  },
  {
    id: "leg2", materia: "legislacao", nivel: "facil",
    enunciado: "Segundo o Estatuto do Desarmamento (Lei 10.826/2003), manter arma de fogo de uso permitido dentro de casa ou no local de trabalho, sem registro, configura:",
    alternativas: ["Porte ilegal de arma", "Posse irregular de arma de fogo de uso permitido", "Comércio ilegal de arma", "Tráfico internacional de arma", "Fato atípico"],
    correta: 1,
    explicacao: "Guardar/manter a arma na RESIDÊNCIA ou local de trabalho = POSSE (art. 12). PORTE é trazer consigo fora desses locais (art. 14). Correta: B.",
  },
  {
    id: "leg3", materia: "legislacao", nivel: "medio",
    enunciado: "Sobre os Juizados Especiais Criminais (Lei 9.099/1995), consideram-se infrações de MENOR potencial ofensivo as contravenções e os crimes com pena máxima:",
    alternativas: ["Não superior a 1 ano", "Não superior a 2 anos", "Não superior a 4 anos", "Não superior a 6 anos", "De qualquer quantidade"],
    correta: 1,
    explicacao: "Infração de menor potencial ofensivo = contravenções + crimes com pena MÁXIMA não superior a 2 ANOS (art. 61). Correta: B.",
  },
  {
    id: "leg4", materia: "legislacao", nivel: "dificil",
    enunciado: "Sobre a Lei Maria da Penha (11.340/2006), assinale a alternativa INCORRETA.",
    alternativas: [
      "Aplica-se à violência doméstica e familiar contra a mulher.",
      "Veda a aplicação da Lei 9.099/1995 (JECrim) aos crimes por ela abrangidos.",
      "A ação penal na lesão corporal contra a mulher em contexto doméstico é pública incondicionada (STF).",
      "Prevê medidas protetivas de urgência.",
      "Admite a substituição da pena por cesta básica ou multa isolada.",
    ],
    correta: 4,
    explicacao: "Comando NEGATIVO. O art. 17 VEDA penas de cesta básica/prestação pecuniária e multa isolada. Logo E é a INCORRETA pedida. Correta: E.",
  },

  /* ===================== DIREITO CONSTITUCIONAL ===================== */
  {
    id: "const1", materia: "constitucional", nivel: "medio",
    enunciado: "Nos termos do art. 144, §5º, da CF/88, às Polícias Militares cabem:",
    alternativas: [
      "A apuração de infrações penais e a polícia judiciária.",
      "A polícia ostensiva e a preservação da ordem pública.",
      "O policiamento das fronteiras e portos.",
      "A guarda de dependências da União.",
      "A execução penal e a administração de presídios.",
    ],
    correta: 1,
    explicacao: "Art. 144, §5º: às PM cabem a POLÍCIA OSTENSIVA e a PRESERVAÇÃO DA ORDEM PÚBLICA. A apuração de infrações é da polícia civil. Correta: B.",
  },
  {
    id: "const2", materia: "constitucional", nivel: "dificil",
    enunciado: "Sobre a liberdade de associação (art. 5º, XIX, CF/88), é correto afirmar que as associações:",
    alternativas: [
      "Podem ser dissolvidas por ato do Poder Executivo.",
      "Só podem ser compulsoriamente dissolvidas por decisão judicial transitada em julgado; a suspensão de atividades basta decisão judicial.",
      "Nunca podem ser dissolvidas.",
      "Podem ter atividades suspensas apenas com trânsito em julgado.",
      "Dependem de autorização do Estado para existir.",
    ],
    correta: 1,
    explicacao: "Pegadinha clássica da AOCP: DISSOLUÇÃO compulsória exige TRÂNSITO EM JULGADO; SUSPENSÃO de atividades basta DECISÃO JUDICIAL (sem trânsito). Correta: B.",
  },
  {
    id: "const3", materia: "constitucional", nivel: "medio",
    enunciado: "Sobre os militares dos Estados (art. 42 c/c art. 142 da CF/88), assinale a alternativa correta.",
    alternativas: [
      "Têm direito a greve e a sindicalização.",
      "São proibidos de sindicalizar-se e de fazer greve.",
      "Podem se candidatar sem qualquer condição.",
      "Não se sujeitam à hierarquia e disciplina.",
      "Têm estabilidade absoluta e não podem perder o cargo.",
    ],
    correta: 1,
    explicacao: "Ao militar são VEDADAS a sindicalização e a greve. Hierarquia e disciplina são as bases da instituição. Correta: B.",
  },
  {
    id: "const4", materia: "constitucional", nivel: "medio",
    enunciado: "Os tratados internacionais sobre direitos humanos aprovados em cada Casa do Congresso, em dois turnos, por 3/5 dos votos (art. 5º, §3º), equivalem a:",
    alternativas: ["Leis ordinárias", "Medidas provisórias", "Emendas constitucionais", "Decretos legislativos", "Normas supralegais infraconstitucionais"],
    correta: 2,
    explicacao: "Aprovados pelo rito do art. 5º, §3º, equivalem a EMENDAS CONSTITUCIONAIS. Sem esse rito, têm status supralegal (abaixo da CF, acima da lei). Correta: C.",
  },

  /* ===================== DIREITO ADMINISTRATIVO ===================== */
  {
    id: "adm1", materia: "administrativo", nivel: "facil",
    enunciado: "Os princípios expressos da Administração Pública (art. 37, caput, CF) são resumidos na sigla LIMPE. Assinale-os corretamente.",
    alternativas: [
      "Legalidade, Isonomia, Moralidade, Publicidade, Eficácia",
      "Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência",
      "Liberdade, Impessoalidade, Mérito, Probidade, Economicidade",
      "Legalidade, Interesse, Motivação, Proporcionalidade, Eficiência",
      "Legalidade, Impessoalidade, Motivação, Publicidade, Especialidade",
    ],
    correta: 1,
    explicacao: "LIMPE = Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. Correta: B.",
  },
  {
    id: "adm2", materia: "administrativo", nivel: "dificil",
    enunciado: "Uma viatura oficial, em serviço, atropela um pedestre. Sobre a responsabilidade civil do Estado, é correto afirmar:",
    alternativas: [
      "É subjetiva, exigindo prova de dolo do agente pela vítima.",
      "É objetiva (teoria do risco administrativo), admitindo excludentes como culpa exclusiva da vítima.",
      "O Estado nunca responde por atos de seus agentes.",
      "A vítima deve processar diretamente o motorista, não o Estado.",
      "É objetiva e integral, sem qualquer excludente.",
    ],
    correta: 1,
    explicacao: "Art. 37, §6º: responsabilidade OBJETIVA pela teoria do RISCO ADMINISTRATIVO — independe de dolo/culpa do agente, mas ADMITE excludentes (culpa exclusiva da vítima, caso fortuito/força maior). Correta: B.",
  },
  {
    id: "adm3", materia: "administrativo", nivel: "medio",
    enunciado: "O atributo do ato administrativo que permite à Administração executá-lo diretamente, sem necessidade de ordem judicial prévia, é a:",
    alternativas: ["Presunção de legitimidade", "Imperatividade", "Autoexecutoriedade", "Tipicidade", "Revogabilidade"],
    correta: 2,
    explicacao: "A AUTOEXECUTORIEDADE permite executar o ato diretamente, sem prévia autorização do Judiciário. Correta: C.",
  },
  {
    id: "adm4", materia: "administrativo", nivel: "medio",
    enunciado: "A Súmula Vinculante 13 do STF trata:",
    alternativas: [
      "Da greve dos servidores públicos.",
      "Da vedação ao nepotismo na Administração Pública.",
      "Do teto remuneratório.",
      "Da acumulação de cargos técnicos.",
      "Da estabilidade do servidor.",
    ],
    correta: 1,
    explicacao: "A SV 13 veda o NEPOTISMO (nomeação de cônjuge, companheiro ou parente até 3º grau para cargos em comissão/função). Correta: B.",
  },

  /* ===================== DIREITO PENAL ===================== */
  {
    id: "pen1", materia: "penal", nivel: "medio",
    enunciado: "Lei penal nova mais benéfica ao réu (lex mitior):",
    alternativas: [
      "Nunca retroage.",
      "Retroage para beneficiar o réu, ainda que já transitada em julgado a condenação.",
      "Só se aplica a fatos futuros.",
      "Aplica-se apenas se o réu concordar.",
      "Depende de lei complementar para retroagir.",
    ],
    correta: 1,
    explicacao: "Art. 5º, XL, CF e art. 2º, parágrafo único, CP: a lei penal mais benéfica RETROAGE, alcançando inclusive fatos já com sentença transitada em julgado. Correta: B.",
  },
  {
    id: "pen2", materia: "penal", nivel: "facil",
    enunciado: "São excludentes de ILICITUDE previstas no art. 23 do CP, EXCETO:",
    alternativas: ["Estado de necessidade", "Legítima defesa", "Estrito cumprimento do dever legal", "Exercício regular de direito", "Coação moral irresistível"],
    correta: 4,
    explicacao: "Comando EXCETO. A coação moral irresistível exclui a CULPABILIDADE (art. 22), não a ilicitude. As demais são excludentes de ilicitude (art. 23). Correta: E.",
  },
  {
    id: "pen3", materia: "penal", nivel: "dificil",
    enunciado: "No conflito aparente de normas, quando um crime é fase de execução ou meio necessário para outro (o 'peixe grande absorve o pequeno'), aplica-se o princípio da:",
    alternativas: ["Especialidade", "Subsidiariedade", "Consunção (absorção)", "Alternatividade", "Territorialidade"],
    correta: 2,
    explicacao: "A CONSUNÇÃO ocorre quando um fato (crime-meio) é absorvido por outro (crime-fim) — ex.: falsificação absorvida pelo estelionato (Súmula 17 STJ). Correta: C.",
  },
  {
    id: "pen4", materia: "penal", nivel: "medio",
    enunciado: "O roubo (art. 157 do CP) terá a pena aumentada (roubo majorado, §2º) em razão de, entre outras hipóteses:",
    alternativas: [
      "Ser praticado por um só agente.",
      "Concurso de duas ou mais pessoas.",
      "Ausência de violência.",
      "Ser cometido contra pessoa jurídica apenas.",
      "O agente ser primário.",
    ],
    correta: 1,
    explicacao: "O §2º do art. 157 majora a pena no CONCURSO DE PESSOAS, restrição da liberdade da vítima, entre outras. (O emprego de arma de fogo hoje está no §2º-A.) Correta: B.",
  },

  /* ===================== DIREITO PROCESSUAL PENAL ===================== */
  {
    id: "pp1", materia: "proc_penal", nivel: "medio",
    enunciado: "A prisão TEMPORÁRIA (Lei 7.960/1989), para crimes comuns nela previstos, tem prazo de:",
    alternativas: ["24 horas, improrrogável", "5 dias, prorrogável por mais 5 em caso de extrema necessidade", "10 dias, improrrogável", "30 dias, prorrogável por mais 30", "90 dias"],
    correta: 1,
    explicacao: "Regra geral: 5 dias + 5 (prorrogável). Em crimes HEDIONDOS o prazo é de 30 + 30 dias. Correta: B.",
  },
  {
    id: "pp2", materia: "proc_penal", nivel: "dificil",
    enunciado: "Sobre o arbitramento de FIANÇA pela autoridade policial, é correto afirmar que o delegado pode concedê-la quando a infração tiver pena privativa de liberdade máxima:",
    alternativas: ["Não superior a 2 anos", "Não superior a 4 anos", "Superior a 4 anos", "De qualquer quantidade", "Apenas em contravenções"],
    correta: 1,
    explicacao: "Art. 322 do CPP: a autoridade policial pode arbitrar fiança quando a pena máxima NÃO for superior a 4 ANOS. Acima disso, só o juiz. Correta: B.",
  },
  {
    id: "pp3", materia: "proc_penal", nivel: "medio",
    enunciado: "A prisão PREVENTIVA (art. 312 do CPP) pode ser decretada para garantia, EXCETO:",
    alternativas: ["Da ordem pública", "Da ordem econômica", "Da conveniência da instrução criminal", "Para assegurar a aplicação da lei penal", "Como antecipação automática da pena"],
    correta: 4,
    explicacao: "Comando EXCETO. A preventiva NUNCA pode ser antecipação de pena (violaria a presunção de inocência). Os demais são fundamentos legais do art. 312. Correta: E.",
  },

  /* ===================== LÍNGUA PORTUGUESA ===================== */
  {
    id: "pt1", materia: "portugues", nivel: "medio",
    enunciado: "Em 'Precisa-se de policiais dedicados', a palavra 'se' é:",
    alternativas: [
      "Pronome apassivador (partícula apassivadora).",
      "Índice de indeterminação do sujeito.",
      "Conjunção integrante.",
      "Conjunção condicional.",
      "Pronome reflexivo.",
    ],
    correta: 1,
    explicacao: "Com verbo transitivo INDIRETO ('precisar de'), o 'se' é ÍNDICE DE INDETERMINAÇÃO DO SUJEITO (verbo fica no singular). Se fosse VTD ('Vendem-se casas'), seria pronome apassivador. Correta: B.",
  },
  {
    id: "pt2", materia: "portugues", nivel: "facil",
    enunciado: "Assinale a alternativa em que o uso da crase está CORRETO.",
    alternativas: [
      "Refiro-me à pessoas de bem.",
      "Cheguei à Brasília na segunda.",
      "Entreguei o relatório à comandante da unidade.",
      "Ele começou à trabalhar cedo.",
      "Vou à qualquer lugar.",
    ],
    correta: 2,
    explicacao: "Crase = preposição 'a' + artigo 'a'. Em 'à comandante' há os dois. Não há crase antes de plural sem artigo, de verbo, nem antes de 'Brasília' (cidade que não pede artigo) ou de pronome indefinido. Correta: C.",
  },
  {
    id: "pt3", materia: "portugues", nivel: "medio",
    enunciado: "Sobre a Redação Oficial, assinale o atributo que NÃO a caracteriza.",
    alternativas: ["Impessoalidade", "Clareza e concisão", "Formalidade e padronização", "Uso de linguagem rebuscada e pessoal", "Uso do padrão culto da linguagem"],
    correta: 3,
    explicacao: "Comando NEGATIVO. A redação oficial NÃO usa linguagem rebuscada nem pessoal — ela é impessoal, clara, concisa e formal. Correta: D.",
  },
  {
    id: "pt4", materia: "portugues", nivel: "medio",
    enunciado: "Na frase 'O policial permaneceu atento durante o patrulhamento', o termo 'atento' classifica-se como:",
    alternativas: ["Objeto direto", "Predicativo do sujeito", "Adjunto adverbial", "Complemento nominal", "Aposto"],
    correta: 1,
    explicacao: "'Permanecer' é verbo de ligação; 'atento' atribui estado ao sujeito 'o policial' — é PREDICATIVO DO SUJEITO. Correta: B.",
  },
];

/* ---------------------------------------------------------------------------
   8) FLASHCARDS — alta densidade, focados no que a AOCP cobra
--------------------------------------------------------------------------------- */
const FLASHCARDS = [
  // Realidade de Goiás (núcleo fechado)
  { id: "f1", materia: "realidade_goias", frente: "O que impulsionou a ocupação de Goiás no séc. XVIII?", verso: "A MINERAÇÃO DO OURO, via bandeiras paulistas (Anhanguera)." },
  { id: "f2", materia: "realidade_goias", frente: "O que foi a Revolta de Trombas e Formoso?", verso: "Conflito AGRÁRIO — resistência camponesa pela posse da terra, no norte goiano (anos 1950)." },
  { id: "f3", materia: "realidade_goias", frente: "Rio que corta Goiânia (bacia cobrada em prova)?", verso: "Rio Meia Ponte." },
  { id: "f4", materia: "realidade_goias", frente: "Quando Goiânia virou capital? E a anterior?", verso: "Goiânia em 1937. A anterior era a Cidade de Goiás (Vila Boa)." },
  { id: "f5", materia: "realidade_goias", frente: "Família oligárquica e chegada da ferrovia na República Velha goiana?", verso: "Oligarquia CAIADO; ferrovia chegou em 1913." },
  { id: "f6", materia: "realidade_goias", frente: "⚠️ O que NÃO cai em Realidade de Goiás?", verso: "ATUALIDADES — zero questões em 3 provas de 2022. Não perca tempo com elas." },

  // Militares
  { id: "f7", materia: "penal_militar", frente: "Prazo de consumação da deserção (CPM)?", verso: "Ausência do serviço por MAIS DE 8 DIAS (art. 187)." },
  { id: "f8", materia: "penal_militar", frente: "Quando cabe pena de morte no CPM?", verso: "SOMENTE em tempo de guerra, executada por fuzilamento. Nunca em tempo de paz." },
  { id: "f9", materia: "penal_militar", frente: "O que caracteriza o MOTIM (art. 149 CPM)?", verso: "Reunião/concurso de militares insurgindo-se contra ordem, disciplina ou autoridade." },
  { id: "f10", materia: "proc_penal_militar", frente: "Quem preside o IPM?", verso: "OFICIAL designado (polícia judiciária militar) — não é delegado civil." },
  { id: "f11", materia: "proc_penal_militar", frente: "O que é MENAGEM?", verso: "Custódia branda: acusado recolhido a local determinado (quartel, cidade). Espécie de liberdade provisória militar." },
  { id: "f12", materia: "proc_penal_militar", frente: "A Justiça Militar Estadual julga civis?", verso: "NÃO. Só militares dos Estados. (Diferente da Justiça Militar da União.)" },

  // Legislação
  { id: "f13", materia: "legislacao", frente: "Requisitos do tráfico privilegiado (art. 33, §4º, Lei de Drogas)?", verso: "Primário + bons antecedentes + não se dedicar ao crime + não integrar organização criminosa (cumulativos). Reduz 1/6 a 2/3." },
  { id: "f14", materia: "legislacao", frente: "Posse x Porte de arma (Estatuto do Desarmamento)?", verso: "POSSE = dentro de casa/trabalho (art. 12). PORTE = trazer consigo fora desses locais (art. 14)." },
  { id: "f15", materia: "legislacao", frente: "Infração de menor potencial ofensivo (JECrim)?", verso: "Contravenções + crimes com pena máxima NÃO superior a 2 anos." },
  { id: "f16", materia: "legislacao", frente: "Qual a lei MAIS cobrada no concurso PMGO 2022?", verso: "Lei de Drogas (11.343/2006) — campeã absoluta em incidência." },

  // Constitucional
  { id: "f17", materia: "constitucional", frente: "Atribuição das PMs (art. 144, §5º)?", verso: "Polícia OSTENSIVA e preservação da ORDEM PÚBLICA." },
  { id: "f18", materia: "constitucional", frente: "Associações: dissolução x suspensão (art. 5º, XIX)?", verso: "DISSOLUÇÃO compulsória → trânsito em julgado. SUSPENSÃO → basta decisão judicial. (Pegadinha AOCP!)" },
  { id: "f19", materia: "constitucional", frente: "Militar pode fazer greve ou se sindicalizar?", verso: "NÃO — ambas vedadas (art. 142, §3º, aplicável aos estaduais)." },

  // Administrativo
  { id: "f20", materia: "administrativo", frente: "Responsabilidade civil do Estado: qual teoria?", verso: "OBJETIVA, teoria do RISCO ADMINISTRATIVO (art. 37, §6º) — admite excludentes (culpa exclusiva da vítima, força maior)." },
  { id: "f21", materia: "administrativo", frente: "O que é a Súmula Vinculante 13?", verso: "Vedação ao NEPOTISMO na Administração Pública." },
  { id: "f22", materia: "administrativo", frente: "LIMPE significa?", verso: "Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência." },

  // Penal / Processo
  { id: "f23", materia: "penal", frente: "Lei penal mais benéfica retroage?", verso: "SIM — alcança até fatos com sentença transitada em julgado (art. 5º, XL, CF)." },
  { id: "f24", materia: "penal", frente: "Excludentes de ilicitude (art. 23 CP)?", verso: "Estado de necessidade; legítima defesa; estrito cumprimento do dever legal; exercício regular de direito." },
  { id: "f25", materia: "proc_penal", frente: "Prazo da prisão temporária?", verso: "5 + 5 dias (comum); 30 + 30 dias (hediondos)." },
  { id: "f26", materia: "proc_penal", frente: "Até que pena o delegado pode arbitrar fiança?", verso: "Pena máxima NÃO superior a 4 anos (art. 322 CPP)." },

  // Português
  { id: "f27", materia: "portugues", frente: "'Se' com verbo transitivo indireto (Precisa-se de...)?", verso: "Índice de indeterminação do sujeito (verbo no singular). Com VTD (Vendem-se casas) = pronome apassivador." },
  { id: "f28", materia: "portugues", frente: "Atributos da Redação Oficial?", verso: "Impessoalidade, clareza, concisão, formalidade, uniformidade e padrão culto. (Nunca rebuscada/pessoal.)" },
];
