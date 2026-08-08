---
id: PROJ-000002
title: Banco de dados documental mínimo
slug: banco-de-dados-documental-minimo
status: planejado
order: 2
summary: Armazenamento local de documentos JSON com consultas simples, persistência e índices básicos.
fundament_ids:
  - FUN-000006
  - FUN-000007
  - FUN-000010
task_ids:
  - TASK-000031
  - TASK-000033
  - TASK-000039
  - TASK-000058
---

# Banco de dados documental mínimo

## Objetivo

Criar um banco pequeno para inserir documentos JSON, buscar por `id` ou por um
campo simples e entender a diferença entre busca linear, persistência e índice.

## MVP

Inserir documento JSON, buscar por `id`, listar documentos, consultar por um
campo simples e persistir os dados em arquivo JSONL ou formato equivalente.

## Evoluções

Adicionar índices por campo, busca textual, validação opcional de schema, API
HTTP, Dockerfile e benchmark comparando busca com e sem índice.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 2: Banco de dados documental minimo`.
- `trilha-engenharia-ia.md`, `Bloco 2: Dados, busca e memoria`.
- `projetos-portfolio-ia.md`, `Mapa fundamento -> projeto`, hash table, busca e testes.

## Relações na trilha

Os fundamentos e tarefas relacionados estão declarados no frontmatter e são
validados contra o registry do StudyOps.
