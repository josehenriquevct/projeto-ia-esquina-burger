/* =========================================================================
   RESUMOS DE TEORIA — por matéria (foco no que a AOCP cobra na PMGO)
   -------------------------------------------------------------------------
   Cada matéria tem seções { titulo, pontos[] }. É material de revisão rápida,
   não substitui a lei seca. Confira sempre a legislação vigente.
   ========================================================================= */

const RESUMOS = {
  realidade_goias: [
    { titulo: "Formação histórica", pontos: [
      "Séc. XVIII: ocupação pela MINERAÇÃO DO OURO, via bandeiras paulistas (Anhanguera / Bartolomeu Bueno da Silva).",
      "Fundação de arraiais e de Vila Boa (atual Cidade de Goiás), primeira capital.",
      "Com a decadência do ouro (fim do séc. XVIII), a economia migrou para a PECUÁRIA e a agricultura de subsistência.",
      "Mão de obra escravizada foi amplamente usada nas minas.",
    ]},
    { titulo: "República Velha e século XX", pontos: [
      "Domínio OLIGÁRQUICO, com destaque para a família CAIADO.",
      "Chegada da FERROVIA em 1913, integrando Goiás ao Sudeste.",
      "1930s: interventoria de Pedro Ludovico Teixeira; construção e transferência da capital para GOIÂNIA (1937), cidade planejada.",
      "1950s: Revolta de TROMBAS E FORMOSO — conflito agrário/resistência camponesa no norte goiano.",
    ]},
    { titulo: "Geografia", pontos: [
      "Bioma predominante: CERRADO (2º maior do Brasil).",
      "Clima TROPICAL com estação seca (inverno) e chuvosa (verão).",
      "Relevo: chapadas e planaltos; CHAPADA DOS VEADEIROS concentra as maiores altitudes.",
      "Hidrografia: Rio ARAGUAIA (divisa oeste), Rio MEIA PONTE (corta Goiânia); área de nascentes (dispersor de águas).",
      "Economia atual: forte AGROPECUÁRIA e agroindústria (grãos, carne, sucroenergético).",
    ]},
    { titulo: "⚠️ Estratégia", pontos: [
      "Núcleo FECHADO — em 2022 caíram: mineração, Trombas e Formoso, escravidão/indígenas, República Velha/Caiado/ferrovia, Meia Ponte, Chapada dos Veadeiros.",
      "NÃO caiu atualidades, construção de Goiânia/Brasília como tema, agronegócio moderno — apesar de previstos. Foque no núcleo histórico e na geografia física.",
    ]},
  ],

  penal_militar: [
    { titulo: "Aplicação da lei penal militar", pontos: [
      "TEMPO do crime: teoria da ATIVIDADE (momento da ação/omissão).",
      "LUGAR do crime: teoria da UBIQUIDADE (ação e/ou resultado).",
      "Crime militar é o DEFINIDO EM LEI (CPM) — art. 9º (tempo de paz) e art. 10 (tempo de guerra).",
      "Menores de 18 anos: INIMPUTÁVEIS (legislação especial).",
    ]},
    { titulo: "Penas", pontos: [
      "Principais: morte, reclusão, detenção, prisão, IMPEDIMENTO, suspensão do exercício do posto, reforma.",
      "PENA DE MORTE: só em TEMPO DE GUERRA, por fuzilamento. Nunca em tempo de paz.",
      "IMPEDIMENTO: permanência na unidade sem ir além de seus limites, sem prejuízo da instrução.",
    ]},
    { titulo: "Crimes militares em espécie", pontos: [
      "DESERÇÃO (art. 187): ausência do serviço por MAIS DE 8 DIAS (prazo de graça). Crime propriamente militar.",
      "MOTIM (art. 149): reunião/concurso de militares contra a ordem, disciplina ou autoridade.",
      "INSUBORDINAÇÃO/recusa de obediência (art. 163): recusar ordem legítima de superior.",
      "EMBRIAGUEZ EM SERVIÇO (art. 202); PECULATO (apropriar-se de valor de que se tem posse pelo cargo).",
    ]},
  ],

  proc_penal_militar: [
    { titulo: "Polícia judiciária militar e IPM", pontos: [
      "Polícia judiciária militar: comandantes/autoridades militares e oficiais por delegação (art. 7º).",
      "IPM: procedimento ADMINISTRATIVO, INQUISITIVO e PREPARATÓRIO; presidido por OFICIAL designado; inicia por PORTARIA.",
      "Prazo do IPM: 20 dias se indiciado PRESO; 40 dias se SOLTO (prorrogável).",
    ]},
    { titulo: "Ação penal e competência", pontos: [
      "Ação penal militar: PÚBLICA INCONDICIONADA, promovida pelo MP por DENÚNCIA (art. 121).",
      "Justiça Militar Estadual: julga MILITARES dos Estados nos crimes militares; NÃO julga civis.",
      "Crime DOLOSO CONTRA A VIDA DE CIVIL por militar estadual → Tribunal do JÚRI (Justiça comum).",
      "1º grau: juiz de direito + Conselhos de Justiça (juiz togado + oficiais = escabinato).",
    ]},
    { titulo: "Institutos próprios", pontos: [
      "MENAGEM: custódia branda — recolhimento a local determinado (quartel, cidade).",
      "PROCESSO ESPECIAL DE DESERÇÃO: rito próprio, termo de deserção, agregação do oficial.",
      "Nulidades: princípio 'pas de nullité sans grief' (não há nulidade sem prejuízo).",
    ]},
  ],

  legislacao: [
    { titulo: "Lei de Drogas (11.343/2006) — a MAIS cobrada", pontos: [
      "TRÁFICO (art. 33): equiparado a HEDIONDO.",
      "TRÁFICO PRIVILEGIADO (§4º): primário + bons antecedentes + não se dedicar ao crime + não integrar organização → redução de 1/6 a 2/3 (cumulativos).",
      "USUÁRIO (art. 28): SEM pena de prisão — advertência, prestação de serviços e medida educativa.",
      "Associação para o tráfico (art. 35) ≠ organização criminosa (Lei 12.850/13).",
    ]},
    { titulo: "Estatuto do Desarmamento (10.826/2003)", pontos: [
      "POSSE (art. 12): manter arma em casa/trabalho. PORTE (art. 14): trazer consigo fora desses locais.",
      "DISPARO de arma de fogo (art. 15): crime autônomo, salvo meio para crime mais grave.",
      "Arma de uso RESTRITO (art. 16): equiparado a hediondo.",
      "Idade mínima para adquirir arma (particular): 25 anos.",
    ]},
    { titulo: "Outras leis", pontos: [
      "HEDIONDOS (8.072/90): inafiançáveis, insuscetíveis de anistia, graça e indulto. Equiparados: Tráfico, Tortura, Terrorismo (3 T).",
      "JECrim (9.099/95): IMPO = pena máx. até 2 anos. Transação penal (art. 76); sursis processual (art. 89, pena mín. até 1 ano).",
      "MARIA DA PENHA (11.340/06): afasta o JECrim (art. 41); veda cesta básica/multa isolada (art. 17); lesão é ação pública incondicionada.",
      "ECA (8.069/90): criança até 12 anos incompletos; corrupção de menores (art. 244-B). CRIMES AMBIENTAIS (9.605/98): admite responsabilidade penal da pessoa jurídica.",
      "(CFO) Estatuto dos PM de Goiás: Lei estadual 8.033/1975.",
    ]},
  ],

  constitucional: [
    { titulo: "Princípios e direitos fundamentais", pontos: [
      "Fundamentos da República (art. 1º): Soberania, Cidadania, Dignidade da pessoa humana, Valores sociais do trabalho e livre iniciativa, Pluralismo político.",
      "Art. 5º, XIX (associações): DISSOLUÇÃO compulsória exige trânsito em julgado; SUSPENSÃO basta decisão judicial.",
      "Racismo (XLII): inafiançável e imprescritível. Tráfico/tortura/terrorismo (XLIII): inafiançáveis, insuscetíveis de graça/anistia.",
      "Tratados de DH por 3/5, 2 turnos (art. 5º, §3º): equivalem a EMENDA CONSTITUCIONAL.",
      "Inviolabilidade do domicílio (XI): entrada sem consentimento em flagrante, desastre, socorro (qualquer hora) ou, de DIA, com ordem judicial.",
    ]},
    { titulo: "Segurança pública e militares", pontos: [
      "Art. 144: segurança pública é dever do Estado, direito e responsabilidade de todos.",
      "Às PMs cabem a POLÍCIA OSTENSIVA e a PRESERVAÇÃO DA ORDEM PÚBLICA (§5º). São forças auxiliares e reserva do Exército (§6º).",
      "Militares estaduais (art. 42 c/c 142): VEDADAS greve e sindicalização; bases = hierarquia e disciplina.",
    ]},
    { titulo: "Organização e controle", pontos: [
      "Cláusulas pétreas (art. 60, §4º): forma federativa; voto direto/secreto/universal/periódico; separação dos Poderes; direitos e garantias individuais.",
      "Sucessão presidencial: vacância dos 2 cargos nos 2 primeiros anos → eleição direta em 90 dias; nos 2 últimos → indireta pelo Congresso.",
      "Administração (art. 37): concurso público; validade até 2 anos + 1 prorrogação; LIMPE.",
    ]},
  ],

  administrativo: [
    { titulo: "Princípios e poderes", pontos: [
      "LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência.",
      "Súmula Vinculante 13: veda NEPOTISMO.",
      "Poderes: vinculado, discricionário, hierárquico, disciplinar, regulamentar (Executivo) e de POLÍCIA.",
      "Autotutela (Súmulas 346/473 STF): anula os atos ilegais e revoga os inconvenientes.",
    ]},
    { titulo: "Atos administrativos", pontos: [
      "Elementos: COmpetência, FInalidade, FOrma, MOtivo, Objeto.",
      "Atributos: Presunção de legitimidade, Autoexecutoriedade, Tipicidade, Imperatividade.",
      "ANULAÇÃO: vício de legalidade, efeitos EX TUNC. REVOGAÇÃO: conveniência/oportunidade, ato legal, efeitos EX NUNC.",
    ]},
    { titulo: "Responsabilidade e improbidade", pontos: [
      "Responsabilidade civil (art. 37, §6º): OBJETIVA (risco administrativo) para condutas comissivas, com excludentes; OMISSÃO genérica → subjetiva.",
      "Improbidade (Lei 8.429/92, após 14.230/21): exige DOLO. Espécies: enriquecimento ilícito, prejuízo ao erário, atentado a princípios.",
      "Administração indireta: autarquias, fundações, empresas públicas e sociedades de economia mista.",
    ]},
  ],

  penal: [
    { titulo: "Lei penal no tempo e no espaço", pontos: [
      "Legalidade/anterioridade (art. 1º): não há crime sem lei anterior.",
      "Lei mais benéfica RETROAGE, mesmo após trânsito em julgado (art. 5º, XL, CF). Lei mais grave não retroage.",
      "Leis temporárias/excepcionais: ULTRATIVIDADE (art. 3º).",
      "TEMPO do crime: teoria da ATIVIDADE (art. 4º). LUGAR: ubiquidade (art. 6º).",
    ]},
    { titulo: "Teoria do crime", pontos: [
      "Iter criminis: cogitação (impunível) → preparação → execução → consumação.",
      "Tentativa (art. 14, II): execução iniciada, não consumação por circunstâncias ALHEIAS; pena reduzida 1/3 a 2/3.",
      "Desistência voluntária/arrependimento eficaz (art. 15): responde só pelos atos já praticados.",
      "Excludentes de ILICITUDE (art. 23): estado de necessidade, legítima defesa, estrito cumprimento do dever legal, exercício regular de direito.",
      "Descriminante putativa (art. 20, §1º): supor situação de fato que legitimaria a conduta.",
    ]},
    { titulo: "Crimes patrimoniais e Maria da Penha", pontos: [
      "Furto (155): sem violência. Roubo (157): com violência/grave ameaça; §2º majora (concurso de pessoas etc.); §2º-A arma de fogo.",
      "Legítima defesa (art. 25): agressão injusta, atual/iminente, meios necessários e moderados.",
    ]},
  ],

  proc_penal: [
    { titulo: "Inquérito e princípios", pontos: [
      "IP: administrativo, inquisitivo e preparatório. Preso: 10 dias; solto: 30 (prorrogável).",
      "Ação pública incondicionada: delegado instaura de ofício.",
      "Presunção de inocência (art. 5º, LVII): culpa só com trânsito em julgado.",
    ]},
    { titulo: "Prisões cautelares (tema mais rentável)", pontos: [
      "FLAGRANTE: próprio, impróprio (logo após) e presumido. Qualquer um PODE prender; autoridade DEVE.",
      "Flagrante PREPARADO é nulo (Súmula 145 STF); flagrante ESPERADO é válido.",
      "PREVENTIVA (art. 312): garantia da ordem pública/econômica, conveniência da instrução, aplicação da lei penal. Nunca antecipação de pena.",
      "TEMPORÁRIA (Lei 7.960): 5+5 dias (comum); 30+30 (hediondos).",
      "Audiência de custódia em até 24h. FIANÇA pelo delegado: pena máx. até 4 anos.",
    ]},
  ],

  portugues: [
    { titulo: "Padrão AOCP (recorte estreito)", pontos: [
      "Prova amarrada a UM texto; foco em interpretação, coesão/referência e relação semântica de conectivos.",
      "Classificação do 'SE': apassivador (VTD: Vendem-se casas), índice de indeterminação (VTI: Precisa-se de), integrante, condicional, parte do verbo pronominal.",
      "Colocação pronominal: próclise atraída por negativas, advérbios, relativos, indefinidos e conjunções subordinativas.",
    ]},
    { titulo: "Gramática de alto retorno", pontos: [
      "Concordância: 'fazer' (tempo) e 'haver' (existir) são impessoais → singular ('Faz dois anos', 'Havia pessoas').",
      "Regência: assistir (ver) = VTI com 'a' (assistir AO filme); chegar/ir pedem 'a'.",
      "Crase: NÃO antes de verbo, palavra masculina, pronome (em geral) e plural sem artigo.",
    ]},
    { titulo: "Redação Oficial (item mais previsível)", pontos: [
      "Atributos: impessoalidade, clareza, concisão, formalidade, uniformidade e padrão culto.",
      "NUNCA linguagem rebuscada ou pessoal.",
    ]},
  ],
};
