# Fontes detalhadas e anotações Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aprofundar as leituras curadas com links externos verificáveis e permitir anotações locais por sessão e tarefa.

**Architecture:** O conteúdo continuará em Markdown e receberá links explícitos para as fontes externas. Um componente client-side de anotação usará uma camada pequena de armazenamento local versionado; as páginas server-side fornecerão somente chaves estáveis e rótulos.

**Tech Stack:** Markdown, GitHub anchors, Next.js App Router, React, TypeScript, `localStorage`, `node:test` via `tsx`.

## Global Constraints

- Preservar IDs, slugs, etapas e `expected_evidence` existentes.
- Não transformar documentos locais do projeto em links externos falsos.
- Parafrasear as fontes e evitar cópia extensa.
- Manter o escopo nos cinco fundamentos do Bloco 1.
- Não adicionar Supabase, autenticação, colaboração ou sincronização remota.
- Validar conteúdo, testes, lint e build antes de concluir.

---

### Task 1: Consolidar mapa detalhado e revisão editorial

**Files:**
- Create: `docs/curadoria/2026-07-27-bloco-1-detalhamento-source-map.md`
- Create: `docs/curadoria/2026-07-27-bloco-1-detalhamento-cto-review.md`
- Reference: `docs/curadoria/2026-07-27-bloco-1-source-map.md`
- Reference: `docs/curadoria/2026-07-27-bloco-1-cto-review.md`

**Interfaces:**
- Consumes: fontes GitHub verificadas e claims já aprovados para o Bloco 1.
- Produces: claims detalhados, URLs exatas, aplicação no StudyOps e cortes de escopo aprovados antes da edição de `content/`.

- [ ] Registrar para cada fundamento a seção externa, o claim parafraseado, a URL GitHub e a aplicação prática.
- [ ] Fazer revisão CTO inline verificando precisão, fonte adequada, ausência de cópia extensa e manutenção do escopo.
- [ ] Marcar explicitamente qualquer claim que deve ser mantido como comparação futura, sem virar requisito do MVP.

### Task 2: Adicionar links e aprofundar o conteúdo Markdown

**Files:**
- Modify: `content/fundamentos/*.md`
- Modify: `content/tasks/*/*.md`
- Test: `npm run content:validate`

**Interfaces:**
- Consumes: mapa detalhado e revisão CTO da Task 1.
- Produces: sessões mais explicativas, com links externos clicáveis nas citações em que aparecem.

- [ ] Transformar citações de `build-your-own-x`, `coding-interview-university` e `system-design-primer` em links para anchors exatos do GitHub.
- [ ] Expandir as sessões de fundamentos com modelo mental, implicações práticas, limites e conexão com o portfolio.
- [ ] Expandir as tarefas com leitura guiada da fonte, exemplo mais completo, perguntas de revisão e evidência esperada.
- [ ] Rodar `npm run content:validate` e confirmar a estrutura de 5 fundamentos, 15 etapas e 30 tarefas.

### Task 3: Criar armazenamento local de anotações com TDD

**Files:**
- Create: `src/lib/notes.ts`
- Create: `tests/notes.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: chaves estáveis de fundamento, tarefa e sessão.
- Produces: `NoteRecord`, `makeNoteKey()`, `parseStoredNotes()`, `readNote()` e `writeNote()`.

- [ ] Escrever testes que falham para criar chaves distintas de sessão e tarefa, serializar o payload versionado e ignorar JSON inválido.
- [ ] Implementar funções puras sem acesso direto ao DOM, com formato `{ version: 1, notes: Record<string, { text: string; updatedAt: string }> }`.
- [ ] Executar `npm test` e confirmar isolamento, restauração e descarte seguro de dados inválidos.

### Task 4: Criar bloco de anotação reutilizável

**Files:**
- Create: `src/components/StudyNote.tsx`
- Modify: `src/app/content.module.css`
- Test: `tests/notes.test.ts`

**Interfaces:**
- Consumes: `noteKey`, `label` e funções de `src/lib/notes.ts`.
- Produces: editor client-side com textarea, salvar, limpar com confirmação, indicador de estado e restauração via `localStorage`.

- [ ] Renderizar o estado inicial sem acessar `localStorage` durante o SSR.
- [ ] Carregar a nota no `useEffect`, controlar texto/estado e salvar somente após ação explícita.
- [ ] Exibir acessibilidade básica: label associado, status textual e botão de limpeza identificável.
- [ ] Não expor o conteúdo da anotação como HTML; tratá-lo como texto livre.

### Task 5: Integrar anotações nas páginas

**Files:**
- Modify: `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`
- Modify: `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`
- Modify: `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`

**Interfaces:**
- Consumes: `StudyNote` e chaves definidas na Task 3.
- Produces: anotação de sessão nas páginas de leitura e anotação de tarefa na página da tarefa.

- [ ] Inserir uma anotação de sessão abaixo do conteúdo e antes da navegação anterior/próxima.
- [ ] Inserir uma anotação de tarefa na visão geral da tarefa.
- [ ] Garantir chaves diferentes entre fundamento, tarefa e sessões.
- [ ] Manter todas as páginas como server components, isolando somente o editor como client component.

### Task 6: Verificar conteúdo, links e fluxo de anotação

**Files:**
- Inspect: `content/`
- Inspect: `src/lib/notes.ts`
- Inspect: `src/components/StudyNote.tsx`
- Test: `npm test`

**Interfaces:**
- Consumes: todas as tasks anteriores.
- Produces: integração validada localmente sem alterar os documentos protegidos.

- [ ] Executar `npm test`.
- [ ] Executar `npm run content:validate`.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Abrir uma sessão, salvar uma nota, recarregar, confirmar restauração, testar limpeza e confirmar que outra sessão não recebe a nota.
- [ ] Executar `git diff --check` e `git status --short` antes de qualquer commit.
