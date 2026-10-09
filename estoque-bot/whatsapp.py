"""Cliente mínimo da Evolution API (enviar texto, baixar mídia)."""
import base64
import logging

import httpx

from config import settings

log = logging.getLogger("estoque.wa")


def _headers() -> dict:
    return {"apikey": settings.evolution_api_key, "Content-Type": "application/json"}


def enviar_texto(numero: str, texto: str) -> None:
    url = f"{settings.evolution_url.rstrip('/')}/message/sendText/{settings.evolution_instance}"
    r = httpx.post(url, headers=_headers(), json={"number": numero, "text": texto}, timeout=30)
    if r.status_code >= 300:
        log.error("falha ao enviar (%s): %s", r.status_code, r.text[:300])


def baixar_midia(message_key: dict) -> tuple[bytes, str]:
    """Baixa áudio/imagem de uma mensagem. Devolve (bytes, mimetype)."""
    url = (
        f"{settings.evolution_url.rstrip('/')}/chat/getBase64FromMediaMessage/"
        f"{settings.evolution_instance}"
    )
    r = httpx.post(
        url, headers=_headers(),
        json={"message": {"key": message_key}, "convertToMp4": False}, timeout=60,
    )
    r.raise_for_status()
    data = r.json()
    return base64.b64decode(data["base64"]), data.get("mimetype", "audio/ogg")


def transcrever(audio: bytes, mimetype: str) -> str | None:
    """Transcreve áudio com Whisper (OpenAI) se OPENAI_API_KEY estiver no .env."""
    if not settings.openai_api_key:
        return None
    ext = "ogg" if "ogg" in mimetype or "opus" in mimetype else mimetype.split("/")[-1]
    r = httpx.post(
        "https://api.openai.com/v1/audio/transcriptions",
        headers={"Authorization": f"Bearer {settings.openai_api_key}"},
        files={"file": (f"audio.{ext}", audio, mimetype)},
        data={"model": "whisper-1", "language": "pt"},
        timeout=120,
    )
    r.raise_for_status()
    return r.json().get("text")
