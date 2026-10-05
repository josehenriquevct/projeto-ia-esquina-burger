"""Ferramentas que o Claude pode chamar para mexer no estoque."""
import json

from db import Estoque


def _fmt_qtd(q: float) -> str:
    return str(int(q)) if float(q).is_integer() else f"{q:.2f}".rstrip("0").rstrip(".")


def _item_str(i: dict) -> str:
    alerta = " ⚠️ abaixo do mínimo" if i["minimo"] > 0 and i["quantidade"] <= i["minimo"] else ""
    minimo = f" (mín. {_fmt_qtd(i['minimo'])})" if i["minimo"] > 0 else ""
    return f"{i['nome']}: {_fmt_qtd(i['quantidade'])} {i['unidade']}{minimo}{alerta}"


# Definições no formato da Messages API (strict: entrada sempre válida contra o schema).
TOOLS: list[dict] = [
    {
        "name": "listar_estoque",
        "description": "Lista todos os itens cadastrados com quantidade atual, unidade e mínimo.",
        "strict": True,
        "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False},
    },
    {
        "name": "consultar_item",
        "description": "Consulta a quantidade atual de um item pelo nome (aceita nome parcial).",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {"nome": {"type": "string", "description": "Nome ou parte do nome do item"}},
            "required": ["nome"],
            "additionalProperties": False,
        },
    },
    {
        "name": "cadastrar_item",
        "description": "Cadastra um item novo no estoque. Use só quando o item ainda não existir.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string"},
                "unidade": {"type": "string", "description": "un, kg, g, L, ml, pct, cx, fardo..."},
                "quantidade_inicial": {"type": "number"},
                "minimo": {"type": "number", "description": "Quantidade mínima para alerta (0 = sem alerta)"},
            },
            "required": ["nome", "unidade", "quantidade_inicial", "minimo"],
            "additionalProperties": False,
        },
    },
    {
        "name": "registrar_entrada",
        "description": "Registra entrada (compra/recebimento) de um item: soma à quantidade atual.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string"},
                "quantidade": {"type": "number"},
                "obs": {"type": "string", "description": "Fornecedor, preço, nota... ou string vazia"},
            },
            "required": ["nome", "quantidade", "obs"],
            "additionalProperties": False,
        },
    },
    {
        "name": "registrar_saida",
        "description": "Registra saída (uso/consumo/perda) de um item: subtrai da quantidade atual.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string"},
                "quantidade": {"type": "number"},
                "obs": {"type": "string", "description": "Motivo (uso, perda, vencido...) ou string vazia"},
            },
            "required": ["nome", "quantidade", "obs"],
            "additionalProperties": False,
        },
    },
    {
        "name": "ajustar_estoque",
        "description": "Define a quantidade EXATA de um item (contagem/inventário). Substitui o saldo atual.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string"},
                "quantidade": {"type": "number"},
                "obs": {"type": "string"},
            },
            "required": ["nome", "quantidade", "obs"],
            "additionalProperties": False,
        },
    },
    {
        "name": "definir_minimo",
        "description": "Define a quantidade mínima de um item; abaixo dela o item entra na lista de compras.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {"nome": {"type": "string"}, "minimo": {"type": "number"}},
            "required": ["nome", "minimo"],
            "additionalProperties": False,
        },
    },
    {
        "name": "lista_de_compras",
        "description": "Lista os itens que estão no mínimo ou abaixo (o que precisa comprar).",
        "strict": True,
        "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False},
    },
    {
        "name": "historico",
        "description": "Últimas movimentações (entradas, saídas, ajustes), de um item ou de todos.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "nome": {"type": "string", "description": "Nome do item ou string vazia para todos"},
                "limite": {"type": "integer", "description": "Quantas movimentações (padrão 10)"},
            },
            "required": ["nome", "limite"],
            "additionalProperties": False,
        },
    },
    {
        "name": "remover_item",
        "description": "Remove um item do estoque (e seu histórico). Só use após o usuário confirmar explicitamente.",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {"nome": {"type": "string"}},
            "required": ["nome"],
            "additionalProperties": False,
        },
    },
]


