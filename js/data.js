/* =========================================================================
   BASE DE DADOS DO SISTEMA — PMGO (Soldado)
   -------------------------------------------------------------------------
   Estrutura do edital, banco de questões e flashcards.
   IMPORTANTE: o conteúdo abaixo foi montado com base no formato típico das
   últimas bancas de concurso da PMGO. SEMPRE confira as matérias e a
   legislação com o EDITAL VIGENTE do seu concurso — leis podem ser alteradas.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   1) MATÉRIAS DO EDITAL
   Cada matéria tem tópicos (conteúdo programático resumido).
--------------------------------------------------------------------------- */
const SUBJECTS = [
  {
    id: "portugues",
    nome: "Língua Portuguesa",
    cor: "#3b82f6",
    peso: 3,
    topicos: [
      "Interpretação e compreensão de texto",
      "Ortografia e acentuação (Novo Acordo)",
      "Classes de palavras (morfologia)",
      "Sintaxe: termos da oração e período composto",
      "Concordância verbal e nominal",
      "Regência verbal e nominal / crase",
      "Pontuação",
      "Semântica: sinônimos, antônimos, sentido conotativo",
      "Coesão e coerência textual",
    ],
  },
  {
    id: "rlm",
    nome: "Raciocínio Lógico-Matemático",
    cor: "#22c55e",
    peso: 2,
    topicos: [
      "Proposições, conectivos e tabelas-verdade",
      "Equivalências e negações (De Morgan)",
      "Argumentos válidos e falácias",
      "Sequências lógicas e numéricas",
      "Razão, proporção, regra de três",
      "Porcentagem e juros",
      "Análise combinatória e probabilidade",
      "Conjuntos e diagramas",
    ],
  },
  {
    id: "informatica",
    nome: "Noções de Informática",
    cor: "#06b6d4",
    peso: 1,
    topicos: [
      "Hardware e software: conceitos",
      "Sistemas operacionais (Windows / Linux)",
      "Editores de texto e planilhas (Office / LibreOffice)",
      "Internet, navegadores e correio eletrônico",
      "Segurança da informação: vírus, malware, backup",
      "Redes e conceitos de nuvem",
    ],
  },
  {
    id: "constitucional",
    nome: "Direito Constitucional",
    cor: "#a855f7",
    peso: 3,
    topicos: [
      "Princípios fundamentais (arts. 1º a 4º)",
      "Direitos e garantias fundamentais (art. 5º)",
      "Direitos sociais e nacionalidade",
      "Organização do Estado",
      "Administração Pública (arts. 37 e 38)",
      "Segurança Pública (art. 144)",
      "Militares dos Estados (art. 42)",
    ],
  },
  {
    id: "administrativo",
    nome: "Direito Administrativo",
    cor: "#f97316",
    peso: 2,
    topicos: [
      "Princípios (LIMPE: legalidade, impessoalidade, moralidade, publicidade, eficiência)",
      "Poderes administrativos",
      "Atos administrativos",
      "Servidores públicos",
      "Improbidade administrativa",
      "Poder de polícia",
    ],
  },
  {
    id: "penal",
    nome: "Direito Penal e Processual Penal",
    cor: "#ef4444",
    peso: 2,
    topicos: [
      "Aplicação da lei penal",
      "Crime: conceito, tipicidade, ilicitude, culpabilidade",
      "Excludentes de ilicitude (legítima defesa, estado de necessidade)",
      "Crimes contra a pessoa e o patrimônio",
      "Crimes contra a Administração Pública",
      "Prisão em flagrante e prisão preventiva",
    ],
  },
  {
    id: "direitos_humanos",
    nome: "Direitos Humanos",
    cor: "#ec4899",
    peso: 2,
    topicos: [
      "Declaração Universal dos Direitos Humanos (1948)",
      "Uso da força e da arma de fogo pelos agentes de segurança",
      "Código de Conduta para Encarregados da Aplicação da Lei (ONU)",
      "Direitos humanos na atuação policial",
    ],
  },
  {
    id: "legislacao_pm",
    nome: "Legislação Institucional PMGO",
    cor: "#eab308",
    peso: 3,
    topicos: [
      "Estatuto da PMGO",
      "Hierarquia e disciplina militar",
      "Deveres, valores e ética militar",
      "Regulamento Disciplinar",
      "Lei Orgânica da PMGO",
    ],
  },
  {
    id: "atualidades_goias",
    nome: "História, Geografia e Atualidades de Goiás",
    cor: "#14b8a6",
    peso: 1,
    topicos: [
      "Formação histórica de Goiás",
      "Geografia física e econômica do estado",
      "Símbolos e divisão política",
      "Atualidades e temas contemporâneos",
    ],
  },
];

