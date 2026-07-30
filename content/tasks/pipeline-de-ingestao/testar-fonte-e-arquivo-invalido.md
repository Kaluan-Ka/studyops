---
id: TASK-000052
fundamento_id: FUN-000009
etapa_id: STEP-000026
title: Testar fonte e arquivo invalido
slug: testar-fonte-e-arquivo-invalido
status: a_fazer
order: 52
goal: Provar que o pipeline falha de forma clara quando a fonte ou o arquivo nao podem ser processados.
expected_evidence:
  - teste_automatizado
---

# Testar fonte e arquivo invalido

Teste duas propriedades do pipeline: um registro valido aponta para sua fonte
e uma entrada fora do contrato nao vira um resultado aparentemente valido.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  fonte, metadados e limitacoes.
- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`.
- `content/fundamentos/testes-e-evidencias.md`, matriz de evidencia.

## Casos guiados

```ts
it("preserva source e ordem", () => {
  const chunks = ingest("notas/cli.md", "markdown", "um\n\ndois");
  expect(chunks.map((chunk) => [chunk.source, chunk.chunkIndex]))
    .toEqual([["notas/cli.md", 0], ["notas/cli.md", 1]]);
});

it("rejeita arquivo vazio", () => {
  expect(() => ingest("vazio.md", "markdown", "  "))
    .toThrow("arquivo vazio");
});
```

Adapte a sintaxe ao executor escolhido, mas preserve a pergunta do teste:
fonte e ordem continuam rastreaveis? A entrada invalida falha de forma
explicita?

## Perguntas de revisao

1. O teste prova conteudo ou rastreabilidade?
2. O que deve acontecer com formato PDF neste ciclo?
3. Como diferenciar arquivo vazio de arquivo inexistente?
4. Qual evidencia seria necessaria para aceitar outro formato?

## Resultado esperado

- Um teste confirma a fonte do registro.
- Um teste confirma a falha do arquivo invalido.
- Comportamento fora do escopo documentado.
