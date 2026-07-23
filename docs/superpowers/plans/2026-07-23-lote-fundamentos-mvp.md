# Lote de Fundamentos MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um lote curado de 5 fundamentos, com 3 etapas por fundamento e 2 tarefas por etapa, validado pelo script de conteudo.

**Architecture:** O conteudo continua como Markdown/frontmatter em `content/`, com IDs opacos controlados por `content/.registry/ids.json`. A UI nao sera alterada neste incremento; a app ainda nao le `content/` diretamente.

**Tech Stack:** Next.js App Router, TypeScript, Markdown/frontmatter, `gray-matter`, script `tsx scripts/content.ts validate`.

## Global Constraints

- Usar sempre o workdir completo: `/home/kaluankaete/Documentos/Faculdade Pessoal/studyops`.
- Nao commitar `AGENTS.md`, `trilha-engenharia-ia.md`, `projetos-portfolio-ia.md`, `docs/decisoes-mvp-studyops.md` ou `docs/decisions/`.
- Nao reescrever documentos de referencia sem pedido explicito.
- Manter o MVP pequeno e centrado em fundamentos.
- Nao implementar Supabase neste incremento.
- Nao usar `npm audit fix --force`.
- Se `npm run content:validate` falhar por IPC do `tsx` em `/tmp`, pedir aprovacao para rodar fora do sandbox.
- IDs finais: fundamentos `FUN-000001` a `FUN-000005`, etapas `STEP-000001` a `STEP-000015`, tarefas `TASK-000001` a `TASK-000030`.
- Cada fundamento deve ter exatamente 3 etapas.
- Cada etapa deve ter exatamente 2 tarefas.

---

## File Structure

- Modify: `content/.registry/ids.json`
  - Responsavel por listar todos os IDs opacos emitidos.
- Modify: `content/fundamentos/hash-table.md`
  - Enriquecer o fundamento existente e completar 3 etapas.
- Create: `content/fundamentos/cache.md`
  - Novo fundamento Cache.
- Create: `content/fundamentos/queue.md`
  - Novo fundamento Queue.
- Create: `content/fundamentos/busca-textual.md`
  - Novo fundamento Busca textual.
- Create: `content/fundamentos/docker-compose.md`
  - Novo fundamento Docker Compose.
- Modify: `content/tasks/hash-table/implementar-hashmap.md`
  - Preservar `TASK-000001` e alinhar o corpo ao lote.
- Create: `content/tasks/hash-table/*.md`
  - Criar 5 tarefas novas de Hash Table.
- Create: `content/tasks/cache/*.md`
  - Criar 6 tarefas de Cache.
- Create: `content/tasks/queue/*.md`
  - Criar 6 tarefas de Queue.
- Create: `content/tasks/busca-textual/*.md`
  - Criar 6 tarefas de Busca textual.
- Create: `content/tasks/docker-compose/*.md`
  - Criar 6 tarefas de Docker Compose.

---

### Task 1: Completar Hash Table

**Files:**
- Modify: `content/fundamentos/hash-table.md`
- Modify: `content/tasks/hash-table/implementar-hashmap.md`
- Create: `content/tasks/hash-table/explicar-hash-e-colisoes.md`
- Create: `content/tasks/hash-table/comparar-busca-linear-e-indexada.md`
- Create: `content/tasks/hash-table/testar-colisoes-controladas.md`
- Create: `content/tasks/hash-table/indexar-registros-por-id.md`
- Create: `content/tasks/hash-table/desenhar-indice-para-dados-de-estudo.md`
- Modify: `content/.registry/ids.json`

**Interfaces:**
- Consumes: `FUN-000001`, `STEP-000001`, `STEP-000002`, `TASK-000001`.
- Produces: `STEP-000003`, `TASK-000002` a `TASK-000006`.

- [ ] **Step 1: Definir a grade de IDs de Hash Table**

Use esta grade:

