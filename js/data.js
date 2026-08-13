/* =========================================================================
   BASE DE DADOS DO SISTEMA — PMGO / SOLDADO COMBATENTE
   -------------------------------------------------------------------------
   CALIBRADO PELA PROVA REAL:
     • Banca .......... INSTITUTO AOCP
     • Edital ......... 002/2022 (Soldado de 2ª Classe QPPM — Combatente)
     • Prova .......... 10/07/2022 — 50 questões objetivas + 1 redação
     • Aprovação ...... >= 60% dos 85 pontos da objetiva (= 51 pontos)
                        E NÃO ZERAR EM NENHUMA ÁREA DE CONHECIMENTO.

   Este arquivo contém a ESTRUTURA e a CONFIGURAÇÃO do app:
     SUBJECTS, EXAM, STUDY_PRIORITY, TIME_ALLOCATION, TAF, REDACAO,
     CHECKLIST e FLASHCARDS.
   O banco de QUESTÕES fica em js/questions.js.
   Os RESUMOS de teoria ficam em js/resumos.js.

   ATENÇÃO: sempre confira o EDITAL VIGENTE. O próximo edital deve trazer
   cota racial de 20% (Lei 23.389/2025) e lista única sem teto de vagas
   femininas (ADI 7.490).
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1) MATÉRIAS — grade oficial do Soldado Combatente (Edital 002/2022)
--------------------------------------------------------------------------------- */
const SUBJECTS = [
  {
    id: "constitucional", nome: "Direito Constitucional", cor: "#a855f7",
    questoesProva: 6, pesoProva: 2, pontos: 12, prioridade: 2,
    topicos: [
      "Princípios fundamentais (arts. 1º a 4º)",
      "Direitos e garantias fundamentais (art. 5º) — destaque ao inc. XIX (associações)",
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
  minPontos: 51,
  regraExtra: "Não zerar em NENHUMA área de conhecimento.",
  redacaoMin: 15,
  alternativas: 5,
  semPenalidade: true,
  freqComandoNegativo: 0.16,
};

/* ---------------------------------------------------------------------------
   3) PRIORIDADE DE ESTUDO (densidade pontos/hora)
--------------------------------------------------------------------------------- */
const STUDY_PRIORITY = [
  { faixa: 1, titulo: "Retorno altíssimo — estude primeiro", cor: "#22c55e", itens: [
    { materia: "realidade_goias", nota: "Núcleo fechado e minúsculo. Maior pontos/hora do edital. ~10–15h para 4–5 acertos." },
    { materia: "penal_militar", nota: "Lei seca estável desde 1969. 8 pontos que a maioria ignora." },
    { materia: "proc_penal_militar", nota: "10 pontos em lei seca. Com o Penal Militar somam 18 pts." },
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
   4) TAF
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
   5) REDAÇÃO
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
  estrutura: [
    "Introdução (3–4 linhas): apresente o tema e sua tese com clareza.",
    "Desenvolvimento 1 (6–8 linhas): 1º argumento + dado/exemplo + amarração.",
    "Desenvolvimento 2 (6–8 linhas): 2º argumento por outra ótica.",
    "Conclusão (3–4 linhas): retome a tese e proponha um fechamento/solução.",
  ],
  conectivos: ["Ademais", "Outrossim", "Nesse sentido", "Por conseguinte", "Em contrapartida", "Portanto", "Dessa forma"],
};

/* ---------------------------------------------------------------------------
   6) CHECKLIST NÃO-INTELECTUAL
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
   7) FLASHCARDS — alta densidade, focados no que a AOCP cobra
--------------------------------------------------------------------------------- */
const FLASHCARDS = [
  // ---- Realidade de Goiás ----
  { id: "f1", materia: "realidade_goias", frente: "O que impulsionou a ocupação de Goiás no séc. XVIII?", verso: "A MINERAÇÃO DO OURO, via bandeiras paulistas (Anhanguera — Bartolomeu Bueno da Silva)." },
  { id: "f2", materia: "realidade_goias", frente: "O que foi a Revolta de Trombas e Formoso?", verso: "Conflito AGRÁRIO — resistência camponesa pela posse da terra, no norte goiano (anos 1950)." },
  { id: "f3", materia: "realidade_goias", frente: "Rio que corta Goiânia (bacia cobrada em prova)?", verso: "Rio Meia Ponte." },
  { id: "f4", materia: "realidade_goias", frente: "Quando Goiânia virou capital? E a anterior?", verso: "Goiânia em 1937. A anterior era a Cidade de Goiás (Vila Boa)." },
  { id: "f5", materia: "realidade_goias", frente: "Família oligárquica e chegada da ferrovia na República Velha goiana?", verso: "Oligarquia CAIADO; ferrovia chegou em 1913." },
  { id: "f6", materia: "realidade_goias", frente: "⚠️ O que NÃO cai em Realidade de Goiás?", verso: "ATUALIDADES — zero questões em 3 provas de 2022." },
  { id: "f7", materia: "realidade_goias", frente: "Qual o bioma predominante em Goiás?", verso: "Cerrado (2º maior bioma do Brasil)." },
  { id: "f8", materia: "realidade_goias", frente: "Chapada dos Veadeiros — importância no relevo?", verso: "Concentra os pontos de MAIOR ALTITUDE de Goiás." },

  // ---- Penal Militar ----
  { id: "f10", materia: "penal_militar", frente: "Prazo de consumação da deserção (CPM)?", verso: "Ausência do serviço por MAIS DE 8 DIAS (art. 187)." },
  { id: "f11", materia: "penal_militar", frente: "Quando cabe pena de morte no CPM?", verso: "SOMENTE em tempo de guerra, por fuzilamento. Nunca em tempo de paz." },
  { id: "f12", materia: "penal_militar", frente: "O que caracteriza o MOTIM (art. 149 CPM)?", verso: "Reunião/concurso de militares insurgindo-se contra ordem, disciplina ou autoridade." },
  { id: "f13", materia: "penal_militar", frente: "Teoria adotada quanto ao LUGAR do crime?", verso: "Ubiquidade (mista): ação/omissão E resultado." },
  { id: "f14", materia: "penal_militar", frente: "Teoria adotada quanto ao TEMPO do crime?", verso: "Teoria da atividade: momento da ação/omissão." },
  { id: "f15", materia: "penal_militar", frente: "Penas principais do CPM (cite 3)?", verso: "Morte, reclusão, detenção, prisão, impedimento, suspensão do exercício do posto, reforma." },
  { id: "f16", materia: "penal_militar", frente: "Embriaguez em serviço é crime militar?", verso: "Sim (art. 202 do CPM) — embriagar-se em serviço ou apresentar-se embriagado." },

  // ---- Processual Penal Militar ----
  { id: "f20", materia: "proc_penal_militar", frente: "Quem preside o IPM?", verso: "OFICIAL designado (polícia judiciária militar) — não é delegado civil." },
  { id: "f21", materia: "proc_penal_militar", frente: "O que é MENAGEM?", verso: "Custódia branda: acusado recolhido a local determinado (quartel, cidade). Liberdade provisória militar." },
  { id: "f22", materia: "proc_penal_militar", frente: "A Justiça Militar Estadual julga civis?", verso: "NÃO. Só militares dos Estados. (A da União pode julgar civis.)" },
  { id: "f23", materia: "proc_penal_militar", frente: "Crime doloso contra a vida de civil por militar estadual: quem julga?", verso: "Tribunal do Júri (Justiça comum)." },
  { id: "f24", materia: "proc_penal_militar", frente: "Prazo do IPM (militar preso x solto)?", verso: "20 dias se preso; 40 dias se solto (prorrogável), no CPPM." },

  // ---- Legislação Extravagante ----
  { id: "f30", materia: "legislacao", frente: "Requisitos do tráfico privilegiado (art. 33, §4º)?", verso: "Primário + bons antecedentes + não se dedicar ao crime + não integrar organização criminosa. Reduz 1/6 a 2/3." },
  { id: "f31", materia: "legislacao", frente: "Posse x Porte de arma?", verso: "POSSE = casa/trabalho (art. 12). PORTE = trazer consigo fora desses locais (art. 14)." },
  { id: "f32", materia: "legislacao", frente: "Infração de menor potencial ofensivo (JECrim)?", verso: "Contravenções + crimes com pena máxima NÃO superior a 2 anos." },
  { id: "f33", materia: "legislacao", frente: "Lei MAIS cobrada no concurso PMGO 2022?", verso: "Lei de Drogas (11.343/2006)." },
  { id: "f34", materia: "legislacao", frente: "Maria da Penha admite cesta básica/multa isolada?", verso: "NÃO (art. 17 veda). E afasta o JECrim (art. 41)." },
  { id: "f35", materia: "legislacao", frente: "Quais crimes são equiparados a hediondos?", verso: "Tráfico, tortura e terrorismo (os '3 T' do art. 5º, XLIII, CF)." },
  { id: "f36", materia: "legislacao", frente: "Porte de droga para consumo (art. 28): tem prisão?", verso: "NÃO. Penas: advertência, prestação de serviços e medida educativa. Não gera reincidência com pena de prisão." },

  // ---- Constitucional ----
  { id: "f40", materia: "constitucional", frente: "Atribuição das PMs (art. 144, §5º)?", verso: "Polícia OSTENSIVA e preservação da ORDEM PÚBLICA." },
  { id: "f41", materia: "constitucional", frente: "Associações: dissolução x suspensão (art. 5º, XIX)?", verso: "DISSOLUÇÃO compulsória → trânsito em julgado. SUSPENSÃO → basta decisão judicial. (Pegadinha AOCP!)" },
  { id: "f42", materia: "constitucional", frente: "Militar pode fazer greve ou se sindicalizar?", verso: "NÃO — ambas vedadas (art. 142, §3º, aplicável aos estaduais)." },
  { id: "f43", materia: "constitucional", frente: "Órgãos da segurança pública (art. 144)?", verso: "Polícia Federal; PRF; PFF; Polícias Civis; PM e Corpo de Bombeiros Militar; polícias penais." },
  { id: "f44", materia: "constitucional", frente: "5 fundamentos da República (art. 1º)?", verso: "Soberania, Cidadania, Dignidade da pessoa humana, Valores sociais do trabalho e livre iniciativa, Pluralismo político." },
  { id: "f45", materia: "constitucional", frente: "Cláusulas pétreas (art. 60, §4º)?", verso: "Forma federativa; voto direto/secreto/universal/periódico; separação dos Poderes; direitos e garantias individuais." },

  // ---- Administrativo ----
  { id: "f50", materia: "administrativo", frente: "Responsabilidade civil do Estado: qual teoria?", verso: "OBJETIVA, teoria do RISCO ADMINISTRATIVO (art. 37, §6º) — admite excludentes." },
  { id: "f51", materia: "administrativo", frente: "O que é a Súmula Vinculante 13?", verso: "Vedação ao NEPOTISMO na Administração Pública." },
  { id: "f52", materia: "administrativo", frente: "LIMPE significa?", verso: "Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência." },
  { id: "f53", materia: "administrativo", frente: "Atributos do ato administrativo (PATI)?", verso: "Presunção de legitimidade, Autoexecutoriedade, Tipicidade, Imperatividade." },
  { id: "f54", materia: "administrativo", frente: "Poderes administrativos (cite)?", verso: "Vinculado, Discricionário, Hierárquico, Disciplinar, Regulamentar e de Polícia." },
  { id: "f55", materia: "administrativo", frente: "Espécies de atos de improbidade (Lei 8.429)?", verso: "Enriquecimento ilícito, Prejuízo ao erário e Atentado a princípios (após a Lei 14.230/21, exige dolo)." },

  // ---- Penal ----
  { id: "f60", materia: "penal", frente: "Lei penal mais benéfica retroage?", verso: "SIM — alcança até fatos com sentença transitada em julgado (art. 5º, XL, CF)." },
  { id: "f61", materia: "penal", frente: "Excludentes de ilicitude (art. 23 CP)?", verso: "Estado de necessidade; legítima defesa; estrito cumprimento do dever legal; exercício regular de direito." },
  { id: "f62", materia: "penal", frente: "Requisitos da legítima defesa (art. 25)?", verso: "Agressão injusta, atual ou iminente; uso moderado dos meios necessários; direito próprio ou alheio." },
  { id: "f63", materia: "penal", frente: "Princípios do conflito aparente de normas?", verso: "Especialidade, Subsidiariedade, Consunção (absorção) e Alternatividade." },
  { id: "f64", materia: "penal", frente: "Tempo do crime no CP — qual teoria?", verso: "Teoria da ATIVIDADE (art. 4º): momento da ação/omissão, ainda que outro o resultado." },

  // ---- Processual Penal ----
  { id: "f70", materia: "proc_penal", frente: "Prazo da prisão temporária?", verso: "5 + 5 dias (comum); 30 + 30 dias (hediondos)." },
  { id: "f71", materia: "proc_penal", frente: "Até que pena o delegado arbitra fiança?", verso: "Pena máxima NÃO superior a 4 anos (art. 322 CPP)." },
  { id: "f72", materia: "proc_penal", frente: "Fundamentos da prisão preventiva (art. 312)?", verso: "Garantia da ordem pública, ordem econômica, conveniência da instrução, aplicação da lei penal." },
  { id: "f73", materia: "proc_penal", frente: "Audiência de custódia: prazo?", verso: "Em até 24 horas da prisão, o preso é apresentado ao juiz." },

  // ---- Português ----
  { id: "f80", materia: "portugues", frente: "'Se' com VTI (Precisa-se de...)?", verso: "Índice de indeterminação do sujeito (verbo no singular). Com VTD (Vendem-se casas) = pronome apassivador." },
  { id: "f81", materia: "portugues", frente: "Atributos da Redação Oficial?", verso: "Impessoalidade, clareza, concisão, formalidade, uniformidade e padrão culto. (Nunca rebuscada/pessoal.)" },
  { id: "f82", materia: "portugues", frente: "Quando NÃO ocorre crase?", verso: "Antes de verbo, palavra masculina, pronome (em geral) e plural sem artigo." },
  { id: "f83", materia: "portugues", frente: "Próclise é atraída por quê?", verso: "Palavras negativas, advérbios, pronomes relativos/indefinidos, conjunções subordinativas ('que', 'não', 'sempre')." },
];
