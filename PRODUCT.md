# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

O usuario principal e uma pessoa estudando Engenharia de IA de forma pratica, usando o proprio repositorio como sistema de acompanhamento, curadoria e evidencias de portfolio.

## Product Purpose

StudyOps existe para transformar uma trilha de estudos em progresso operacional: fundamentos estudados, ciclos de aprendizado, tarefas praticas, projetos de portfolio, notas e evidencias. Sucesso significa que cada etapa estudada deixa algum artefato verificavel, como nota Markdown, implementacao, teste, README, comparacao, captura ou decisao tecnica.

## Positioning

StudyOps nao e apenas uma lista de tarefas nem um leitor de conteudo. O mecanismo central e conectar estudo a entrega pratica: referencia -> fundamento -> implementacao pequena -> aplicacao em projeto -> teste/evidencia -> nota -> revisao -> proximo passo.

## Operating Context

O produto parte dos documentos locais `trilha-engenharia-ia.md` e `projetos-portfolio-ia.md`. O app atual cobre o primeiro bloco da trilha, com fundamentos, sessoes de leitura, etapas, tarefas e evidencias esperadas em Markdown versionado. O mundo completo tambem deve contemplar dados, busca, memoria, modelos, IA aplicada, infraestrutura, curadoria, analisador de repositorios e Local Research Searcher.

## Capabilities and Constraints

O MVP usa Next.js App Router, TypeScript e conteudo Markdown/frontmatter em `content/`. Supabase, autenticacao, progresso persistido, RAG, embeddings, importacao de GitHub e Awesome Radar sao evolucoes futuras. O acompanhamento basico deve continuar simples e util antes de automacoes avancadas.

## Brand Commitments

O nome do produto e StudyOps. A identidade deve comunicar estudo como operacao e progresso como exploracao de um mundo: uma mistura de centro de comando operacional, mapa espacial/planetario e boardgame. As referencias locais em `refes/mapa` e `refes/cards` sao inspiracao, nao regras literais.

## Evidence on Hand

O repositorio contem conteudo real em `content/`, referencias de produto em `trilha-engenharia-ia.md` e `projetos-portfolio-ia.md`, planos/specs em `docs/superpowers/`, e imagens de referencia locais em `refes/`. Nao ha usuarios, metricas, depoimentos, progresso persistido em banco ou dados reais de uso que devam ser fabricados.

## Product Principles

- Cada incremento deve melhorar o acompanhamento real dos estudos.
- Progresso deve estar ligado a evidencia concreta.
- A trilha deve favorecer aprender construindo, nao consumir conteudo sem aplicacao.
- O app deve mostrar o proximo passo com clareza.
- O mundo visual deve servir metodo e orientacao, nao gamificacao decorativa.
- Fantasia, personagens e sessoes narradas sao camada 2: entram depois que o fluxo de estudo funciona e devem explicar fundamento, missao, evidencia ou proximo passo.

## Accessibility & Inclusion

A interface web deve preservar semantica, navegacao por teclado, contraste legivel e estados compreensiveis em desktop e mobile.
