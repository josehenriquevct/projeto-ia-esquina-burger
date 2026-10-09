"""Configuração do agente de estoque (lida do .env)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Evolution API (WhatsApp self-hosted)
    evolution_url: str = "http://localhost:8080"
    evolution_api_key: str
    evolution_instance: str = "esquina-estoque"

    # Claude
    anthropic_api_key: str
    claude_model: str = "claude-opus-5-5"

    # Áudio (opcional): se tiver OPENAI_API_KEY, transcreve áudio com Whisper
    openai_api_key: str | None = None

    # Quem pode falar com o agente (telefones com DDI, só dígitos, separados por vírgula).
    # Ex.: 5564999998888,5564988887777. Vazio = ninguém responde (seguro por padrão).
    allowed_phones: str = ""

    # Banco local
    db_path: str = "estoque.db"

    # Segurança do webhook (opcional): se definido, o header "x-webhook-token" precisa bater
    webhook_token: str | None = None

    @property
    def allowed(self) -> set[str]:
        return {normalizar(p) for p in self.allowed_phones.split(",") if p.strip()}

    def autorizado(self, numero: str) -> bool:
        return normalizar(numero) in self.allowed


def normalizar(numero: str) -> str:
    """Só dígitos e sem o nono dígito de celular brasileiro.

    O WhatsApp entrega muitos números do Brasil sem o 9 (ex.: 556499998888 em vez de
    5564999998888), então comparamos sempre na forma sem o 9.
    """
    n = "".join(c for c in numero if c.isdigit())
    if len(n) == 13 and n.startswith("55") and n[4] == "9":
        n = n[:4] + n[5:]
    return n


settings = Settings()
