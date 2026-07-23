---
id: TASK-000011
fundamento_id: FUN-000002
etapa_id: STEP-000006
title: Cachear resposta de chamada cara
slug: cachear-resposta-de-chamada-cara
status: a_fazer
order: 11
expected_evidence:
  - exemplo_reproduzivel
  - nota_markdown
---

# Cachear resposta de chamada cara

Simular uma chamada cara e cachear a resposta para evitar repetir o mesmo
trabalho quando a entrada nao muda.

## Resultado esperado

- Chamada simulada com atraso ou contador de execucoes.
- Segunda chamada para a mesma entrada usando cache.
- Nota sobre chave de cache e tempo de validade.
