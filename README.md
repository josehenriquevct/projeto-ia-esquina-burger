# 🛡️ Estudo PMGO — Sistema de Preparação para Soldado

Sistema de estudos web (roda 100% no navegador, sem instalar nada) para quem
está se preparando para o concurso de **Soldado da Polícia Militar de Goiás**.

> **Calibrado pela prova real:** banca **Instituto AOCP**, Edital **002/2022**
> (Soldado Combatente). A grade de matérias, os pesos, a regra de aprovação
> (**≥ 60% dos 85 pontos + não zerar nenhuma matéria**), o estilo das questões
> e a ordem de prioridade de estudo reproduzem a **incidência real** da prova de
> 10/07/2022, analisada questão a questão.

Construído em cima dos **métodos com comprovação científica de maior eficácia**
para retenção de conteúdo e desempenho em provas:

- 🧠 **Recordação ativa** (active recall) — você tenta lembrar antes de ver a resposta
- 🔁 **Revisão espaçada** (algoritmo SM-2, o mesmo do Anki) — o sistema decide quando revisar cada card
- ⏱️ **Simulados cronometrados** — treino sob a pressão da prova real
- 📊 **Diagnóstico por matéria** — mostra exatamente onde você precisa reforçar

> ⚠️ **Aviso honesto:** nenhum sistema garante nota máxima — isso depende da sua
> dedicação. Mas este método é o que comprovadamente **maximiza** suas chances.

## Como usar

Não precisa de servidor nem instalação. Basta abrir o arquivo:

```
index.html
```

Dê dois cliques no `index.html` (ou abra no navegador). Pronto.

Se preferir servir localmente (opcional):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Funcionalidades

| Tela | O que faz |
|------|-----------|
| **Início** | Grade da prova, regra dos 60%/não zerar e matérias por prioridade |
| **📘 Aulas** | Trilha para **aprender do zero**: 26 aulas com conteúdo + teste de fixação (70% domina) |
| **Flashcards** | Revisão espaçada (52 cards) com avaliação (Errei / Difícil / Bom / Fácil) |
| **Questões** | Banco de **140 questões** no estilo AOCP com gabarito comentado por alternativa |
| **Resumos** | Teoria condensada por matéria (acordeão), no recorte que a banca cobra |
| **Simulado** | Prova cronometrada montada na **proporção real** da grade; aplica a regra dos 60% + não zerar |
| **Desempenho** | Estatísticas, pontos fracos e histórico de simulados |
| **Plano** | Prioridade por densidade (pontos/hora) e alocação de tempo |
| **Prova & TAF** | Estrutura da prova, redação, tabelas do TAF e checklist de preparação |
| **🎖️ Perfil** | Patente, ofensiva de dias, meta diária, conquistas e escada de patentes |

### 🎮 Gamificação (feita para viciar em estudar)

- **Patentes militares por XP:** suba de **Recruta → Soldado → Cabo → Sargento → … → Coronel** ganhando XP a cada acerto, flashcard e simulado, com animação de promoção.
- **Ofensiva de dias** 🔥 (streak): mantenha a sequência estudando todo dia.
- **Combo de acertos** ⚡: acertos seguidos rendem XP extra e um toast comemorativo.
- **Meta diária de XP** com anel de progresso.
- **15 conquistas/medalhas** 🏅 desbloqueáveis.
- **Efeitos sonoros** (Web Audio, sem arquivos externos), **confete** e **pop-ups de XP** — desligáveis a qualquer momento.
- **Desafio diário** 🎯: uma missão nova por dia ("acerte X questões da matéria Y") com bônus de XP e comemoração.
- **Mascote (Sgt. Coruja 🦉)** que fala com você e reage ao seu progresso.
- **Frases motivacionais** espalhadas pelo app (início, promoções, desafios, caderno de erros).
- **Gráfico de evolução semanal** de XP por dia, no Perfil.
- **Caderno de erros** 🔁: revise só as questões que você errou — acertar remove a questão do caderno.

### Conteúdo incluído

- **140 questões** distribuídas pelas 9 matérias (36 fáceis, 72 médias, 32 difíceis), todas com comentário
- **52 flashcards** de alta densidade
- **Resumos de teoria** para todas as 9 matérias
- Estrutura em arquivos: `js/data.js` (config), `js/questions.js` (banco), `js/resumos.js` (teoria)

Seu progresso fica salvo automaticamente no navegador (localStorage). Dá para
**exportar** o progresso em JSON na aba Desempenho.

## Estrutura

```
index.html          → página e navegação
css/styles.css      → tema visual (azul-marinho + dourado)
js/data.js          → matérias, blueprint da prova, TAF, redação, flashcards
js/questions.js     → banco de 140 questões (estilo AOCP)
js/resumos.js       → resumos de teoria por matéria
js/aulas.js         → trilha de 26 aulas (conteúdo para aprender + teste de fixação)
js/gamify.js        → gamificação (patentes, XP, streak, conquistas, sons, confete)
js/srs.js           → motor de revisão espaçada (SM-2)
js/storage.js       → persistência do progresso (localStorage)
js/app.js           → interface e telas
```

## Como adicionar mais conteúdo

- **Questões:** adicione objetos ao array `QUESTIONS` em `js/questions.js`
  (campos: `id`, `materia`, `nivel`, `enunciado`, `alternativas[5]`, `correta`, `explicacao`).
- **Flashcards:** adicione ao array `FLASHCARDS` em `js/data.js`.
- **Resumos:** edite o objeto `RESUMOS` em `js/resumos.js` (por `id` de matéria).

Os comentários em cada arquivo explicam o formato dos campos.

## ⚠️ Importante

Este é um material de estudo **independente**, **não oficial**. O conteúdo,
os pesos das matérias e a legislação seguem o formato típico das últimas bancas,
mas **sempre confira o edital vigente** do seu concurso — leis e conteúdos mudam.
