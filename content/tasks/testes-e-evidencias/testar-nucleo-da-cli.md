---
id: TASK-000057
fundamento_id: FUN-000010
etapa_id: STEP-000029
title: Testar nucleo da CLI
slug: testar-nucleo-da-cli
status: a_fazer
order: 57
expected_evidence:
  - teste_automatizado
---

# Testar nucleo da CLI

Separe a logica de processamento da entrada de terminal e teste o nucleo com
dados em memoria.

## Fontes usadas

- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`.
- [`Build your own Command-Line Tool`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool), em `codecrafters-io/build-your-own-x/README.md`.
- `content/fundamentos/cli-para-ferramentas.md`, separacao entre `parseArgs` e
  `run`.

## Exemplo de teste

```ts
it("produz contagem deterministica", () => {
  expect(run("um\ndois", { inputPath: "nota.md", format: "json" }))
    .toBe('{"source":"nota.md","lineCount":2}');
});
```

Esse teste nao precisa iniciar o shell. Depois adicione um teste de adaptador
para confirmar que o processo transforma uma excecao em stderr e codigo de
retorno.

## Roteiro de estudo

1. Escolha o caso feliz.
2. Escreva o resultado esperado.
3. Teste a funcao pura.
4. Adicione o caso invalido.
5. Compare com uma execucao real da CLI.

## Perguntas de revisao

1. O teste prova o parser, o processamento ou o processo?
2. Por que o caminho do arquivo e parte do resultado?
3. Que erro exige teste de integracao?
4. O teste continuaria util se a biblioteca de CLI mudasse?

## Resultado esperado

- Teste do nucleo sem iniciar o terminal.
- Caso valido e caso de erro cobertos.
- Exemplo da CLI ligado ao teste.