```txt
FUN-000001 Hash Table
STEP-000001 Entender o conceito
  TASK-000002 Explicar hash e colisoes
  TASK-000003 Comparar busca linear e indexada
STEP-000002 Implementar o mecanismo minimo
  TASK-000001 Implementar hashmap minimo
  TASK-000004 Testar colisoes controladas
STEP-000003 Aplicar em contexto de IA
  TASK-000005 Indexar registros por id
  TASK-000006 Desenhar indice para dados de estudo
```

- [ ] **Step 2: Atualizar `content/fundamentos/hash-table.md`**

Substitua o arquivo por frontmatter com 3 etapas e corpo com secoes `O que e`,
`Onde aparece no projeto`, `Metodo de estudo` e `Proxima aplicacao`.

- [ ] **Step 3: Atualizar e criar tarefas de Hash Table**

Cada tarefa deve ter frontmatter com `id`, `fundamento_id`, `etapa_id`, `title`,
`slug`, `status: a_fazer`, `order` e `expected_evidence`. O corpo deve conter
um paragrafo curto e `## Resultado esperado` com bullets verificaveis.

- [ ] **Step 4: Atualizar o registry para incluir `STEP-000003` e `TASK-000002` a `TASK-000006`**

Mantenha `FUN-000001`, `STEP-000001`, `STEP-000002` e `TASK-000001`.

- [ ] **Step 5: Validar parcialmente**

Run: `npm run content:validate`

Expected: `Conteudo valido.`

---

### Task 2: Criar Cache e Queue

**Files:**
- Create: `content/fundamentos/cache.md`
- Create: `content/fundamentos/queue.md`
- Create: `content/tasks/cache/*.md`
- Create: `content/tasks/queue/*.md`
- Modify: `content/.registry/ids.json`

**Interfaces:**
- Consumes: registry atualizado pela Task 1.
- Produces: `FUN-000002`, `FUN-000003`, `STEP-000004` a `STEP-000009`, `TASK-000007` a `TASK-000018`.

- [ ] **Step 1: Definir a grade de IDs de Cache**

Use esta grade:

```txt
FUN-000002 Cache
STEP-000004 Entender o conceito
  TASK-000007 Mapear hit miss e TTL
  TASK-000008 Identificar invalidacao em fluxo real
STEP-000005 Implementar o mecanismo minimo
  TASK-000009 Implementar cache em memoria com TTL
  TASK-000010 Medir impacto de memoizacao
STEP-000006 Aplicar em contexto de IA
  TASK-000011 Cachear resposta de chamada cara
  TASK-000012 Definir politica de cache para busca
```

- [ ] **Step 2: Definir a grade de IDs de Queue**

Use esta grade:

```txt
FUN-000003 Queue
STEP-000007 Entender o conceito
  TASK-000013 Descrever produtor consumidor e backlog
  TASK-000014 Modelar retry e falha permanente
STEP-000008 Implementar o mecanismo minimo
  TASK-000015 Implementar fila em memoria
  TASK-000016 Criar worker com retry simples
STEP-000009 Aplicar em contexto de IA
  TASK-000017 Enfileirar processamento de documentos
  TASK-000018 Registrar evidencias de execucao assincrona
```

- [ ] **Step 3: Criar fundamentos `cache.md` e `queue.md`**

Cada fundamento deve ter `status: a_estudar`, `order` sequencial, `summary`
curto, 3 etapas e corpo com secoes `O que e`, `Onde aparece no projeto`,
`Metodo de estudo` e `Proxima aplicacao`.

- [ ] **Step 4: Criar 12 tarefas**

Crie 6 tarefas em `content/tasks/cache/` e 6 tarefas em `content/tasks/queue/`.
Use slugs ASCII, sem acentos.

- [ ] **Step 5: Atualizar o registry**

Inclua `FUN-000002`, `FUN-000003`, `STEP-000004` a `STEP-000009` e
`TASK-000007` a `TASK-000018`.

- [ ] **Step 6: Validar parcialmente**

Run: `npm run content:validate`

Expected: `Conteudo valido.`

---

### Task 3: Criar Busca textual e Docker Compose

