---
id: TASK-000039
fundamento_id: FUN-000007
etapa_id: STEP-000020
title: Criar endpoint local de notas
slug: criar-endpoint-local-de-notas
status: a_fazer
order: 39
goal: Expor notas locais por HTTP com uma resposta simples, previsivel e testavel.
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Criar endpoint local de notas

Implemente uma rota local sem adicionar banco ou modelo externo. O primeiro
objetivo e ver a fronteira HTTP funcionando com dados em memoria.

## Fontes usadas

- `trilha-engenharia-ia.md`, projeto de API simples.
- `projetos-portfolio-ia.md`, MVP do `Local Research Searcher`.
- [`Build your own Web Server`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-web-server), em `codecrafters-io/build-your-own-x/README.md`.

## Exemplo de handler

```ts
const notes = new Map([
  ["cli", { id: "cli", title: "CLI", body: "Entrada e saida" }],
]);

function getNote(id: string) {
  const note = notes.get(id);
  return note
    ? { status: 200, body: note }
    : { status: 404, body: { error: "note_not_found" } };
}
```

O framework ou servidor escolhido deve apenas adaptar request para `getNote` e
devolver status e JSON. A regra continua testavel sem iniciar a porta.

## Roteiro de implementacao

1. Crie uma nota fixa em memoria.
2. Implemente `GET /notes/:id`.
3. Teste id existente e id ausente.
4. Chame a rota com `curl -i`.
5. Guarde a resposta como evidencia.

## Perguntas de revisao

1. Onde o id e extraido da requisicao?
2. O que o handler sabe sobre o transporte?
3. Por que o caso ausente nao deve retornar `200`?
4. O que seria necessario mudar para trocar memoria por um adaptador?

## Resultado esperado

- Endpoint executavel localmente.
- Exemplo de chamada e resposta.
- Testes para nota existente e inexistente.
