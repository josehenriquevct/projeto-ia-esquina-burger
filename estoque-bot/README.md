# 📦 Agente de Estoque da Esquina Burger (WhatsApp)

Você manda mensagem no WhatsApp ("entrou 20 kg de carne", "o que tá faltando?") e o agente
registra, consulta e avisa. Roda no seu Mac, igual ao marmita-bot: **Evolution API** (WhatsApp)
→ **FastAPI** (webhook) → **Claude** (entende e chama as ferramentas) → **SQLite** (estoque).

## Como falar com ele

Depois de subir (passos abaixo), é só mandar mensagem **do seu celular para o número conectado**.
Ele entende linguagem normal. Exemplos que funcionam:

| Você manda | Ele faz |
|---|---|
| `como tá o estoque?` / `me mostra tudo` | lista todos os itens com saldo e mínimo |
| `quanto tem de pão?` | consulta um item |
| `entrou 20 kg de carne` / `chegou 5 caixa de coca` | registra entrada e soma |
| `usei 30 pão` / `saiu 2 kg de cheddar` | registra saída e subtrai |
| `acabou o bacon` | ajusta o saldo pra zero |
| `contei e tem 12 pão` | ajusta o saldo exato (inventário) |
| `cadastra batata, kg, 15 em estoque, mínimo 5` | cadastra item novo |
| `mínimo de pão é 40` | define o alerta de mínimo |
| `o que falta?` / `lista de compras` | tudo que está no mínimo ou abaixo |
| `histórico da carne` / `últimas movimentações` | últimas entradas e saídas |
| `entrou 10 kg carne, 50 pão e 3 kg cheddar` | vários itens numa mensagem só |
| 🎤 áudio | transcreve e faz o mesmo (precisa de `OPENAI_API_KEY`) |
| `/reset` | zera a conversa (o estoque continua salvo) |

Se ele não conhecer o item, pergunta se é pra cadastrar. Se o nome for ambíguo
("c" bate com carne e cheddar), pergunta qual é. Sempre confirma o saldo novo e avisa quando
algo ficou abaixo do mínimo. Só responde aos números em `ALLOWED_PHONES`; o resto ignora.

## Subir do zero (~15 min)

Você precisa de um **chip/número de WhatsApp pra ser o agente**. Pode ser um chip reserva ou o
número da hamburgueria. Não use o mesmo número com que você vai conversar com ele.

### 1. Evolution API (gateway de WhatsApp)

```bash
cd estoque-bot
cp .env.example .env            # edite: EVOLUTION_API_KEY, ANTHROPIC_API_KEY, ALLOWED_PHONES
docker compose up -d            # sobe Evolution + Postgres em http://localhost:8080
```

Crie a instância e pegue o QR Code (troque `SUA_CHAVE` pelo `EVOLUTION_API_KEY` do `.env`):

```bash
curl -s -X POST http://localhost:8080/instance/create \
  -H "apikey: SUA_CHAVE" -H "Content-Type: application/json" \
  -d '{"instanceName":"esquina-estoque","integration":"WHATSAPP-BAILEYS","qrcode":true}'
```

Abra `http://localhost:8080/manager` (login com a mesma chave), clique na instância
**esquina-estoque** e escaneie o QR Code com o WhatsApp do número que vai ser o agente
(Configurações → Aparelhos conectados → Conectar aparelho).

### 2. Agente

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Apontar a Evolution pro agente

```bash
curl -s -X POST http://localhost:8080/webhook/set/esquina-estoque \
  -H "apikey: SUA_CHAVE" -H "Content-Type: application/json" \
  -d '{"webhook":{"enabled":true,"url":"http://host.docker.internal:8000/webhook","byEvents":false,"base64":false,"events":["MESSAGES_UPSERT"]}}'
```

> `host.docker.internal` é como o Docker enxerga o seu Mac. Se a Evolution estiver em outra
> máquina/VPS, use o IP ou domínio público do agente.

### 4. Testar

Do seu celular (um número que está em `ALLOWED_PHONES`), mande pro número do agente:

```
cadastra pão brioche, un, 40 em estoque, mínimo 20
```

Ele deve responder algo como *"Cadastrado: Pão brioche: 40 un (mín. 20)"*.

Quer testar sem WhatsApp? `python cli.py` conversa com o agente pelo terminal.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `main.py` | webhook FastAPI: recebe da Evolution, filtra número, chama o agente, responde |
| `ai.py` | loop do agente (Claude + ferramentas), histórico curto por telefone |
| `tools.py` | as 10 ferramentas que o Claude pode chamar e a execução delas |
| `db.py` | SQLite: tabelas `itens` e `movimentos` |
| `whatsapp.py` | enviar texto, baixar mídia e transcrever áudio |
| `config.py` | variáveis do `.env` |
| `cli.py` | conversa pelo terminal pra testar |
| `docker-compose.yml` | Evolution API + Postgres |

O banco é o arquivo `estoque.db` na pasta. Pra fazer backup é só copiar o arquivo.

## Deixar rodando sempre (Mac)

```bash
brew install pm2 || npm i -g pm2
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name estoque-bot --cwd "$PWD"
pm2 save && pm2 startup
```

## Custos e segurança

- Cada mensagem gasta uma ou duas chamadas no Claude (`claude-opus-5`, effort baixo, prompt
  cacheado). Pra baratear, troque `CLAUDE_MODEL` no `.env` por `claude-sonnet-5`.
- Só os números em `ALLOWED_PHONES` são atendidos. Grupos e status são ignorados.
- Se expor o webhook na internet, defina `WEBHOOK_TOKEN` e mande o header
  `x-webhook-token` na config do webhook da Evolution.
