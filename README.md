# 🛡️ Estudo PMGO — Sistema de Preparação para Soldado

Sistema de estudos web (roda 100% no navegador, sem instalar nada) para quem
está se preparando para o concurso de **Soldado da Polícia Militar de Goiás**.

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
| **Início** | Visão geral, cards pendentes e matérias do edital |
| **Flashcards** | Revisão espaçada com avaliação (Errei / Difícil / Bom / Fácil) |
| **Questões** | Banco de questões com gabarito comentado por alternativa |
| **Simulado** | Prova cronometrada (5/10/20 questões) com desempenho por matéria |
| **Desempenho** | Estatísticas, pontos fracos e histórico de simulados |
| **Plano** | Rotina de estudos e ciclo semanal recomendado |

Seu progresso fica salvo automaticamente no navegador (localStorage). Dá para
**exportar** o progresso em JSON na aba Desempenho.

## Estrutura

```
index.html          → página e navegação
css/styles.css      → tema visual (azul-marinho + dourado)
js/data.js          → matérias do edital, banco de questões e flashcards
js/srs.js           → motor de revisão espaçada (SM-2)
js/storage.js       → persistência do progresso (localStorage)
js/app.js           → interface e telas
```

## Como adicionar mais conteúdo

Todo o conteúdo fica em `js/data.js`. Para incluir questões novas, adicione
objetos ao array `QUESTIONS`; para flashcards, ao array `FLASHCARDS`. Os
comentários no arquivo explicam o formato de cada campo.

## ⚠️ Importante

Este é um material de estudo **independente**, **não oficial**. O conteúdo,
os pesos das matérias e a legislação seguem o formato típico das últimas bancas,
mas **sempre confira o edital vigente** do seu concurso — leis e conteúdos mudam.
