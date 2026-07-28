---
id: TASK-000045
fundamento_id: FUN-000008
etapa_id: STEP-000023
title: Executar comando com status observavel
slug: executar-comando-com-status-observavel
status: a_fazer
order: 45
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Executar comando com status observavel

Implemente uma funcao que inicie um comando local e devolva stdout, stderr e
codigo. O exercicio transforma uma observacao do shell em uma fronteira de
programa.

## Fontes usadas

- `trilha-engenharia-ia.md`, `Shell/processos`.
- [`Build your own Shell`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-shell), em `codecrafters-io/build-your-own-x/README.md`.
- `content/fundamentos/shell-e-processos.md`, exemplo com `spawn`.

## Exemplo minimo

```ts
type Result = { code: number | null; stdout: string; stderr: string };

// Use spawn(command, args) e resolva somente no evento close.
// Acumule stdout e stderr em variaveis separadas.
```

O ponto de estudo e o ciclo de vida: iniciar, receber dados, observar erro e
esperar encerramento. Resolver cedo pode produzir um resultado incompleto.

## Roteiro de implementacao

1. Execute `echo ok`.
2. Capture stdout.
3. Execute um comando que escreve em stderr.
4. Capture codigo zero e codigo diferente de zero.
5. Crie uma Promise com o resultado completo.

## Perguntas de revisao

1. Por que o evento `close` importa?
2. O que acontece se o processo emitir dois chunks de stdout?
3. Como diferenciar comando inexistente de falha do comando?
4. Que parte deve ser injetada para testar sem spawn real?

## Resultado esperado

- Caminho de sucesso reproduzivel.
- Caminho de falha verificavel.
- Teste dos valores retornados e do status escolhido.
