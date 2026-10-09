"""Conversa com o agente pelo terminal, sem WhatsApp (pra testar).

Uso: python cli.py
"""
from ai import Agente
from config import settings
from db import Estoque

if __name__ == "__main__":
    agente = Agente(Estoque(settings.db_path))
    print("Agente de estoque (Ctrl+C pra sair)\n")
    try:
        while True:
            msg = input("você: ").strip()
            if msg:
                print("bot:", agente.responder("terminal", msg, "terminal"), "\n")
    except (KeyboardInterrupt, EOFError):
        print()
