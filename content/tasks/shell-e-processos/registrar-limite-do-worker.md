---
id: TASK-000048
fundamento_id: FUN-000008
etapa_id: STEP-000024
title: Registrar limite do worker
slug: registrar-limite-do-worker
status: a_fazer
order: 48
goal: Documentar limites de worker para evitar prometer paralelismo, fila ou robustez que ainda nao existem.
expected_evidence:
  - nota_markdown
---

# Registrar limite do worker

Conclua o ciclo explicando quando um worker ajudaria e por que ele nao entra no
MVP atual.

## Fontes usadas

- [`Asynchronism`](https://github.com/donnemartin/system-design-primer#asynchronism), em `donnemartin/system-design-primer/README.md`, incluindo trabalho em background, filas e custo de complexidade.
- `projetos-portfolio-ia.md`, evolucao do sistema de ingestao com fila e worker.

## Template de decisao

```md
Problema observado: o processamento bloqueia por ______.
Evidencia atual: medicao ou experimento ______.
Worker ajudaria porque ______.
Novo estado necessario: pendente / concluido / falhou.
Decisao agora: manter sincrono porque ______.
Gatilho para evoluir: ______.
```

Nao preencha a medicao por imaginacao. Se ainda nao mediu, escreva que a
hipotese esta aberta e crie um experimento menor.

## Perguntas de revisao

1. Qual sintoma justificaria desacoplamento?
2. Que estado precisa ser persistido?
3. Como uma falha do worker seria percebida?
4. O que a fila resolve e o que ela nao resolve?

## Resultado esperado

- Motivo concreto para adiar o worker real.
- Sinal que indicaria necessidade futura.
- Proxima aplicacao registrada na nota.
