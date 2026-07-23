---
id: TASK-000028
fundamento_id: FUN-000005
etapa_id: STEP-000014
title: Adicionar healthcheck e volume persistente
slug: adicionar-healthcheck-e-volume-persistente
status: a_fazer
order: 28
expected_evidence:
  - docker_compose
  - exemplo_reproduzivel
---

# Adicionar healthcheck e volume persistente

Evoluir a stack minima com healthcheck para o banco e volume persistente para
dados locais.

## Resultado esperado

- Healthcheck declarando quando o banco esta pronto.
- Volume nomeado para persistir dados.
- Nota sobre quando remover volume em ambiente de estudo.
