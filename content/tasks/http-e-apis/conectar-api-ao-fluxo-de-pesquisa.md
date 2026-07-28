---
id: TASK-000041
fundamento_id: FUN-000007
etapa_id: STEP-000021
title: Conectar API ao fluxo de pesquisa
slug: conectar-api-ao-fluxo-de-pesquisa
status: a_fazer
order: 41
expected_evidence:
  - exemplo_reproduzivel
---

# Conectar API ao fluxo de pesquisa

Use a API como uma fronteira real do `Local Research Searcher`, mas mantenha o
fluxo pequeno: consultar uma nota local e devolver sua fonte.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto central: Local Research Searcher`, MVP
  de cadastrar notas, links e buscar por palavra-chave.
- `trilha-engenharia-ia.md`, projeto de API simples.
- `content/fundamentos/http-e-apis.md`, contrato de leitura por `GET`.

## Fluxo do experimento

```txt
curl /notes/cli -> endpoint local -> adaptador de notas -> resposta JSON
```

Exemplo de resposta:

```json
{
  "id": "cli",
  "title": "CLI",
  "source": "notas/cli.md",
  "body": "Entrada e saida formam um contrato."
}
```

## Roteiro de aplicacao

1. Prepare duas notas com fontes diferentes.
2. Registre-as no adaptador local.
3. Exponha apenas `GET /notes/:id`.
4. Execute duas consultas e uma consulta ausente.
5. Compare a resposta com a pergunta que o buscador devera responder.

## Perguntas de revisao

1. Que informacao da fonte precisa chegar ao cliente?
2. O endpoint esta fazendo busca ou apenas leitura por id?
3. Qual proxima etapa adicionaria palavra-chave?
4. O que deve permanecer fora antes de existir armazenamento real?

## Resultado esperado

- Uma chamada documentada atravessando o endpoint.
- Duas notas de exemplo com origem preservada.
- Limitacao registrada sobre armazenamento e busca ainda ausentes.
