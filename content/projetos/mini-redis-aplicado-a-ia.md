---
id: PROJ-000001
title: Mini Redis aplicado a IA
slug: mini-redis-aplicado-a-ia
status: planejado
order: 1
summary: Versão pequena de Redis para estudar cache, expiração, armazenamento em memória e uso em fluxos de IA.
fundament_ids:
  - FUN-000007
  - FUN-000008
  - FUN-000010
task_ids:
  - TASK-000039
  - TASK-000043
  - TASK-000045
  - TASK-000058
---

# Mini Redis aplicado a IA

## Objetivo

Construir uma versão pequena de um servidor de chave-valor e aplicá-la como
cache de respostas, embeddings ou sessões temporárias de um fluxo de IA.

## MVP

Implementar `SET`, `GET`, `DEL` e `EXISTS` em memória, expor uma API HTTP
simples, criar testes dos comandos principais e documentar exemplos e
limitações em um README.

## Evoluções

Adicionar `EXPIRE` e `TTL`, limpeza de chaves expiradas, persistência simples,
Docker Compose, dashboard de chaves e uma demo que mostre chamadas de IA
evitadas pelo cache.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 1: Mini Redis aplicado a IA`.
- `trilha-engenharia-ia.md`, `Bloco 2: Dados, busca e memoria`.
- `trilha-engenharia-ia.md`, `Ordem recomendada`, cache e Mini Redis.

## Relações na trilha

Os fundamentos e tarefas relacionados estão declarados no frontmatter e são
validados contra o registry do StudyOps.
