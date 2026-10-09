"""Agente de estoque: Claude + ferramentas, com histórico curto por telefone."""
import logging
from collections import defaultdict
from datetime import datetime
from zoneinfo import ZoneInfo

import anthropic

from config import settings
from db import Estoque
from tools import TOOLS, ToolError, executar

log = logging.getLogger("estoque.ai")

SYSTEM = """Você é o agente de estoque da Esquina Burger, uma hamburgueria artesanal em Vicentinópolis-GO.
Você conversa pelo WhatsApp com o dono e a equipe. Responda sempre em português do Brasil, curto e direto,
no tom de quem trabalha na cozinha: sem formalidade, sem enrolação, sem markdown pesado (WhatsApp só entende
*negrito* e _itálico_). Emojis com moderação.

Como agir:
- Use as ferramentas para TUDO que envolva números do estoque. Nunca invente quantidade.
- Mensagens soltas como "entrou 20 kg de carne", "usei 3 pacotes de pão", "acabou o cheddar" são comandos:
  interprete e registre (entrada, saída ou ajuste pra zero). Pode registrar vários itens de uma vez.
- Se o item não existe, pergunte se é pra cadastrar e com qual unidade e mínimo. Se o usuário já deu
  tudo na mensagem, cadastre direto.
- Se o nome for ambíguo, pergunte qual item é. Não chute.
- Nunca remova item sem o usuário confirmar explicitamente na mensagem anterior.
- Depois de registrar, confirme em uma linha: o que mudou e o saldo novo. Se o item ficou no mínimo ou
  abaixo, avise.
- "o que falta", "lista de compras", "o que precisa comprar" = ferramenta lista_de_compras.
- "como tá o estoque", "me mostra tudo" = listar_estoque.
- Quantidades: aceite "meio" (0,5), "uma dúzia" (12), "um fardo" (pergunte quantas unidades se não souber).
"""


def _agora() -> str:
    return datetime.now(ZoneInfo("America/Sao_Paulo")).strftime("%d/%m/%Y %H:%M")


class Agente:
    def __init__(self, db: Estoque):
        self.db = db
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        # histórico por telefone (só user/assistant, sem tool_use, pra manter curto e estável)
        self._hist: dict[str, list[dict]] = defaultdict(list)
        self._max_turnos = 12

    def _chamar(self, messages: list[dict]) -> anthropic.types.Message:
        # Modelo com thinking adaptativo (padrão) e fallback automático caso o pedido seja recusado.
        return self.client.beta.messages.create(
            model=settings.claude_model,
            max_tokens=4000,
            system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
            tools=TOOLS,
            messages=messages,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"effort": "low"},
        )

    def responder(self, telefone: str, texto: str, autor: str | None = None) -> str:
        hist = self._hist[telefone]
        hist.append({"role": "user", "content": f"[{_agora()}] {texto}"})
        hist[:] = hist[-self._max_turnos * 2 :]

        messages = list(hist)
        resposta_final = ""
        for _ in range(10):  # limite de rodadas de ferramenta
            resp = self._chamar(messages)

            if resp.stop_reason == "refusal":
                resposta_final = "Não consegui processar essa. Manda de outro jeito?"
                break

            messages.append({"role": "assistant", "content": resp.content})
            texto_blocos = [b.text for b in resp.content if b.type == "text"]
            usos = [b for b in resp.content if b.type == "tool_use"]

            if resp.stop_reason != "tool_use" or not usos:
                resposta_final = "\n".join(t for t in texto_blocos if t.strip()).strip()
                break

            resultados = []
            for uso in usos:
                try:
                    saida = executar(self.db, uso.name, dict(uso.input), autor)
                    resultados.append({"type": "tool_result", "tool_use_id": uso.id, "content": saida})
                except ToolError as e:
                    resultados.append(
                        {"type": "tool_result", "tool_use_id": uso.id, "content": str(e), "is_error": True}
                    )
                except Exception as e:  # erro inesperado: devolve pro modelo, não derruba o bot
                    log.exception("erro na ferramenta %s", uso.name)
                    resultados.append(
                        {"type": "tool_result", "tool_use_id": uso.id,
                         "content": f"Erro interno: {e}", "is_error": True}
                    )
            messages.append({"role": "user", "content": resultados})
        else:
            resposta_final = "Deu muita volta nessa. Tenta dividir em mensagens menores?"

        if not resposta_final:
            resposta_final = "Feito."
        hist.append({"role": "assistant", "content": resposta_final})
        return resposta_final

    def limpar(self, telefone: str) -> None:
        self._hist.pop(telefone, None)