/* ---------------------------------------------------------------------------
   2) BANCO DE QUESTÕES
   Formato: { id, materia, enunciado, alternativas[], correta(index), explicacao, nivel }
   nivel: "facil" | "medio" | "dificil"
--------------------------------------------------------------------------- */
const QUESTIONS = [
  // ---------- PORTUGUÊS ----------
  {
    id: "pt1", materia: "portugues", nivel: "facil",
    enunciado: "Assinale a alternativa em que o uso da crase está CORRETO.",
    alternativas: [
      "Refiro-me à pessoas educadas.",
      "Cheguei à Goiânia ontem à noite.",
      "Entreguei o documento à secretária responsável.",
      "Ela começou à estudar cedo.",
    ],
    correta: 2,
    explicacao: "Crase = a (preposição) + a (artigo). Não há crase antes de palavra no plural sem artigo definido ('a pessoas'), nem antes de verbo ('a estudar'), nem antes de nome de cidade que não admite artigo ('a Goiânia'). Em 'à secretária', há preposição exigida por 'entreguei ... a' + artigo 'a'. Correta: letra C.",
  },
  {
    id: "pt2", materia: "portugues", nivel: "medio",
    enunciado: "Em 'Fazem dois anos que ele ingressou na corporação', o verbo 'fazer' foi empregado:",
    alternativas: [
      "Corretamente, concordando com 'dois anos'.",
      "Incorretamente; deveria estar no singular ('Faz dois anos'), pois é impessoal indicando tempo decorrido.",
      "Corretamente, pois admite as duas formas.",
      "Incorretamente; deveria estar no plural com sujeito 'anos'.",
    ],
    correta: 1,
    explicacao: "O verbo 'fazer' indicando tempo decorrido é IMPESSOAL e fica sempre na 3ª pessoa do singular: 'Faz dois anos'. Não tem sujeito. Correta: letra B.",
  },
  {
    id: "pt3", materia: "portugues", nivel: "medio",
    enunciado: "Assinale a frase com concordância nominal CORRETA.",
    alternativas: [
      "É necessário paciência nessa profissão.",
      "É necessária paciência nessa profissão.",
      "Segue anexo as fotos do documento.",
      "Havia bastante pessoas no local.",
    ],
    correta: 1,
    explicacao: "Quando o substantivo vem determinado por artigo/pronome, a expressão 'é necessário/necessária' concorda com ele. Com 'a paciência' (determinado) → 'É necessária'. 'Anexo' concorda com o substantivo ('anexas as fotos') e 'bastante' como adjetivo vai para o plural ('bastantes pessoas'). Correta: letra B.",
  },
  {
    id: "pt4", materia: "portugues", nivel: "facil",
    enunciado: "Na oração 'O soldado permaneceu atento', a palavra 'atento' exerce a função de:",
    alternativas: [
      "Objeto direto",
      "Predicativo do sujeito",
      "Adjunto adnominal",
      "Complemento nominal",
    ],
    correta: 1,
    explicacao: "'Permanecer' é verbo de ligação; 'atento' caracteriza o sujeito 'o soldado', logo é predicativo do sujeito. Correta: letra B.",
  },

  // ---------- RLM ----------
  {
    id: "rlm1", materia: "rlm", nivel: "medio",
    enunciado: "A negação da proposição 'Todo policial é honesto' é:",
    alternativas: [
      "Nenhum policial é honesto.",
      "Todo policial é desonesto.",
      "Existe pelo menos um policial que não é honesto.",
      "Alguns policiais são honestos.",
    ],
    correta: 2,
    explicacao: "A negação de 'Todo A é B' é 'Existe (pelo menos um) A que não é B'. Não é a proposição contrária ('nenhum'). Correta: letra C.",
  },
  {
    id: "rlm2", materia: "rlm", nivel: "medio",
    enunciado: "Se 'Se chove, então a rua fica molhada' é verdadeira, e a rua NÃO está molhada, conclui-se que:",
    alternativas: [
      "Choveu.",
      "Não choveu.",
      "Pode ter chovido.",
      "Nada se pode concluir.",
    ],
    correta: 1,
    explicacao: "Modus tollens: (p→q) e ¬q ⟹ ¬p. Se a rua não está molhada, então não choveu. Correta: letra B.",
  },
  {
    id: "rlm3", materia: "rlm", nivel: "facil",
    enunciado: "Numa corporação, 30% dos 400 candidatos foram aprovados. Quantos foram aprovados?",
    alternativas: ["90", "120", "150", "130"],
    correta: 1,
    explicacao: "30% de 400 = 0,30 × 400 = 120. Correta: letra B.",
  },
  {
    id: "rlm4", materia: "rlm", nivel: "dificil",
    enunciado: "A proposição 'p → q' é logicamente equivalente a:",
    alternativas: [
      "p ∧ ¬q",
      "¬p ∨ q",
      "q → p",
      "¬p ∧ q",
    ],
    correta: 1,
    explicacao: "A condicional p→q equivale a ¬p ∨ q (implicação material). Sua negação seria p ∧ ¬q. Correta: letra B.",
  },

  // ---------- INFORMÁTICA ----------
  {
    id: "inf1", materia: "informatica", nivel: "facil",
    enunciado: "No MS Excel, a fórmula '=SOMA(A1:A5)' realiza:",
    alternativas: [
      "A soma apenas das células A1 e A5.",
      "A soma de todas as células de A1 até A5.",
      "A multiplicação das células A1 a A5.",
      "A média das células A1 a A5.",
    ],
    correta: 1,
    explicacao: "O sinal ':' indica um intervalo contínuo. '=SOMA(A1:A5)' soma A1, A2, A3, A4 e A5. Correta: letra B.",
  },
  {
    id: "inf2", materia: "informatica", nivel: "medio",
    enunciado: "O tipo de malware que se disfarça de programa legítimo para enganar o usuário é o:",
    alternativas: ["Worm", "Cavalo de Troia (Trojan)", "Spyware", "Rootkit"],
    correta: 1,
    explicacao: "O Cavalo de Troia (Trojan) se apresenta como software legítimo/útil para induzir o usuário a executá-lo. Correta: letra B.",
  },
  {
    id: "inf3", materia: "informatica", nivel: "facil",
    enunciado: "O atalho de teclado usado para copiar um item selecionado no Windows é:",
    alternativas: ["Ctrl + X", "Ctrl + V", "Ctrl + C", "Ctrl + Z"],
    correta: 2,
    explicacao: "Ctrl+C = copiar; Ctrl+X = recortar; Ctrl+V = colar; Ctrl+Z = desfazer. Correta: letra C.",
  },

  // ---------- DIREITO CONSTITUCIONAL ----------
  {
    id: "const1", materia: "constitucional", nivel: "medio",
    enunciado: "Segundo o art. 144 da CF/88, a segurança pública é dever do Estado e é exercida, entre outros, pela:",
    alternativas: [
      "Polícia Militar, incumbida da polícia ostensiva e da preservação da ordem pública.",
      "Polícia Militar, incumbida exclusivamente da apuração de infrações penais.",
      "Guarda Municipal, com competência de polícia judiciária.",
      "Polícia Federal, incumbida do policiamento ostensivo estadual.",
    ],
    correta: 0,
    explicacao: "Art. 144, §5º: às polícias militares cabem a polícia ostensiva e a preservação da ordem pública. A apuração de infrações é da polícia civil/judiciária. Correta: letra A.",
  },
  {
    id: "const2", materia: "constitucional", nivel: "facil",
    enunciado: "São fundamentos da República Federativa do Brasil (art. 1º da CF/88), EXCETO:",
    alternativas: [
      "A soberania.",
      "A cidadania.",
      "A dignidade da pessoa humana.",
      "A prevalência dos direitos humanos.",
    ],
    correta: 3,
    explicacao: "A 'prevalência dos direitos humanos' é PRINCÍPIO das relações internacionais (art. 4º), não fundamento do art. 1º. Fundamentos: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e livre iniciativa, pluralismo político. Correta: letra D.",
  },
  {
    id: "const3", materia: "constitucional", nivel: "medio",
    enunciado: "Sobre os militares dos Estados (art. 42 da CF/88), é correto afirmar que:",
    alternativas: [
      "Têm direito à greve e à sindicalização.",
      "São proibidos de greve e de sindicalização.",
      "Podem se filiar a partidos políticos livremente na ativa.",
      "Não se submetem à hierarquia e disciplina.",
    ],
    correta: 1,
    explicacao: "Ao militar são vedados a sindicalização e a greve (art. 142, §3º, IV, aplicável aos militares estaduais por força do art. 42, §1º). Correta: letra B.",
  },

  // ---------- DIREITO ADMINISTRATIVO ----------
  {
    id: "adm1", materia: "administrativo", nivel: "facil",
    enunciado: "Os princípios expressos da Administração Pública no art. 37 da CF/88 são resumidos na sigla LIMPE. O 'E' corresponde a:",
    alternativas: ["Economicidade", "Eficiência", "Eficácia", "Especialidade"],
    correta: 1,
    explicacao: "LIMPE = Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência. Correta: letra B.",
  },
  {
    id: "adm2", materia: "administrativo", nivel: "medio",
    enunciado: "O atributo do ato administrativo que permite sua execução direta pela Administração, independentemente de autorização judicial, é a:",
    alternativas: ["Presunção de legitimidade", "Imperatividade", "Autoexecutoriedade", "Tipicidade"],
    correta: 2,
    explicacao: "A autoexecutoriedade permite que a Administração execute seus próprios atos sem necessidade de intervenção prévia do Judiciário. Correta: letra C.",
  },

  // ---------- DIREITO PENAL ----------
  {
    id: "pen1", materia: "penal", nivel: "medio",
    enunciado: "Age em legítima defesa quem, usando moderadamente dos meios necessários, repele:",
    alternativas: [
      "Injusta agressão, atual ou iminente, a direito seu ou de outrem.",
      "Qualquer agressão, mesmo já cessada.",
      "Agressão futura e incerta.",
      "Ordem legal de autoridade competente.",
    ],
    correta: 0,
    explicacao: "Art. 25 do CP: legítima defesa exige agressão INJUSTA, ATUAL ou IMINENTE, uso MODERADO dos meios NECESSÁRIOS, em defesa de direito próprio ou alheio. Correta: letra A.",
  },
  {
    id: "pen2", materia: "penal", nivel: "facil",
    enunciado: "São excludentes de ilicitude previstas no Código Penal, EXCETO:",
    alternativas: [
      "Estado de necessidade",
      "Legítima defesa",
      "Estrito cumprimento do dever legal",
      "Coação moral irresistível",
    ],
    correta: 3,
    explicacao: "Excludentes de ilicitude (art. 23): estado de necessidade, legítima defesa, estrito cumprimento do dever legal e exercício regular de direito. A coação moral irresistível exclui a CULPABILIDADE, não a ilicitude. Correta: letra D.",
  },

  // ---------- DIREITOS HUMANOS ----------
  {
    id: "dh1", materia: "direitos_humanos", nivel: "facil",
    enunciado: "A Declaração Universal dos Direitos Humanos foi adotada pela Assembleia Geral da ONU no ano de:",
    alternativas: ["1945", "1948", "1966", "1988"],
    correta: 1,
    explicacao: "A DUDH foi proclamada em 10 de dezembro de 1948, em Paris. Correta: letra B.",
  },
  {
    id: "dh2", materia: "direitos_humanos", nivel: "medio",
    enunciado: "Segundo os princípios da ONU sobre o uso da força, os agentes de segurança devem empregar a força:",
    alternativas: [
      "Sempre que houver resistência, sem limites.",
      "Somente quando estritamente necessária e na medida exigida (proporcionalidade).",
      "Livremente, desde que autorizados por superior.",
      "Apenas com arma de fogo.",
    ],
    correta: 1,
    explicacao: "O uso da força deve observar legalidade, necessidade e proporcionalidade — força mínima indispensável ao objetivo legítimo. Correta: letra B.",
  },

  // ---------- LEGISLAÇÃO PM ----------
  {
    id: "leg1", materia: "legislacao_pm", nivel: "facil",
    enunciado: "As bases da instituição militar (Exército, PM, Bombeiro) são:",
    alternativas: [
      "Autonomia e independência.",
      "Hierarquia e disciplina.",
      "Livre iniciativa e mérito.",
      "Colegialidade e consenso.",
    ],
    correta: 1,
    explicacao: "A hierarquia e a disciplina são as bases institucionais das forças militares (art. 42 c/c art. 142 da CF/88). Correta: letra B.",
  },
  {
    id: "leg2", materia: "legislacao_pm", nivel: "medio",
    enunciado: "Na organização militar, 'hierarquia' refere-se principalmente:",
    alternativas: [
      "Ao rigoroso acatamento das leis e regulamentos.",
      "À ordenação da autoridade em graus/postos e à precedência entre militares.",
      "À punição de transgressões disciplinares.",
      "À autonomia de cada militar em decidir suas funções.",
    ],
    correta: 1,
    explicacao: "Hierarquia é a ordenação da autoridade em níveis (postos e graduações). Disciplina é o acatamento às ordens e regulamentos. Correta: letra B.",
  },

  // ---------- ATUALIDADES / GOIÁS ----------
  {
    id: "go1", materia: "atualidades_goias", nivel: "facil",
    enunciado: "A capital do estado de Goiás é:",
    alternativas: ["Anápolis", "Goiânia", "Rio Verde", "Cidade de Goiás"],
    correta: 1,
    explicacao: "Goiânia é a capital de Goiás desde 1937 (a antiga capital era a Cidade de Goiás / Vila Boa). Correta: letra B.",
  },
  {
    id: "go2", materia: "atualidades_goias", nivel: "medio",
    enunciado: "O bioma predominante no estado de Goiás é:",
    alternativas: ["Amazônia", "Caatinga", "Cerrado", "Mata Atlântica"],
    correta: 2,
    explicacao: "Goiás está majoritariamente inserido no bioma Cerrado, o segundo maior do Brasil. Correta: letra C.",
  },
];

