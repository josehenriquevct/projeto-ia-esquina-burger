"""Banco de estoque em SQLite: itens + movimentações."""
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS itens (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    unidade   TEXT NOT NULL DEFAULT 'un',
    quantidade REAL NOT NULL DEFAULT 0,
    minimo    REAL NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS movimentos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id   INTEGER NOT NULL REFERENCES itens(id),
    tipo      TEXT NOT NULL CHECK (tipo IN ('entrada','saida','ajuste')),
    quantidade REAL NOT NULL,
    saldo     REAL NOT NULL,
    obs       TEXT,
    autor     TEXT,
    criado_em TEXT NOT NULL
);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Estoque:
    def __init__(self, path: str | Path):
        self.path = str(path)
        with self._conn() as c:
            c.executescript(SCHEMA)

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    # ---------- consultas ----------
    def listar(self) -> list[dict]:
        with self._conn() as c:
            rows = c.execute("SELECT * FROM itens ORDER BY nome").fetchall()
        return [dict(r) for r in rows]

    def buscar(self, nome: str) -> dict | None:
        """Busca exata (sem diferenciar maiúsculas); se não achar, tenta parcial."""
        with self._conn() as c:
            row = c.execute("SELECT * FROM itens WHERE nome = ?", (nome.strip(),)).fetchone()
            if row:
                return dict(row)
            rows = c.execute(
                "SELECT * FROM itens WHERE nome LIKE ? ORDER BY nome", (f"%{nome.strip()}%",)
            ).fetchall()
        if len(rows) == 1:
            return dict(rows[0])
        return None

    def candidatos(self, nome: str) -> list[dict]:
        with self._conn() as c:
            rows = c.execute(
                "SELECT * FROM itens WHERE nome LIKE ? ORDER BY nome", (f"%{nome.strip()}%",)
            ).fetchall()
        return [dict(r) for r in rows]

    def abaixo_do_minimo(self) -> list[dict]:
        with self._conn() as c:
            rows = c.execute(
                "SELECT * FROM itens WHERE minimo > 0 AND quantidade <= minimo ORDER BY nome"
            ).fetchall()
        return [dict(r) for r in rows]

    def historico(self, item_id: int | None = None, limite: int = 20) -> list[dict]:
        sql = (
            "SELECT m.*, i.nome, i.unidade FROM movimentos m JOIN itens i ON i.id = m.item_id "
        )
        args: tuple = ()
        if item_id is not None:
            sql += "WHERE m.item_id = ? "
            args = (item_id,)
        sql += "ORDER BY m.id DESC LIMIT ?"
        with self._conn() as c:
            rows = c.execute(sql, args + (limite,)).fetchall()
        return [dict(r) for r in rows]

    # ---------- escrita ----------
    def cadastrar(self, nome: str, unidade: str = "un", quantidade: float = 0, minimo: float = 0) -> dict:
        nome = nome.strip()
        with self._conn() as c:
            c.execute(
                "INSERT INTO itens (nome, unidade, quantidade, minimo, criado_em) VALUES (?,?,?,?,?)",
                (nome, unidade.strip() or "un", quantidade, minimo, _now()),
            )
            item = dict(c.execute("SELECT * FROM itens WHERE nome = ?", (nome,)).fetchone())
            if quantidade:
                c.execute(
                    "INSERT INTO movimentos (item_id, tipo, quantidade, saldo, obs, criado_em) "
                    "VALUES (?,?,?,?,?,?)",
                    (item["id"], "entrada", quantidade, quantidade, "estoque inicial", _now()),
                )
        return item

    def movimentar(self, item_id: int, tipo: str, quantidade: float, obs: str | None = None,
                   autor: str | None = None) -> dict:
        """tipo: 'entrada' soma, 'saida' subtrai, 'ajuste' define o saldo exato."""
        if tipo not in ("entrada", "saida", "ajuste"):
            raise ValueError("tipo inválido")
        with self._conn() as c:
            row = c.execute("SELECT * FROM itens WHERE id = ?", (item_id,)).fetchone()
            if not row:
                raise KeyError("item não encontrado")
            atual = float(row["quantidade"])
            if tipo == "entrada":
                novo = atual + quantidade
            elif tipo == "saida":
                novo = atual - quantidade
            else:
                novo = quantidade
            if novo < 0:
                raise ValueError(
                    f"saída de {quantidade} deixaria o saldo negativo (atual: {atual})"
                )
            c.execute("UPDATE itens SET quantidade = ? WHERE id = ?", (novo, item_id))
            c.execute(
                "INSERT INTO movimentos (item_id, tipo, quantidade, saldo, obs, autor, criado_em) "
                "VALUES (?,?,?,?,?,?,?)",
                (item_id, tipo, quantidade, novo, obs, autor, _now()),
            )
            return dict(c.execute("SELECT * FROM itens WHERE id = ?", (item_id,)).fetchone())

    def definir_minimo(self, item_id: int, minimo: float) -> dict:
        with self._conn() as c:
            c.execute("UPDATE itens SET minimo = ? WHERE id = ?", (minimo, item_id))
            row = c.execute("SELECT * FROM itens WHERE id = ?", (item_id,)).fetchone()
        if not row:
            raise KeyError("item não encontrado")
        return dict(row)

    def renomear(self, item_id: int, novo_nome: str) -> dict:
        with self._conn() as c:
            c.execute("UPDATE itens SET nome = ? WHERE id = ?", (novo_nome.strip(), item_id))
            row = c.execute("SELECT * FROM itens WHERE id = ?", (item_id,)).fetchone()
        return dict(row)

    def remover(self, item_id: int) -> None:
        with self._conn() as c:
            c.execute("DELETE FROM movimentos WHERE item_id = ?", (item_id,))
            c.execute("DELETE FROM itens WHERE id = ?", (item_id,))
