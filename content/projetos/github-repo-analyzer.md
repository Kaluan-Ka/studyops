---
id: PROJ-000005
title: GitHub Repo Analyzer
slug: github-repo-analyzer
status: planejado
order: 5
summary: Ferramenta para coletar README e metadados de repositórios, resumir utilidade e gerar ideias derivadas.
fundament_ids:
  - FUN-000006
  - FUN-000007
  - FUN-000009
  - FUN-000010
task_ids:
  - TASK-000035
  - TASK-000039
  - TASK-000041
  - TASK-000042
  - TASK-000053
  - TASK-000060
---

# GitHub Repo Analyzer

## Objetivo

Transformar links de repositórios em fichas de pesquisa com README, metadados,
resumo, tags, critérios de utilidade e ideias de projetos derivados.

## MVP

Cadastrar URL, salvar nome, descrição, linguagem principal e README; registrar
resumo manual ou gerado, tags, status e busca por tag ou palavra-chave.

## Evoluções

Coletar estrelas, forks, licença e atividade; usar score de utilidade; adicionar
cache, rate limit, fila de análise, comparação e integração com o Local Research
Searcher. O Awesome Radar fica para uma etapa posterior.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 5: GitHub Repo Analyzer`.
- `trilha-engenharia-ia.md`, `Bloco 3: Modelos e IA aplicada`.
- `projetos-portfolio-ia.md`, `Extensao inspirada no sindresorhus/awesome`.

## Relações na trilha

Os fundamentos e tarefas relacionados estão declarados no frontmatter e são
validados contra o registry do StudyOps.