/* ---------------------------------------------------------------------------
   3) FLASHCARDS (recordação ativa + revisão espaçada)
   Formato: { id, materia, frente, verso }
--------------------------------------------------------------------------- */
const FLASHCARDS = [
  { id: "f1", materia: "constitucional", frente: "O que a sigla LIMPE representa?", verso: "Princípios da Administração Pública (art. 37, CF): Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência." },
  { id: "f2", materia: "constitucional", frente: "De quem é a atribuição da polícia ostensiva e preservação da ordem pública?", verso: "Das Polícias Militares (art. 144, §5º, CF/88)." },
  { id: "f3", materia: "constitucional", frente: "Quais são os 5 fundamentos da República (art. 1º)?", verso: "Soberania; Cidadania; Dignidade da pessoa humana; Valores sociais do trabalho e da livre iniciativa; Pluralismo político." },
  { id: "f4", materia: "penal", frente: "Requisitos da legítima defesa (art. 25 CP)", verso: "Agressão injusta, atual ou iminente; uso moderado dos meios necessários; defesa de direito próprio ou alheio." },
  { id: "f5", materia: "penal", frente: "Quais são as excludentes de ilicitude (art. 23 CP)?", verso: "Estado de necessidade; Legítima defesa; Estrito cumprimento do dever legal; Exercício regular de direito." },
  { id: "f6", materia: "legislacao_pm", frente: "Quais são as bases das instituições militares?", verso: "Hierarquia e Disciplina." },
  { id: "f7", materia: "direitos_humanos", frente: "Em que ano e por quem foi adotada a DUDH?", verso: "1948, pela Assembleia Geral da ONU (10/12/1948)." },
  { id: "f8", materia: "direitos_humanos", frente: "Princípios do uso da força pelo agente de segurança", verso: "Legalidade, Necessidade e Proporcionalidade — força mínima indispensável." },
  { id: "f9", materia: "rlm", frente: "Como se nega 'Todo A é B'?", verso: "'Existe (algum) A que não é B'. (Nunca use 'Nenhum'.)" },
  { id: "f10", materia: "rlm", frente: "A que equivale 'p → q'?", verso: "¬p ∨ q. Sua negação é: p ∧ ¬q." },
  { id: "f11", materia: "administrativo", frente: "O que é autoexecutoriedade do ato administrativo?", verso: "Poder de a Administração executar seus atos diretamente, sem autorização judicial prévia." },
  { id: "f12", materia: "portugues", frente: "Quando NÃO ocorre crase? (3 casos clássicos)", verso: "Antes de verbo, de palavra masculina, de pronome (em geral) e de plural sem artigo." },
  { id: "f13", materia: "informatica", frente: "O que é um Cavalo de Troia (Trojan)?", verso: "Malware que se disfarça de programa legítimo para enganar o usuário e ser executado." },
  { id: "f14", materia: "atualidades_goias", frente: "Qual o bioma predominante em Goiás?", verso: "Cerrado." },
];
