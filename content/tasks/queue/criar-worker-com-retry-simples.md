---
id: TASK-000016
fundamento_id: FUN-000003
etapa_id: STEP-000008
title: Criar worker com retry simples
slug: criar-worker-com-retry-simples
status: a_fazer
order: 16
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Criar worker com retry simples

Implementar um worker que processa itens da fila e repete itens que falham ate
um limite de tentativas.

## Resultado esperado

- Worker processando itens em ordem.
- Teste para sucesso depois de retry.
- Registro dos itens que excedem o limite de tentativas.
