---
id: TASK-000032
fundamento_id: FUN-000006
etapa_id: STEP-000016
title: Selecionar guia build your own de CLI
slug: selecionar-guia-build-your-own-cli
status: a_fazer
order: 32
expected_evidence:
  - nota_markdown
  - link_analisado
---

# Selecionar guia build your own de CLI

O `build-your-own-x` nao e uma apostila unica. Ele e um mapa de guias que
recriam tecnologias pequenas. A tarefa e aprender a extrair uma referencia
sem transforma-la em uma lista infinita de leitura.

## Fontes usadas

- [`Build your own Command-Line Tool`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool), em `codecrafters-io/build-your-own-x/README.md`.
- `trilha-engenharia-ia.md`, regra de usar referencias quando elas desbloqueiam
  um projeto concreto.
- [`How to use it`](https://github.com/jwasham/coding-interview-university#how-to-use-it), em `jwasham/coding-interview-university/README.md`, usado para
  estudar em ordem e marcar somente o que foi praticado.

## Como ler a referencia

Para cada guia escolhido, extraia quatro coisas:

1. **Objetivo:** qual ferramenta ou comportamento esta sendo recriado?
2. **Menor mecanismo:** qual e a primeira parte que pode ser implementada?
3. **Evidencia:** que entrada, saida ou teste comprova que funcionou?
4. **Limite:** o que o guia faz que ainda nao pertence ao MVP do StudyOps?

Esse filtro impede que "estudar CLI" vire consumir todos os tutoriais da
secao. O guia e uma referencia de projeto; o codigo e a explicacao final
precisam ser proprios e ligados ao fluxo de notas.

## Exemplo de ficha preenchida

```md
Referencia: build-your-own-x/README.md, Build your own Command-Line Tool
Objetivo: escolher um exercicio de ferramenta de linha de comando
Menor mecanismo: aceitar uma entrada e produzir uma saida deterministica
Evidencia: fixture executada duas vezes com a mesma saida
Limite: nao estudar ainda instalacao global, plugins ou distribuicao
Aplicacao: studyops-ingest para notas locais
```

## Roteiro de estudo

1. Abra a secao indicada no source map.
2. Escolha somente um guia compativel com uma CLI pequena.
3. Preencha a ficha acima sem copiar o tutorial.
4. Compare o menor mecanismo do guia com o contrato da tarefa anterior.
5. Registre uma decisao: usar agora, estudar depois ou ignorar.

## Perguntas de revisao

1. Por que uma lista de links nao e ainda uma trilha de estudo?
2. Qual parte do guia escolhido pode virar uma fixture local?
3. Que detalhe do guia esta fora do escopo do primeiro comando?
4. Como voce provaria que entendeu sem apenas resumir o texto?

## Resultado esperado

- Link exato analisado.
- Ficha preenchida com objetivo, mecanismo, evidencia, limite e aplicacao.
- Uma decisao de curadoria justificando por que o guia entra agora ou depois.
