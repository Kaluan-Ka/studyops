---
id: TASK-000054
fundamento_id: FUN-000009
etapa_id: STEP-000027
title: Comparar fluxo sincrono e assincrono
slug: comparar-fluxo-sincrono-e-assincrono
status: a_fazer
order: 54
goal: Comparar simplicidade e confiabilidade entre ingestao imediata e processamento em etapas.
expected_evidence:
  - nota_markdown
---

# Comparar fluxo sincrono e assincrono

Compare o pipeline que termina durante a chamada com o pipeline que publica
um trabalho para um worker. A fila e uma evolucao, nao o ponto de partida.

## Fontes usadas

- [`Message queues`](https://github.com/donnemartin/system-design-primer#message-queues) e [`Task queues`](https://github.com/donnemartin/system-design-primer#task-queues), em `donnemartin/system-design-primer/README.md`.
- `projetos-portfolio-ia.md`, evolucoes do sistema de ingestao.
- `content/fundamentos/shell-e-processos.md`, processo principal e worker.

## Comparacao guiada

```txt
sincrono: requisicao -> ingestao -> resultado
assincrono: requisicao -> job pendente -> worker -> resultado consultavel
```

O segundo desenho precisa de estados, identificador de trabalho, mecanismo de
erro e forma de consultar o resultado. Ele pode melhorar a resposta percebida
para tarefas demoradas, mas torna o sistema mais dificil de observar.

## Roteiro de estudo

1. Meça ou estime o tempo do fluxo local sem inventar dados.
2. Liste o que o cliente recebe em cada desenho.
3. Liste estados e falhas do worker.
4. Escolha o desenho adequado para o MVP.
5. Defina o sinal que justificaria evolucao.

## Perguntas de revisao

1. Que problema a fila resolve?
2. Que problema ela cria?
3. Como o resultado assincrono seria encontrado?
4. Por que a primeira evidencia deve ser sincrona?

## Resultado esperado

- Tabela com latencia percebida, complexidade e falhas possiveis.
- Justificativa para manter o fluxo sincrono no MVP.
- Condicao que justificaria fila e worker.
