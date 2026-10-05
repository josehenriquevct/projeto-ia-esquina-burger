"""Webhook da Evolution API → agente de estoque → resposta no WhatsApp.

Rodar: uvicorn main:app --host 0.0.0.0 --port 8000
"""
import logging
import threading

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Request

from ai import Agente
from config import settings
from db import Estoque
import whatsapp

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
log = logging.getLogger("estoque")

app = FastAPI(title="Esquina Burger - Agente de Estoque")
db = Estoque(settings.db_path)
agente = Agente(db)
_lock = threading.Lock()  # uma conversa por vez: evita duas gravações simultâneas no SQLite


def _extrair_texto(data: dict) -> tuple[str | None, str | None]:
    """Devolve (texto, tipo). tipo: 'texto' | 'audio' | None."""
    msg = data.get("message") or {}
    if "conversation" in msg:
        return msg["conversation"], "texto"
    if "extendedTextMessage" in msg:
        return msg["extendedTextMessage"].get("text"), "texto"
    if "audioMessage" in msg:
        return None, "audio"
    return None, None


def _processar(data: dict) -> None:
    key = data.get("key") or {}
    if key.get("fromMe"):
        return
    jid = key.get("remoteJid", "")
    if not jid.endswith("@s.whatsapp.net"):
        return  # ignora grupos e status
    numero = jid.split("@")[0]
    if numero not in settings.allowed:
        log.warning("mensagem de número não autorizado: %s", numero)
        return

    texto, tipo = _extrair_texto(data)
    if tipo == "audio":
        try:
            audio, mime = whatsapp.baixar_midia({"id": key.get("id"), "remoteJid": jid, "fromMe": False})
            texto = whatsapp.transcrever(audio, mime)
        except Exception:
            log.exception("falha ao transcrever áudio")
            texto = None
        if not texto:
            whatsapp.enviar_texto(numero, "Não consegui ouvir o áudio. Manda por texto?")
            return
    if not texto:
        return

    if texto.strip().lower() in ("/reset", "/limpar"):
        agente.limpar(numero)
        whatsapp.enviar_texto(numero, "Conversa zerada. O estoque continua salvo.")
        return

    autor = data.get("pushName") or numero
    with _lock:
        try:
            resposta = agente.responder(numero, texto, autor)
        except Exception:
            log.exception("falha no agente")
            resposta = "Deu erro aqui do meu lado. Tenta de novo em instantes."
    whatsapp.enviar_texto(numero, resposta)


@app.post("/webhook")
@app.post("/webhook/messages-upsert")
async def webhook(request: Request, tasks: BackgroundTasks,
                  x_webhook_token: str | None = Header(default=None)):
    if settings.webhook_token and x_webhook_token != settings.webhook_token:
        raise HTTPException(401, "token inválido")
    body = await request.json()
    if body.get("event") not in ("messages.upsert", "MESSAGES_UPSERT"):
        return {"ok": True, "ignorado": body.get("event")}
    data = body.get("data") or {}
    if isinstance(data, list):  # algumas versões mandam lista
        for d in data:
            tasks.add_task(_processar, d)
    else:
        tasks.add_task(_processar, data)
    return {"ok": True}


@app.get("/health")
def health():
    return {"ok": True, "itens": len(db.listar())}
