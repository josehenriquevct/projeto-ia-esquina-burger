/* =========================================================================
   TRILHA DE AULAS — conteúdo para APRENDER + teste de fixação
   -------------------------------------------------------------------------
   Cada matéria tem aulas na ordem didática. Cada aula:
     { id, titulo, min (min. leitura), blocos[], questoes[] (ids p/ testar) }
   Blocos: { p } parágrafo · { h } subtítulo · { box } destaque ·
           { lista:[] } · { ex } exemplo/macete
   Ao final, o aluno faz o teste de fixação (>=70% domina a aula).
   Material de estudo — confira sempre a legislação vigente.
   ========================================================================= */

const AULAS = {

  /* ===================== REALIDADE DE GOIÁS ===================== */
  realidade_goias: [
    { id: "go_a1", titulo: "Formação histórica: ouro, escravidão e povos indígenas", min: 6,
      blocos: [
        { p: "A história de Goiás começa a ganhar corpo no <strong>século XVIII</strong>, quando as <strong>bandeiras paulistas</strong> — expedições que partiam de São Paulo em busca de riquezas e mão de obra — chegaram ao interior do Brasil Central. O nome que você precisa gravar é o do <strong>Anhanguera</strong> (Bartolomeu Bueno da Silva, pai e filho): é ele o marco da descoberta do ouro na região." },
        { h: "O ciclo do ouro" },
        { p: "A descoberta de ouro provocou uma corrida: surgiram <strong>arraiais</strong> (povoados de mineração) e nasceu <strong>Vila Boa</strong>, atual <strong>Cidade de Goiás</strong>, que seria a primeira capital. A economia colonial girou quase inteiramente em torno da <strong>mineração</strong>." },
        { box: "Não existiu indústria têxtil nem café na Goiás colonial. Se a prova disser isso, está errada. A base era MINERAÇÃO e, depois, PECUÁRIA." },
        { p: "Com o <strong>esgotamento das minas</strong> no fim do século XVIII, veio a decadência. A economia migrou para a <strong>pecuária</strong> e a agricultura de subsistência, e Goiás entrou num longo período de estagnação e isolamento." },
        { h: "Escravidão e povos indígenas" },
        { p: "A <strong>mão de obra escravizada</strong> (africana) foi amplamente usada nas minas — tema recorrente em prova. O território também era habitado por diversos <strong>povos indígenas</strong>; entre os associados a Goiás estão os <strong>Karajá</strong>, os <strong>Avá-Canoeiro</strong> e, na região, os <strong>Xavante</strong>." },
        { ex: "Macete: OURO → escravidão + Anhanguera + Vila Boa. Decadência do ouro → PECUÁRIA. Esse encadeamento responde a maioria das questões de história colonial goiana." },
      ],
      questoes: ["go1", "go2", "go8", "go10", "go11", "go12"] },

    { id: "go_a2", titulo: "República Velha e a construção de Goiânia", min: 5,
      blocos: [
        { p: "Na <strong>Primeira República (República Velha)</strong>, Goiás foi dominado por <strong>oligarquias</strong> — grupos de famílias poderosas que controlavam a política local. A família que você precisa lembrar é a <strong>Caiado</strong>." },
        { p: "Um marco econômico e de integração foi a chegada da <strong>ferrovia em 1913</strong>, que ligou Goiás ao Sudeste e ajudou a quebrar o isolamento do estado." },
        { h: "A mudança da capital" },
        { p: "Na década de <strong>1930</strong>, sob a interventoria de <strong>Pedro Ludovico Teixeira</strong>, decidiu-se transferir a capital da antiga Cidade de Goiás para uma cidade <strong>planejada</strong>: <strong>Goiânia</strong>, que se tornou capital em <strong>1937</strong>." },
        { box: "Datas-chave: ferrovia 1913 · Goiânia capital 1937. A antiga capital (Cidade de Goiás / Vila Boa) é hoje Patrimônio da Humanidade (UNESCO)." },
        { ex: "Cuidado: Goiânia é cidade PLANEJADA dos anos 1930 — não surgiu com a mineração. Confundir isso é pegadinha clássica." },
      ],
      questoes: ["go5", "go6", "go9", "go15"] },

    { id: "go_a3", titulo: "Geografia: relevo, águas, clima, bioma e economia", min: 6,
      blocos: [
        { h: "Bioma e clima" },
        { p: "Goiás está majoritariamente no bioma <strong>Cerrado</strong> — o segundo maior do Brasil. O clima é <strong>tropical</strong>, com duas estações bem marcadas: <strong>seca no inverno</strong> e <strong>chuvosa no verão</strong>." },
        { h: "Relevo e hidrografia" },
        { p: "O relevo é de <strong>planaltos e chapadas</strong>. A <strong>Chapada dos Veadeiros</strong> concentra os <strong>pontos de maior altitude</strong> do estado. Por estar no Planalto Central, Goiás é uma importante <strong>área de nascentes</strong> (dispersor de águas)." },
        { p: "Rios que caem em prova: o <strong>Araguaia</strong> (faz a divisa a oeste) e o <strong>Meia Ponte</strong>, que <strong>corta Goiânia</strong> — este último foi cobrado diretamente em 2022." },
        { h: "Economia atual" },
        { p: "Hoje a economia goiana é puxada pela <strong>agropecuária e agroindústria</strong>: grãos (soja, milho), carne e o setor sucroenergético." },
        { box: "⚠️ Estratégia: em 3 provas de 2022 NÃO caiu ATUALIDADES. Foque no núcleo histórico + geografia física. Não perca tempo com notícias." },
      ],
      questoes: ["go3", "go4", "go7", "go13", "go14", "go16"] },
  ],

  /* ===================== DIREITO PENAL MILITAR ===================== */
  penal_militar: [
    { id: "pm_a1", titulo: "Aplicação da lei penal militar e o conceito de crime militar", min: 6,
      blocos: [
        { p: "O <strong>Código Penal Militar (CPM — Decreto-Lei 1.001/69)</strong> é lei antiga e estável: por isso é ouro em concurso, cai muito em <strong>lei seca</strong> e quase ninguém estuda a fundo." },
        { h: "Tempo e lugar do crime" },
        { p: "Duas teorias que você <strong>não pode confundir</strong>:" },
        { lista: [
          "<strong>TEMPO</strong> do crime → teoria da <strong>ATIVIDADE</strong>: considera-se praticado no momento da <strong>ação ou omissão</strong>, ainda que o resultado seja outro.",
          "<strong>LUGAR</strong> do crime → teoria da <strong>UBIQUIDADE</strong> (mista): o local é tanto o da <strong>conduta</strong> quanto o do <strong>resultado</strong>.",
        ] },
        { ex: "Macete: TAtu no LUgar → Tempo=Atividade, Lugar=Ubiquidade. Vale para o CP comum e para o CPM." },
        { h: "O que é crime militar?" },
        { p: "Crime militar é o <strong>definido em lei</strong> (critério legal). O CPM prevê crimes em <strong>tempo de paz</strong> (art. 9º) e em <strong>tempo de guerra</strong> (art. 10). Menores de 18 anos são <strong>inimputáveis</strong>, sujeitos à legislação especial (ECA)." },
        { box: "A banca AOCP adora cobrar o 'periférico': leia ao menos uma vez os crimes de TEMPO DE GUERRA. Caiu prazo de IPM em tempo de guerra na prova real." },
      ],
      questoes: ["pm1", "pm5", "pm7", "pm10", "pm14"] },

    { id: "pm_a2", titulo: "As penas no CPM (com atenção à pena de morte)", min: 5,
      blocos: [
        { p: "As <strong>penas principais</strong> do CPM são: <strong>morte, reclusão, detenção, prisão, impedimento, suspensão do exercício do posto</strong> e <strong>reforma</strong>." },
        { box: "PEGADINHA CAMPEÃ: a PENA DE MORTE só existe em TEMPO DE GUERRA, executada por FUZILAMENTO. Nunca em tempo de paz. Se a questão disser 'pode ser aplicada em tempo de paz', está ERRADA." },
        { p: "A pena de <strong>impedimento</strong> é peculiar: o condenado <strong>permanece na unidade</strong>, sem poder ir além de seus limites, mas <strong>sem prejuízo da instrução militar</strong>." },
        { p: "Diferente do CP comum, a <strong>multa não é pena principal geral</strong> no CPM — não caia nessa troca." },
        { ex: "Para gravar as principais: 'Morte, Reclusão, Detenção, Prisão, Impedimento, Suspensão, Reforma'. Note que é uma escala do mais grave ao mais brando." },
      ],
      questoes: ["pm3", "pm8", "pm9", "pm15"] },

    { id: "pm_a3", titulo: "Crimes militares em espécie: deserção, motim e cia.", min: 6,
      blocos: [
        { h: "Deserção (art. 187)" },
        { p: "O crime mais cobrado. A deserção <strong>consuma-se após decorridos 8 dias</strong> de ausência do serviço — o chamado <strong>'prazo de graça'</strong>. É crime <strong>propriamente militar</strong> (só o militar pode cometer)." },
        { box: "Fixe o número: MAIS DE 8 DIAS. Se a questão falar '1 dia', '3 dias' ou '15 dias' como regra, está errada." },
        { h: "Motim e insubordinação" },
        { p: "<strong>Motim (art. 149)</strong> exige <strong>concurso de militares</strong> — um grupo reunido se insurgindo contra a ordem, a disciplina ou a autoridade. Ação isolada NÃO é motim." },
        { p: "<strong>Insubordinação / recusa de obediência (art. 163)</strong>: recusar-se a cumprir ordem legítima de superior sobre matéria de serviço." },
        { h: "Outros que caem" },
        { p: "<strong>Embriaguez em serviço (art. 202)</strong>: embriagar-se ou apresentar-se embriagado em serviço. <strong>Peculato</strong>: apropriar-se de dinheiro/valor de que se tem posse em razão do cargo." },
        { ex: "Motim = MUITOS militares (concurso). Deserção = ausência > 8 dias. Não misture os dois." },
      ],
      questoes: ["pm2", "pm4", "pm6", "pm11", "pm12", "pm16", "pm13"] },
  ],

  /* ===================== PROCESSUAL PENAL MILITAR ===================== */
  proc_penal_militar: [
    { id: "ppm_a1", titulo: "Polícia judiciária militar e o IPM", min: 5,
      blocos: [
        { p: "O <strong>Inquérito Policial Militar (IPM)</strong> é o procedimento de investigação da <strong>polícia judiciária militar</strong>. É <strong>administrativo, inquisitivo e preparatório</strong> da ação penal — ou seja, é peça informativa, não há contraditório pleno nem julgamento." },
        { p: "Quem <strong>preside</strong> o IPM é um <strong>OFICIAL designado</strong> — jamais um delegado de polícia civil. Ele começa por uma <strong>PORTARIA</strong>." },
        { box: "Prazos do IPM: 20 DIAS se o indiciado estiver PRESO; 40 DIAS se estiver SOLTO (prorrogável). Compare com o IP comum (10/30) para não trocar." },
        { p: "A polícia judiciária militar é exercida por <strong>comandantes/autoridades militares</strong> e por <strong>oficiais por delegação</strong>." },
        { ex: "IPM: quem preside? OFICIAL. Como começa? PORTARIA. Natureza? Inquisitivo. Isso resolve a maioria das questões." },
      ],
      questoes: ["ppm1", "ppm4", "ppm7", "ppm9", "ppm10"] },

    { id: "ppm_a2", titulo: "Ação penal, competência e institutos próprios", min: 6,
      blocos: [
        { h: "Ação penal militar" },
        { p: "É <strong>pública incondicionada</strong>, promovida pelo <strong>Ministério Público</strong> por meio de <strong>denúncia</strong>. Não depende de representação da vítima." },
        { h: "Competência da Justiça Militar Estadual" },
        { p: "Julga os <strong>militares dos Estados</strong> nos crimes militares definidos em lei. Dois pontos que caem muito:" },
        { lista: [
          "A Justiça Militar <strong>ESTADUAL NÃO julga civis</strong> (a da União pode).",
          "<strong>Crime doloso contra a vida de civil</strong> praticado por militar estadual vai para o <strong>Tribunal do Júri</strong> (Justiça comum).",
        ] },
        { p: "Em 1º grau, a estrutura reúne o <strong>juiz de direito</strong> e os <strong>Conselhos de Justiça</strong> (juiz togado + oficiais = sistema de <strong>escabinato</strong>)." },
        { h: "Institutos próprios" },
        { p: "<strong>Menagem</strong>: custódia branda — o acusado fica recolhido a um <strong>local determinado</strong> (quartel, cidade). <strong>Processo especial de deserção</strong>: rito próprio, com termo de deserção e agregação do oficial." },
        { box: "Nulidades: vale 'pas de nullité sans grief' — não há nulidade sem prejuízo demonstrado." },
      ],
      questoes: ["ppm2", "ppm3", "ppm5", "ppm6", "ppm8", "ppm11", "ppm12"] },
  ],

  /* ===================== LEGISLAÇÃO EXTRAVAGANTE ===================== */
  legislacao: [
    { id: "leg_a1", titulo: "Lei de Drogas (11.343/2006) — a mais cobrada", min: 6,
      blocos: [
        { p: "É a lei <strong>campeã de incidência</strong> no concurso da PMGO. Domine três pontos e você resolve quase tudo." },
        { h: "1) Tráfico x usuário" },
        { p: "O <strong>tráfico (art. 33)</strong> é <strong>equiparado a hediondo</strong>. Já o <strong>usuário (art. 28)</strong> — porte para consumo pessoal — <strong>NÃO é preso</strong>: as penas são advertência, prestação de serviços à comunidade e medida educativa." },
        { box: "Grave: USUÁRIO NÃO TEM PENA DE PRISÃO. Essa é a pegadinha número 1 da Lei de Drogas." },
        { h: "2) Tráfico privilegiado (art. 33, §4º)" },
        { p: "Permite <strong>reduzir a pena de 1/6 a 2/3</strong> se o agente preencher, <strong>cumulativamente</strong>, quatro requisitos:" },
        { lista: [
          "ser <strong>primário</strong>;",
          "ter <strong>bons antecedentes</strong>;",
          "<strong>não se dedicar</strong> a atividades criminosas;",
          "<strong>não integrar</strong> organização criminosa.",
        ] },
        { h: "3) Não confunda os tipos" },
        { p: "<strong>Associação para o tráfico (art. 35)</strong> ≠ <strong>organização criminosa (Lei 12.850/13)</strong>. São crimes distintos." },
        { ex: "Requisitos do privilegiado: 'PRIMO de BONS antecedentes que NÃO se dedica e NÃO é de organização'." },
      ],
      questoes: ["leg1", "leg6", "leg11", "leg18"] },

    { id: "leg_a2", titulo: "Estatuto do Desarmamento (10.826/2003)", min: 5,
      blocos: [
        { h: "Posse x Porte — a distinção central" },
        { p: "<strong>POSSE (art. 12)</strong>: manter a arma <strong>dentro de casa ou no local de trabalho</strong>. <strong>PORTE (art. 14)</strong>: <strong>trazer a arma consigo</strong>, fora desses locais." },
        { box: "Regra de bolso: dentro de casa/trabalho = POSSE. Na rua, consigo = PORTE." },
        { p: "<strong>Disparo de arma de fogo (art. 15)</strong> é crime <strong>autônomo</strong> — salvo quando o disparo é meio para um crime mais grave (aí é absorvido)." },
        { p: "Arma de <strong>uso restrito (art. 16)</strong>: a conduta é <strong>equiparada a hediondo</strong>. A idade mínima para um particular adquirir arma é <strong>25 anos</strong>." },
        { ex: "Se a arma está guardada em casa sem registro → POSSE irregular. Se está com a pessoa na rua → PORTE ilegal." },
      ],
      questoes: ["leg2", "leg16", "leg17"] },

    { id: "leg_a3", titulo: "Hediondos, JECrim e Maria da Penha", min: 6,
      blocos: [
        { h: "Crimes hediondos (Lei 8.072/90)" },
        { p: "São <strong>inafiançáveis</strong> e <strong>insuscetíveis de anistia, graça e indulto</strong>. Equiparados a hediondos, os <strong>'3 T'</strong>: <strong>Tráfico, Tortura e Terrorismo</strong> (art. 5º, XLIII, CF)." },
        { h: "Juizados Especiais Criminais (Lei 9.099/95)" },
        { p: "Cuidam das <strong>infrações de menor potencial ofensivo</strong> = contravenções + crimes com pena máxima <strong>não superior a 2 anos</strong>. Institutos: <strong>transação penal</strong> (art. 76) e <strong>suspensão condicional do processo</strong> (art. 89, para pena mínima até 1 ano)." },
        { h: "Maria da Penha (Lei 11.340/06)" },
        { p: "Protege a <strong>mulher</strong> em situação de violência doméstica e familiar. Pontos que caem:" },
        { lista: [
          "<strong>Afasta o JECrim</strong> (art. 41) — nada de transação/sursis nesses crimes.",
          "<strong>Veda</strong> penas de cesta básica e multa isolada (art. 17).",
          "A <strong>lesão corporal</strong> nesse contexto é ação penal <strong>pública incondicionada</strong> (STF).",
          "Prevê <strong>medidas protetivas de urgência</strong>.",
        ] },
        { box: "Pegadinha: 'Maria da Penha admite cesta básica' → ERRADO (art. 17 veda)." },
      ],
      questoes: ["leg3", "leg5", "leg9", "leg10", "leg15", "leg4", "leg20"] },

    { id: "leg_a4", titulo: "ECA, Crimes Ambientais, Tortura e Estatuto GO", min: 5,
      blocos: [
        { p: "<strong>ECA (Lei 8.069/90)</strong>: <strong>criança</strong> é a pessoa até <strong>12 anos incompletos</strong>; <strong>adolescente</strong>, entre 12 e 18. A <strong>corrupção de menores (art. 244-B)</strong> é crime formal (Súmula 500 STJ)." },
        { p: "<strong>Crimes Ambientais (Lei 9.605/98)</strong>: admite <strong>responsabilidade penal da pessoa jurídica</strong> (art. 3º) — ponto muito cobrado." },
        { p: "<strong>Lei de Tortura (9.455/97)</strong>: a condenação do servidor gera <strong>perda do cargo</strong> e interdição para seu exercício." },
        { box: "(Para quem vai de CFO) O Estatuto dos Policiais Militares de Goiás é a Lei estadual 8.033/1975 — caiu 2x na prova de Cadete. Não confunda com a Lei 15.704/2006 (plano de carreira)." },
      ],
      questoes: ["leg7", "leg8", "leg13", "leg14", "leg19", "leg12"] },
  ],

  /* ===================== CONSTITUCIONAL ===================== */
  constitucional: [
    { id: "const_a1", titulo: "Princípios fundamentais e direitos do art. 5º", min: 6,
      blocos: [
        { h: "Fundamentos da República (art. 1º)" },
        { p: "São cinco — memorize com <strong>SO-CI-DI-VA-PLU</strong>: <strong>SO</strong>berania, <strong>CI</strong>dadania, <strong>DI</strong>gnidade da pessoa humana, <strong>VA</strong>lores sociais do trabalho e da livre iniciativa, <strong>PLU</strong>ralismo político." },
        { box: "'Prevalência dos direitos humanos' NÃO é fundamento do art. 1º — é princípio das RELAÇÕES INTERNACIONAIS (art. 4º). Pegadinha clássica." },
        { h: "Direitos e garantias (art. 5º)" },
        { p: "Pontos que a AOCP adora:" },
        { lista: [
          "<strong>Associações (inc. XIX)</strong>: DISSOLUÇÃO compulsória exige <strong>trânsito em julgado</strong>; SUSPENSÃO de atividades basta <strong>decisão judicial</strong>.",
          "<strong>Racismo (XLII)</strong>: inafiançável e <strong>imprescritível</strong>. <strong>3 T (XLIII)</strong>: inafiançáveis, sem graça/anistia.",
          "<strong>Domicílio (XI)</strong>: entra-se sem consentimento em <strong>flagrante, desastre ou socorro</strong> (qualquer hora); ou, <strong>de dia</strong>, com ordem judicial.",
          "<strong>Tratados de DH</strong> por 3/5 em 2 turnos (art. 5º, §3º) = <strong>emenda constitucional</strong>.",
        ] },
        { ex: "Associações: DIssolução = trânsito em julgaDO. SUspensão = decisão (Sem trânsito). Guarde por rima." },
      ],
      questoes: ["const5", "const8", "const9", "const10", "const14", "const16", "const2", "const4"] },

    { id: "const_a2", titulo: "Segurança pública (art. 144) e militares (art. 42)", min: 5,
      blocos: [
        { p: "O <strong>art. 144</strong> é praticamente garantido em concurso de PM. A segurança pública é <strong>dever do Estado, direito e responsabilidade de todos</strong>." },
        { h: "O papel de cada polícia" },
        { p: "Às <strong>Polícias Militares</strong> cabem a <strong>polícia ostensiva</strong> e a <strong>preservação da ordem pública</strong> (§5º). A <strong>apuração de infrações penais</strong> é da polícia civil (§4º). As PMs são <strong>forças auxiliares e reserva do Exército</strong> (§6º)." },
        { box: "Não troque as funções: PM = ostensiva + ordem pública. Polícia Civil = apuração/judiciária. Essa troca é a pegadinha número 1 do art. 144." },
        { h: "Militares dos Estados (art. 42 c/c 142)" },
        { p: "As bases são <strong>hierarquia e disciplina</strong>. Ao militar são <strong>vedadas a sindicalização e a greve</strong>." },
        { ex: "Militar NÃO faz greve e NÃO se sindicaliza. Ponto." },
      ],
      questoes: ["const1", "const3", "const6", "const11"] },

    { id: "const_a3", titulo: "Organização do poder, cláusulas pétreas e administração", min: 5,
      blocos: [
        { h: "Cláusulas pétreas (art. 60, §4º)" },
        { p: "Não podem ser abolidas nem por emenda: <strong>forma federativa</strong>; <strong>voto direto, secreto, universal e periódico</strong>; <strong>separação dos Poderes</strong>; <strong>direitos e garantias individuais</strong>." },
        { h: "Sucessão presidencial" },
        { p: "Vagando <strong>Presidente e Vice</strong> nos <strong>2 primeiros anos</strong> do mandato → <strong>eleição direta</strong> em 90 dias. Nos <strong>2 últimos</strong> → <strong>eleição indireta</strong> pelo Congresso." },
        { h: "Administração Pública (art. 37)" },
        { p: "Rege-se pelo <strong>LIMPE</strong>. Cargo efetivo depende de <strong>concurso público</strong>, com validade de até <strong>2 anos, prorrogável uma vez</strong>." },
        { box: "Cláusulas pétreas: guarde 'FO-VO-SE-DI' — FOrma federativa, VOto, SEparação dos poderes, DIreitos individuais." },
      ],
      questoes: ["const7", "const12", "const13", "const15"] },
  ],

  /* ===================== ADMINISTRATIVO ===================== */
  administrativo: [
    { id: "adm_a1", titulo: "Princípios (LIMPE) e poderes administrativos", min: 6,
      blocos: [
        { h: "Princípios expressos — LIMPE" },
        { p: "<strong>L</strong>egalidade, <strong>I</strong>mpessoalidade, <strong>M</strong>oralidade, <strong>P</strong>ublicidade, <strong>E</strong>ficiência (art. 37, caput). A <strong>Súmula Vinculante 13</strong> deriva da impessoalidade/moralidade e <strong>veda o nepotismo</strong>." },
        { h: "Poderes administrativos" },
        { p: "São eles: <strong>vinculado</strong> (sem margem de escolha), <strong>discricionário</strong> (juízo de conveniência e oportunidade), <strong>hierárquico</strong>, <strong>disciplinar</strong>, <strong>regulamentar</strong> e de <strong>polícia</strong>." },
        { box: "O poder REGULAMENTAR é do EXECUTIVO (o chefe edita decretos), não do Legislativo. Pegadinha comum." },
        { p: "O <strong>poder de polícia</strong> condiciona a liberdade e a propriedade ao interesse público; pode ser <strong>preventivo</strong> ou <strong>repressivo</strong>. Pela <strong>autotutela</strong> (Súmulas 346 e 473 do STF), a Administração <strong>anula</strong> seus atos ilegais e <strong>revoga</strong> os inconvenientes." },
        { ex: "LIMPE resolve dezenas de questões. E lembre: autotutela = a Administração se autocorrige." },
      ],
      questoes: ["adm1", "adm4", "adm5", "adm11", "adm16", "adm10"] },

    { id: "adm_a2", titulo: "Atos administrativos: elementos, atributos e desfazimento", min: 5,
      blocos: [
        { h: "Elementos (requisitos)" },
        { p: "Todo ato tem cinco: <strong>Competência, Finalidade, Forma, Motivo e Objeto</strong> (macete <strong>COM-FI-FO-MO-OB</strong>)." },
        { h: "Atributos" },
        { p: "<strong>Presunção de legitimidade</strong>, <strong>Autoexecutoriedade</strong>, <strong>Tipicidade</strong> e <strong>Imperatividade</strong> (macete <strong>PATI</strong>). A <strong>autoexecutoriedade</strong> permite executar o ato <strong>sem ordem judicial prévia</strong>." },
        { h: "Anulação x Revogação" },
        { p: "<strong>Anulação</strong>: ato <strong>ilegal</strong>, efeitos <strong>ex tunc</strong> (retroativos). <strong>Revogação</strong>: ato <strong>legal</strong> mas inconveniente, efeitos <strong>ex nunc</strong> (dali em diante)." },
        { box: "aNulação = Nulo/ilegal = ex tuNc. Revogação = conveniência = ex nunc. Associe pela letra N." },
      ],
      questoes: ["adm3", "adm6", "adm8"] },

    { id: "adm_a3", titulo: "Responsabilidade civil do Estado e improbidade", min: 5,
      blocos: [
        { h: "Responsabilidade civil (art. 37, §6º)" },
        { p: "Por atos <strong>comissivos</strong>, a responsabilidade é <strong>OBJETIVA</strong>, pela <strong>teoria do risco administrativo</strong>: independe de dolo/culpa do agente, mas <strong>admite excludentes</strong> (culpa exclusiva da vítima, força maior). Já a <strong>omissão genérica</strong> costuma ser <strong>subjetiva</strong> (exige falta do serviço)." },
        { box: "Risco administrativo ≠ risco integral. O administrativo ADMITE excludentes; o integral (exceção) não." },
        { h: "Improbidade administrativa (Lei 8.429/92)" },
        { p: "Três espécies: <strong>enriquecimento ilícito</strong> (art. 9º), <strong>prejuízo ao erário</strong> (art. 10) e <strong>atentado a princípios</strong> (art. 11). Após a <strong>Lei 14.230/21</strong>, a improbidade exige <strong>DOLO</strong> — não há mais modalidade culposa." },
        { ex: "Propina = enriquecimento. Frustrar licitação com perda de dinheiro = dano ao erário. Violar princípio sem dano = art. 11." },
      ],
      questoes: ["adm2", "adm7", "adm12", "adm15", "adm9", "adm13", "adm14"] },
  ],

  /* ===================== DIREITO PENAL ===================== */
  penal: [
    { id: "pen_a1", titulo: "Lei penal no tempo e no espaço", min: 5,
      blocos: [
        { p: "Ponto de partida: <strong>princípio da legalidade/anterioridade</strong> (art. 1º) — não há crime sem lei anterior que o defina." },
        { h: "Lei penal no tempo" },
        { p: "A <strong>lei mais benéfica RETROAGE</strong> (art. 5º, XL, CF), alcançando até fatos já com <strong>sentença transitada em julgado</strong>. A lei mais grave <strong>não</strong> retroage. As leis <strong>temporárias/excepcionais</strong> têm <strong>ultratividade</strong> (art. 3º): aplicam-se ao fato praticado durante sua vigência mesmo depois de revogadas." },
        { box: "Benéfica retroage. Maléfica não. Temporária/excepcional = ultra-ativa. Esses três resolvem quase tudo de 'lei no tempo'." },
        { h: "Tempo e lugar" },
        { p: "<strong>Tempo</strong> do crime = teoria da <strong>atividade</strong> (art. 4º). <strong>Lugar</strong> = teoria da <strong>ubiquidade</strong> (art. 6º)." },
        { ex: "abolitio criminis (lei nova que deixa de considerar crime) extingue a punibilidade e é a forma máxima de retroatividade benéfica." },
      ],
      questoes: ["pen1", "pen6", "pen9", "pen10", "pen11"] },

    { id: "pen_a2", titulo: "Teoria do crime e excludentes de ilicitude", min: 6,
      blocos: [
        { h: "Iter criminis e tentativa" },
        { p: "O caminho do crime: <strong>cogitação</strong> (não punível) → preparação → execução → consumação. A <strong>tentativa (art. 14, II)</strong> ocorre quando, <strong>iniciada a execução</strong>, o crime não se consuma por <strong>circunstâncias alheias</strong> à vontade do agente — pena reduzida de <strong>1/3 a 2/3</strong>." },
        { p: "Na <strong>desistência voluntária</strong> e no <strong>arrependimento eficaz</strong> (art. 15), o agente responde <strong>só pelos atos já praticados</strong> ('ponte de ouro')." },
        { h: "Excludentes de ilicitude (art. 23)" },
        { p: "São quatro: <strong>estado de necessidade</strong>, <strong>legítima defesa</strong>, <strong>estrito cumprimento do dever legal</strong> e <strong>exercício regular de direito</strong>." },
        { box: "CUIDADO: coação moral irresistível NÃO é excludente de ILICITUDE — ela exclui a CULPABILIDADE (art. 22). Pegadinha frequente." },
        { p: "<strong>Legítima defesa (art. 25)</strong>: agressão <strong>injusta, atual ou iminente</strong>, repelida com <strong>uso moderado dos meios necessários</strong>, em defesa de direito próprio ou alheio. A <strong>descriminante putativa</strong> (art. 20, §1º) ocorre quando o agente supõe, por erro, uma situação que tornaria a conduta legítima." },
      ],
      questoes: ["pen2", "pen3", "pen5", "pen7", "pen8", "pen15", "pen16"] },

    { id: "pen_a3", titulo: "Crimes contra o patrimônio", min: 4,
      blocos: [
        { p: "A diferença que mais cai: <strong>furto</strong> (art. 155) é subtração <strong>sem violência</strong>; <strong>roubo</strong> (art. 157) é subtração com <strong>violência ou grave ameaça</strong> à pessoa." },
        { p: "O <strong>roubo majorado (§2º)</strong> aumenta a pena em hipóteses como <strong>concurso de pessoas</strong> e restrição da liberdade da vítima. O emprego de <strong>arma de fogo</strong> está no <strong>§2º-A</strong>." },
        { box: "Violência/ameaça = ROUBO. Sem violência = FURTO. Simples, mas cai direto em caso concreto." },
        { ex: "A banca narra um caso com nomes exóticos ('Calígula', 'Zeus') e pede o enquadramento. Foque na conduta, não no nome." },
      ],
      questoes: ["pen4", "pen12", "pen13", "pen14"] },
  ],

  /* ===================== PROCESSUAL PENAL ===================== */
  proc_penal: [
    { id: "pp_a1", titulo: "Inquérito policial e princípios do processo", min: 5,
      blocos: [
        { p: "O <strong>inquérito policial (IP)</strong> é <strong>administrativo, inquisitivo e preparatório</strong> da ação penal — é peça de informação, não de julgamento. Em crime de <strong>ação pública incondicionada</strong>, o delegado instaura <strong>de ofício</strong>." },
        { box: "Prazos do IP comum: PRESO 10 dias; SOLTO 30 dias (prorrogável). Não confunda com o IPM (20/40)." },
        { p: "Princípio-mestre: <strong>presunção de inocência</strong> (art. 5º, LVII) — ninguém é culpado até o <strong>trânsito em julgado</strong>." },
        { ex: "Inquisitivo = sem contraditório pleno. É investigação, não processo." },
      ],
      questoes: ["pp4", "pp9", "pp11", "pp12"] },

    { id: "pp_a2", titulo: "Prisões cautelares (o tema mais rentável)", min: 7,
      blocos: [
        { p: "Prisões cautelares são <strong>flagrante, preventiva e temporária</strong>. A <strong>prisão-pena</strong> (após trânsito em julgado) NÃO é cautelar." },
        { h: "Flagrante" },
        { p: "Pode ser próprio, impróprio (perseguido logo após) e presumido. <strong>Qualquer pessoa PODE</strong> prender em flagrante; a autoridade e seus agentes <strong>DEVEM</strong>. O flagrante <strong>preparado</strong> é nulo (Súmula 145 STF); o <strong>esperado</strong> é válido." },
        { h: "Preventiva (art. 312)" },
        { p: "Fundamenta-se em: <strong>garantia da ordem pública</strong>, <strong>ordem econômica</strong>, <strong>conveniência da instrução</strong> e <strong>aplicação da lei penal</strong>. NUNCA é antecipação de pena." },
        { h: "Temporária (Lei 7.960)" },
        { p: "Prazo de <strong>5 + 5 dias</strong> (crimes comuns) e <strong>30 + 30 dias</strong> (hediondos)." },
        { box: "Fiança pelo DELEGADO: só quando a pena máxima não é superior a 4 anos (art. 322). Acima disso, só o juiz. Audiência de custódia: em até 24h." },
      ],
      questoes: ["pp1", "pp2", "pp3", "pp5", "pp6", "pp7", "pp8", "pp10"] },
  ],

  /* ===================== LÍNGUA PORTUGUESA ===================== */
  portugues: [
    { id: "pt_a1", titulo: "As funções do 'se' e a colocação pronominal", min: 6,
      blocos: [
        { h: "As funções do 'se' (queridinho da AOCP)" },
        { lista: [
          "<strong>Pronome apassivador</strong> — com verbo <strong>transitivo direto</strong>: 'Vendem-<strong>se</strong> casas' (= casas são vendidas). Verbo concorda com o sujeito.",
          "<strong>Índice de indeterminação do sujeito</strong> — com verbo <strong>transitivo indireto</strong>: 'Precisa-<strong>se</strong> de policiais' (verbo no singular).",
          "<strong>Parte integrante do verbo</strong> — verbos pronominais: 'esforçar-<strong>se</strong>', 'queixar-<strong>se</strong>'.",
          "<strong>Conjunção integrante</strong> ('Não sei <strong>se</strong> virá') ou <strong>condicional</strong> ('<strong>Se</strong> estudar, passa').",
        ] },
        { box: "Regra de ouro: VTD + se = apassivador (concorda no plural). VTI + se = indeterminação (fica no singular)." },
        { h: "Colocação pronominal" },
        { p: "A <strong>próclise</strong> (pronome antes) é atraída por palavras negativas, advérbios, pronomes relativos/indefinidos e conjunções subordinativas: 'Não <strong>o</strong> vi', 'que <strong>se</strong> diga'." },
        { ex: "'Não o vi' (certo) x 'Não vi-o' (errado). Palavra negativa puxa o pronome para antes do verbo." },
      ],
      questoes: ["pt1", "pt6", "pt7", "pt12"] },

    { id: "pt_a2", titulo: "Crase, concordância e regência", min: 6,
      blocos: [
        { h: "Crase (a + a)" },
        { p: "<strong>Não</strong> ocorre crase antes de <strong>verbo</strong>, <strong>palavra masculina</strong>, <strong>pronome</strong> (em geral) e <strong>plural sem artigo</strong>. Ocorre quando há preposição 'a' + artigo 'a': 'Entreguei <strong>à</strong> comandante'." },
        { h: "Concordância verbal" },
        { p: "Verbos <strong>impessoais</strong> ficam no singular: <strong>'fazer'</strong> indicando tempo ('<strong>Faz</strong> dois anos') e <strong>'haver'</strong> no sentido de existir ('<strong>Havia</strong> muitas pessoas')." },
        { box: "'Fazem dois anos' e 'Houveram problemas' são ERRADOS. Impessoal = singular sempre." },
        { h: "Regência" },
        { p: "<strong>Assistir</strong> (ver) é transitivo indireto, exige 'a': 'assisti <strong>ao</strong> filme'. <strong>Chegar/Ir</strong> pedem 'a', não 'em': 'cheguei <strong>à</strong> delegacia'." },
        { ex: "Se 'assistir' = ver, use 'a' (assistir AO jogo). Se = ajudar/dar assistência, é direto." },
      ],
      questoes: ["pt2", "pt5", "pt11", "pt16"] },

    { id: "pt_a3", titulo: "Sintaxe, conectivos e Redação Oficial", min: 6,
      blocos: [
        { h: "Análise sintática essencial" },
        { p: "Com <strong>verbo de ligação</strong> (ser, estar, permanecer), o termo que caracteriza o sujeito é <strong>predicativo do sujeito</strong>: 'O policial permaneceu <strong>atento</strong>'. O <strong>'que'</strong> que retoma um nome e liga orações é <strong>pronome relativo</strong>." },
        { h: "Conectivos e sentido" },
        { p: "Saber o valor do conectivo resolve interpretação:" },
        { lista: [
          "<strong>Embora, ainda que</strong> → concessão;",
          "<strong>Para que, a fim de</strong> → finalidade;",
          "<strong>Portanto, logo</strong> → conclusão;",
          "<strong>Porque, pois</strong> → causa/explicação.",
        ] },
        { h: "Redação Oficial (o item mais previsível da prova)" },
        { p: "Atributos obrigatórios: <strong>impessoalidade, clareza, concisão, formalidade, uniformidade</strong> e uso do <strong>padrão culto</strong>. Nunca é rebuscada nem pessoal." },
        { box: "Se a alternativa disser que a redação oficial usa 'linguagem rebuscada e pessoal', está ERRADA — é o item mais fácil da prova." },
      ],
      questoes: ["pt3", "pt4", "pt8", "pt9", "pt10", "pt13", "pt14", "pt15"] },
  ],
};
