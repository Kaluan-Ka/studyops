# Scaffold StudyOps Design

Data: 2026-07-21

## Objetivo

Criar a primeira base versionada do StudyOps como app Next.js com TypeScript,
conteudo curado em Markdown/frontmatter e script minimo de conteudo com
comandos `validate` e `create`.

## Decisoes aplicadas

- Usar Next.js com App Router e TypeScript.
- Manter o MVP centrado em fundamentos tecnicos.
- Versionar conteudo curado no repositorio, separado do progresso futuro no
  Supabase.
- Usar IDs opacos e estaveis por entidade: `FUN-000001`, `STEP-000001`,
  `TASK-000001`, `PROJ-000001` e `EVID-000001`.
- Controlar IDs emitidos em `content/.registry/ids.json`.
- Validar conteudo por scan dos arquivos reais em `content/`.
- Usar Markdown + JSON companion em `content/summaries/` para resumos
  tecnicos assistidos, sem skill ou plugin formal no MVP.

## Arquitetura

O scaffold cria a aplicacao web, mas a camada principal deste incremento e a
base de conteudo. A app renderiza uma primeira tela simples de fundamentos e
usa arquivos locais como fonte futura de dados. O script em TypeScript roda no
Node, compartilha a toolchain do app e fica em `scripts/content.ts`.

Supabase nao entra neste incremento. A estrutura evita bloquear o desenho
futuro: conteudo tem IDs canonicos textuais, enquanto progresso, resolucoes,
evidencias e autorizacoes poderao guardar referencias por `content_id`.

## Estrutura de conteudo

```txt
content/
  .registry/
    ids.json
  fundamentos/
  tasks/
  summaries/
```

`fundamentos` guarda arquivos de fundamento. Cada fundamento tem `id`, `title`,
`slug`, `status`, `order`, `summary` e etapas com IDs permanentes.

`tasks` guarda tarefas em subpastas por slug de fundamento. Cada tarefa tem
`id`, `fundamento_id`, `etapa_id`, `title`, `slug`, `status`, `order`,
`expected_evidence` e corpo Markdown.

`summaries` guarda pares Markdown + JSON companion para resumos tecnicos. O
script valida o companion quando existir, mas nao cria automacao de ingestao no
MVP.

## Script de conteudo

`npm run content:validate` valida:

- registry existente e bem formado;
- IDs unicos no registry;
- IDs duplicados no conteudo real;
- frontmatter obrigatorio em fundamentos e tarefas;
- tarefas apontando para fundamento e etapa existentes;
- IDs usados no conteudo presentes no registry.

`npm run content:create -- fundamento "Hash Table"` cria um fundamento com ID
novo.

`npm run content:create -- task FUN-000001 STEP-000001 "Implementar hashmap"`
cria uma tarefa vinculada a fundamento e etapa existentes.

## Interface inicial

A tela inicial fica em `/` e mostra o StudyOps como mapa de fundamentos em
formato simples, sem Supabase. O objetivo e verificar que o app roda e comunica
o recorte do MVP: fundamentos, tarefas, projetos e evidencias.

## Testes e verificacao

O incremento deve ser verificado com:

- `npm run content:validate`;
- `npm run lint`;
- `npm run build`.

O comando de build deve executar a validacao de conteudo em `prebuild`.
