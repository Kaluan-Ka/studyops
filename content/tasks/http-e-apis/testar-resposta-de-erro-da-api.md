---
id: TASK-000040
fundamento_id: FUN-000007
etapa_id: STEP-000020
title: Testar resposta de erro da API
slug: testar-resposta-de-erro-da-api
status: a_fazer
order: 40
goal: Garantir que erros de API tenham status, mensagem e recuperacao claros para quem consome o endpoint.
expected_evidence:
  - teste_automatizado
---

# Testar resposta de erro da API

Uma API que responde sempre `200` empurra a interpretacao da falha para cada
cliente. Teste o contrato de erro de forma explicita.

## Fontes usadas

- [`Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http), em `donnemartin/system-design-primer/README.md`, HTTP como request/response com status de conclusao.
- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`.
- `content/fundamentos/http-e-apis.md`, exemplo `note_not_found`.

## Casos de teste

| Entrada | Status | Body esperado |
| --- | --- | --- |
| id `cli` | `200` | objeto da nota |
| id `nao-existe` | `404` | `{"error":"note_not_found"}` |
| payload sem titulo | `400` | `{"error":"invalid_note"}` |

Comece pelo caso de recurso ausente, porque ele prova que o endpoint consegue
comunicar uma falha sem excecao nao tratada.

## Exemplo de teste conceitual

```ts
it("retorna 404 para nota inexistente", () => {
  expect(getNote("nao-existe")).toEqual({
    status: 404,
    body: { error: "note_not_found" },
  });
});
```

## Roteiro de estudo

1. Escreva a tabela de casos.
2. Teste o handler sem servidor.
3. Teste uma chamada HTTP real.
4. Compare status e body.
5. Registre se algum erro ainda aparece apenas no log.

## Perguntas de revisao

1. Por que status e body cumprem papeis diferentes?
2. O teste unitario prova que a porta esta aberta?
3. Que teste de integracao falta?
4. O que o cliente poderia fazer depois de receber `404`?

## Resultado esperado

- Teste de entrada invalida ou recurso ausente.
- Status e body verificados.
- Nota sobre o limite entre teste do handler e teste HTTP.