class ToolError(Exception):
    """Erro que vai de volta pro Claude como tool_result com is_error."""


def _resolver(db: Estoque, nome: str) -> dict:
    item = db.buscar(nome)
    if item:
        return item
    cands = db.candidatos(nome)
    if len(cands) > 1:
        nomes = ", ".join(c["nome"] for c in cands)
        raise ToolError(f"Nome ambíguo '{nome}'. Itens parecidos: {nomes}. Pergunte qual é.")
    raise ToolError(f"Item '{nome}' não está cadastrado. Pergunte se deve cadastrar (unidade e mínimo).")


def executar(db: Estoque, nome_tool: str, entrada: dict, autor: str | None = None) -> str:
    """Executa a ferramenta e devolve texto para o Claude. Lança ToolError em caso de erro."""
    if nome_tool == "listar_estoque":
        itens = db.listar()
        if not itens:
            return "Estoque vazio: nenhum item cadastrado ainda."
        return "\n".join(_item_str(i) for i in itens)

    if nome_tool == "consultar_item":
        return _item_str(_resolver(db, entrada["nome"]))

    if nome_tool == "cadastrar_item":
        if db.candidatos(entrada["nome"]) and db.buscar(entrada["nome"]):
            raise ToolError("Já existe um item com esse nome. Use registrar_entrada ou ajustar_estoque.")
        item = db.cadastrar(
            entrada["nome"], entrada["unidade"], entrada["quantidade_inicial"], entrada["minimo"]
        )
        return "Cadastrado: " + _item_str(item)

    if nome_tool in ("registrar_entrada", "registrar_saida", "ajustar_estoque"):
        tipo = {"registrar_entrada": "entrada", "registrar_saida": "saida", "ajustar_estoque": "ajuste"}[nome_tool]
        item = _resolver(db, entrada["nome"])
        if tipo != "ajuste" and entrada["quantidade"] <= 0:
            raise ToolError("A quantidade precisa ser maior que zero.")
        antes = item["quantidade"]
        try:
            item = db.movimentar(item["id"], tipo, entrada["quantidade"], entrada.get("obs") or None, autor)
        except ValueError as e:
            raise ToolError(str(e)) from e
        return f"OK ({tipo}). Antes: {_fmt_qtd(antes)} → agora: " + _item_str(item)

    if nome_tool == "definir_minimo":
        item = _resolver(db, entrada["nome"])
        item = db.definir_minimo(item["id"], entrada["minimo"])
        return "Mínimo atualizado: " + _item_str(item)

    if nome_tool == "lista_de_compras":
        itens = db.abaixo_do_minimo()
        if not itens:
            return "Nada abaixo do mínimo. Estoque em dia."
        linhas = []
        for i in itens:
            falta = i["minimo"] - i["quantidade"]
            linhas.append(f"{_item_str(i)} — repor pelo menos {_fmt_qtd(max(falta, 0))} {i['unidade']}")
        return "\n".join(linhas)

    if nome_tool == "historico":
        item_id = None
        if entrada.get("nome"):
            item_id = _resolver(db, entrada["nome"])["id"]
        movs = db.historico(item_id, max(1, min(int(entrada.get("limite") or 10), 50)))
        if not movs:
            return "Sem movimentações registradas."
        sinal = {"entrada": "+", "saida": "-", "ajuste": "="}
        return "\n".join(
            f"{m['criado_em'][:16].replace('T', ' ')} {m['nome']} {sinal[m['tipo']]}{_fmt_qtd(m['quantidade'])} "
            f"{m['unidade']} → saldo {_fmt_qtd(m['saldo'])}" + (f" ({m['obs']})" if m["obs"] else "")
            for m in movs
        )

    if nome_tool == "remover_item":
        item = _resolver(db, entrada["nome"])
        db.remover(item["id"])
        return f"Item '{item['nome']}' removido."

    raise ToolError(f"Ferramenta desconhecida: {nome_tool}")


def executar_json(db: Estoque, nome_tool: str, entrada: dict, autor: str | None = None) -> str:
    """Variante que devolve JSON (útil pra testes)."""
    return json.dumps({"resultado": executar(db, nome_tool, entrada, autor)}, ensure_ascii=False)
