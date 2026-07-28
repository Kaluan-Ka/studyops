---
id: TASK-000037
fundamento_id: FUN-000007
etapa_id: STEP-000019
title: Desenhar contrato request response
slug: desenhar-contrato-request-response
status: a_fazer
order: 37
expected_evidence:
  - nota_markdown
---

# Desenhar contrato request response

Antes de criar uma rota, escreva a conversa entre cliente e servidor. O
contrato evita que a API seja apenas uma funcao acessivel por uma URL.

## Fontes usadas

- [`Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http), em `donnemartin/system-design-primer/README.md`.
- `trilha-engenharia-ia.md`, `Web servers/APIs`.
- `projetos-portfolio-ia.md`, MVP do `Local Research Searcher`.

## Conceito explicado

Use uma linha por operacao:

| Requisicao | Entrada | Sucesso | Falha |
| --- | --- | --- | --- |
| `GET /notes/cli` | id no caminho | `200` + nota | `404` + `note_not_found` |
| `POST /notes` | JSON com titulo e corpo | `201` + id | `400` + `invalid_note` |

O servidor deve validar a entrada antes de executar a regra. O cliente deve
conseguir decidir o proximo passo olhando status e body, sem ler logs.

## Exemplo de payload

```json
{
  "title": "CLI",
  "body": "Entrada e saida formam um contrato."
}
```

Defina tambem o que nao entra: titulo vazio, body ausente e campos desconhecidos.

## Roteiro de estudo

1. Escolha uma operacao de leitura.
2. Desenhe a tabela acima.
3. Escreva uma resposta de sucesso e uma de falha.
4. Liste as validacoes sem implementar ainda.
5. Compare o contrato com a pergunta que o portfolio precisa responder.

## Perguntas de revisao

1. O que pertence ao caminho e o que pertence ao body?
2. Por que a falha precisa de um status?
3. Que parte do contrato pode ser testada sem servidor?
4. Qual operacao fica fora do primeiro MVP?

## Resultado esperado

- Tabela de recurso, metodo, entrada, sucesso e falha.
- Payload de exemplo.
- Nota justificando o menor contrato suficiente.