**Files:**
- Create: `content/fundamentos/busca-textual.md`
- Create: `content/fundamentos/docker-compose.md`
- Create: `content/tasks/busca-textual/*.md`
- Create: `content/tasks/docker-compose/*.md`
- Modify: `content/.registry/ids.json`

**Interfaces:**
- Consumes: registry atualizado pela Task 2.
- Produces: `FUN-000004`, `FUN-000005`, `STEP-000010` a `STEP-000015`, `TASK-000019` a `TASK-000030`.

- [ ] **Step 1: Definir a grade de IDs de Busca textual**

Use esta grade:

```txt
FUN-000004 Busca textual
STEP-000010 Entender o conceito
  TASK-000019 Explicar tokenizacao normalizacao e termos
  TASK-000020 Comparar contains indice e ranking
STEP-000011 Implementar o mecanismo minimo
  TASK-000021 Construir indice invertido pequeno
  TASK-000022 Implementar ranking por frequencia simples
STEP-000012 Aplicar em contexto de IA
  TASK-000023 Avaliar busca em notas tecnicas
  TASK-000024 Preparar base para RAG local minimo
```

- [ ] **Step 2: Definir a grade de IDs de Docker Compose**

Use esta grade:

```txt
FUN-000005 Docker Compose
STEP-000013 Entender o conceito
  TASK-000025 Mapear servicos redes volumes e env
  TASK-000026 Explicar ciclo up logs exec down
STEP-000014 Implementar o mecanismo minimo
  TASK-000027 Criar compose com app e banco
  TASK-000028 Adicionar healthcheck e volume persistente
STEP-000015 Aplicar em contexto de IA
  TASK-000029 Subir stack local para experimento de busca
  TASK-000030 Documentar reproducao do ambiente
```

- [ ] **Step 3: Criar fundamentos `busca-textual.md` e `docker-compose.md`**

Cada fundamento deve ter `status: a_estudar`, `order` sequencial, `summary`
curto, 3 etapas e corpo com secoes `O que e`, `Onde aparece no projeto`,
`Metodo de estudo` e `Proxima aplicacao`.

- [ ] **Step 4: Criar 12 tarefas**

Crie 6 tarefas em `content/tasks/busca-textual/` e 6 tarefas em
`content/tasks/docker-compose/`. Use slugs ASCII, sem acentos.

- [ ] **Step 5: Atualizar o registry**

Inclua `FUN-000004`, `FUN-000005`, `STEP-000010` a `STEP-000015` e
`TASK-000019` a `TASK-000030`.

- [ ] **Step 6: Validar parcialmente**

Run: `npm run content:validate`

Expected: `Conteudo valido.`

---

### Task 4: Revisao final e commit

**Files:**
- Inspect: `content/.registry/ids.json`
- Inspect: `content/fundamentos/*.md`
- Inspect: `content/tasks/**/*.md`

**Interfaces:**
- Consumes: todos os arquivos criados pelas Tasks 1 a 3.
- Produces: lote validado e pronto para futura leitura pela UI.

- [ ] **Step 1: Conferir contagens**

Run: `find content/fundamentos -name '*.md' | wc -l`

Expected: `5`

Run: `find content/tasks -name '*.md' | wc -l`

Expected: `30`

- [ ] **Step 2: Conferir que nao houve edicao na UI**

Run: `git diff --name-only | rg '^src/app/page.tsx$|^src/app/page.module.css$|^src/app/layout.tsx$'`

Expected: exit code `1` sem output.

- [ ] **Step 3: Rodar validacao final**

Run: `npm run content:validate`

Expected: `Conteudo valido.`

- [ ] **Step 4: Revisar diff**

Run: `git diff --stat`

Expected: alteracoes apenas em `content/` e neste plano, sem arquivos locais
ignorados.

- [ ] **Step 5: Commit**

```bash
git add content docs/superpowers/plans/2026-07-23-lote-fundamentos-mvp.md
git commit -m "feat: add curated fundamentals batch"
```
