---
id: TASK-000043
fundamento_id: FUN-000008
etapa_id: STEP-000022
title: Mapear comando processo e status
slug: mapear-comando-processo-e-status
status: a_fazer
order: 43
expected_evidence:
  - nota_markdown
---

# Mapear comando processo e status

Observe um comando real no terminal e diferencie o texto digitado, o programa
iniciado e o resultado do processo.

## Fontes usadas

- [`Build your own Shell`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-shell), em `codecrafters-io/build-your-own-x/README.md`.
- [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads), em `jwasham/coding-interview-university/README.md`.
- `content/fundamentos/shell-e-processos.md`, modelo de shell e processo.

## Experimento

```bash
echo ok
echo diagnostico >&2
echo $?
```

Registre qual comando foi iniciado, o que apareceu em stdout, o que apareceu em
stderr e qual codigo de retorno o shell exibiu. Repita com um comando
inexistente e compare os resultados.

## Roteiro de estudo

1. Execute o caso de sucesso.
2. Execute o caso de erro.
3. Redirecione stdout e stderr para arquivos separados.
4. Repita com um comando inexistente.
5. Explique o que o processo principal consegue saber.

## Perguntas de revisao

1. Shell e processo sao a mesma coisa?
2. Por que `echo $?` precisa vir logo depois do comando?
3. Qual saida pode ser consumida por outro processo?
4. Que parte do experimento depende do shell usado?

## Resultado esperado

- Nota com o fluxo observado.
- Um caso de sucesso e um de falha.
- Distincao escrita entre comando, processo e codigo de retorno.
