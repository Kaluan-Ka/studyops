---
id: TASK-000034
fundamento_id: FUN-000006
etapa_id: STEP-000017
title: Testar argumento invalido
slug: testar-argumento-invalido
status: a_fazer
order: 34
goal: Provar que a CLI comunica falhas de uso de forma observavel para humanos e scripts.
expected_evidence:
  - teste_automatizado
---

# Testar argumento invalido

Uma CLI confiavel falha de modo previsivel. Nesta aula, voce vai testar o
contrato de erro antes de adicionar novos recursos.

## Fontes usadas

- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`, usada para
  separar teste unitario, integracao e dependencia externa.
- `trilha-engenharia-ia.md`, `Criterio de sucesso`, usado para exigir teste e
  evidencia concreta.
- `content/fundamentos/cli-para-ferramentas.md`, modelo mental de stdout,
  stderr e codigo de retorno.

## Casos que precisam ser entendidos

| Entrada | Problema | Comportamento esperado |
| --- | --- | --- |
| `[]` | arquivo ausente | erro de uso em stderr |
| `["nota.md", "--format", "xml"]` | formato invalido | erro de validacao |
| `["nota.pdf"]` | extensao fora do MVP | rejeicao explicita ou limite documentado |
| `["nota.md", "--unknown"]` | opcao desconhecida | erro, nunca silencio |

O teste nao deve verificar apenas a frase exata. Verifique a propriedade que
importa: a entrada invalida nao vira uma saida de sucesso e o processo fornece
diagnostico suficiente para corrigir a chamada.

## Exemplo de teste conceitual

```ts
it("rejeita formato desconhecido", () => {
  expect(() => parseArgs(["nota.md", "--format", "xml"]))
    .toThrow("formato invalido");
});
```

O teste acima e unitario porque exercita o parser sem criar processo ou ler
disco. Um teste de processo pode ser adicionado depois para conferir se a
excecao vira mensagem em `stderr` e codigo de retorno adequado.

## Roteiro de estudo

1. Escolha dois casos da tabela.
2. Escreva o comportamento esperado antes do teste.
3. Execute o teste contra o parser.
4. Observe se a falha e clara e se nao contamina `stdout`.
5. Registre qualquer comportamento que ainda dependa do sistema operacional.

## Perguntas de revisao

1. Qual caso deve ser unitario e qual merece um teste de processo?
2. Por que aceitar uma opcao desconhecida silenciosamente e perigoso?
3. O que significa testar uma propriedade em vez de uma frase?
4. Que entrada invalida ainda falta cobrir?

## Resultado esperado

- Pelo menos dois casos invalidos cobertos por teste.
- Mensagem de erro compreensivel.
- Nota sobre codigo de retorno e separacao de stdout/stderr.
