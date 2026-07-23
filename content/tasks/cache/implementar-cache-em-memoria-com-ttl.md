---
id: TASK-000009
fundamento_id: FUN-000002
etapa_id: STEP-000005
title: Implementar cache em memoria com TTL
slug: implementar-cache-em-memoria-com-ttl
status: a_fazer
order: 9
expected_evidence:
  - teste_automatizado
---

# Implementar cache em memoria com TTL

Criar uma estrutura pequena que guarda valores por chave e remove ou ignora
entradas expiradas.

## Resultado esperado

- `set`, `get`, `has` e `delete` funcionando.
- Teste para item valido antes do TTL.
- Teste para item expirado depois do TTL.
