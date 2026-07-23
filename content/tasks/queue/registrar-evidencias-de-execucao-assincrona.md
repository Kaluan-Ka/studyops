---
id: TASK-000018
fundamento_id: FUN-000003
etapa_id: STEP-000009
title: Registrar evidencias de execucao assincrona
slug: registrar-evidencias-de-execucao-assincrona
status: a_fazer
order: 18
expected_evidence:
  - nota_markdown
  - exemplo_reproduzivel
---

# Registrar evidencias de execucao assincrona

Criar um registro simples para mostrar quais itens foram processados, quais
falharam e quais precisaram de nova tentativa.

## Resultado esperado

- Log ou tabela com `item_id`, tentativa e status.
- Exemplo com ao menos um retry.
- Nota explicando como isso ajuda a depurar pipelines.
