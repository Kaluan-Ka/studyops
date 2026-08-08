# Notas, projetos e progresso consolidado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Persistir notas por usuário, tornar os cinco projetos de portfólio navegáveis, completar o gerenciamento de ciclos e criar uma visão consolidada de progresso.

**Architecture:** O catálogo de fundamentos, tarefas e projetos continuará em Markdown/frontmatter. O Supabase armazenará somente dados privados do usuário: notas, estado pessoal dos projetos, ciclos e vínculos de ciclo. O progresso será montado por um read model puro que combina o catálogo estático com as linhas protegidas por RLS.

**Tech Stack:** Next.js App Router 16, React 19, TypeScript, Markdown/frontmatter, Supabase SSR/browser client, PostgreSQL migrations/RLS, Node test runner.

## Global Constraints

- Usar `auth.users.id` UUID como `user_id`; nunca usar e-mail para autorização.
- Não criar tabela duplicada de fundamentos, etapas ou tarefas.
- Não exigir evidência para marcar missão como concluída neste incremento.
- Não implementar os blocos futuros, RAG, embeddings, GitHub import ou Awesome Radar.
- Não usar `service_role`, `SECURITY DEFINER` ou `user_metadata` para autorização.
- Conteúdo público continua legível sem login; mutações exigem usuário autenticado.
- Todas as tabelas privadas novas terão RLS, policies por `auth.uid()` e grants mínimos.
- Usar TDD para helpers e read models antes do código de produção.
- IDs persistidos de projeto são `PROJ-*`; slugs servem apenas para rota e apresentação.
- Componentes client-side não consultam Supabase diretamente; usar repositories/adapters em `src/lib/supabase/`.
- Testes locais de RLS com usuários A, B e `anon` são gate obrigatório, não etapa opcional.
- Repositories em `src/lib/supabase/repositories/` recebem `SupabaseClient` por argumento, não importam `fs`/Markdown/React e não renderizam UI; páginas server-side carregam Markdown e passam snapshots serializáveis.
- Ordenação do read model é fixa: ciclos `starts_on DESC, created_at DESC, id ASC`; tarefas `position ASC, content_id ASC`; projetos `order ASC, id ASC`; evidências `produced_at DESC, id ASC`.

---

### Task 1: Persistência de notas por usuário

**Files:**
- Create via `supabase migration new add_study_notes`; modify the CLI-generated file whose name ends with `_add_study_notes.sql`.
- Create: `src/lib/studyNotes.ts`
- Create: `src/lib/supabase/repositories/studyNotes.ts`
- Modify: `src/components/StudyNote.tsx`
- Modify: `src/lib/notes.ts`
- Test: `tests/studyNotes.test.ts`

**Interfaces:**
- `buildStudyNoteTarget(target): { target_type: "task" | "fundament" | "session"; target_key: string }`
- `buildStudyNoteUpsert(input): { user_id: string; target_type: string; target_key: string; body: string }`
- `getLegacyNoteKey(...)` e `removeLegacyNote(...)` para importação explícita do formato atual.

- [ ] **Step 1: Escrever testes falhando** para isolamento por usuário, targets de tarefa/fundamento/sessão, normalização de texto e payload de upsert.
- [ ] **Step 2: Rodar `npm test -- tests/studyNotes.test.ts`** e confirmar falha por módulo ausente.
- [ ] **Step 3: Criar a migration** com `study_notes`, FK para `auth.users`, checks para targets válidos e corpo não vazio, unicidade `(user_id, target_type, target_key)`, timestamps, trigger privado de `updated_at`, RLS, grants de select/insert/update/delete e policies próprias.
- [ ] **Step 4: Implementar helpers puros** em `src/lib/studyNotes.ts` e preservar em `src/lib/notes.ts` apenas os helpers necessários para ler o legado local.
- [ ] **Step 5: Implementar repository** para carregar, upsertar e remover notas usando `user.id`; depois alterar `StudyNote` para consumir somente esse repository. O editor deve depender de `authView.canMutate` e nunca consultar localStorage de outro usuário.
- [ ] **Step 6: Adicionar importação explícita**: quando houver nota legada e não houver nota remota, mostrar “Importar registro local”; após sucesso, remover somente a entrada importada do legado.
- [ ] **Step 7: Rodar os testes do domínio e `npm run lint`**.
- [ ] **Step 8: Commitar** com `feat: persistir notas por usuario`.

### Task 2: Catálogo Markdown dos cinco projetos

**Files:**
- Create: `content/projetos/mini-redis-aplicado-a-ia.md`
- Create: `content/projetos/banco-de-dados-documental-minimo.md`
- Create: `content/projetos/sistema-de-ingestao-de-documentos.md`
- Create: `content/projetos/observabilidade-para-estudos.md`
- Create: `content/projetos/github-repo-analyzer.md`
- Modify: `content/.registry/ids.json`
- Modify: `scripts/content.ts`
- Modify: `src/lib/content.ts`
- Create: `tests/projects.test.ts`

**Interfaces:**
- `PortfolioProject { id, title, slug, status, order, summary, intro, sections, fundamentIds, taskIds }`
- `getProjects(): PortfolioProject[]`
- `getProjectBySlug(slug): PortfolioProject | undefined`

- [ ] **Step 1: Escrever testes falhando** para carregar cinco projetos em ordem, rejeitar IDs/targets órfãos e encontrar projeto por slug.
- [ ] **Step 2: Rodar `npm test -- tests/projects.test.ts`** e confirmar falha.
- [ ] **Step 3: Escrever os cinco arquivos** com IDs `PROJ-000001` a `PROJ-000005`, conteúdo baseado em `projetos-portfolio-ia.md`, referências precisas e listas de `fundament_ids`/`task_ids`.
- [ ] **Step 4: Estender o registry e `scripts/content.ts`** para validar projetos, IDs `PROJ-*`, slugs únicos, fundamentos/tarefas existentes e arrays de relações.
- [ ] **Step 5: Estender `src/lib/content.ts`** com o tipo e loaders de projetos sem alterar a fonte Markdown atual dos fundamentos/tarefas.
- [ ] **Step 6: Rodar `npm run content:validate`, `npm test -- tests/projects.test.ts` e `git diff --check`**.
- [ ] **Step 7: Commitar** com `feat: adicionar catalogo de projetos de portfolio`.

### Task 3: Estado pessoal e superfície de projetos

**Files:**
- Create via `supabase migration new add_project_progress`; modify the CLI-generated file whose name ends with `_add_project_progress.sql`.
- Create: `src/lib/projectProgress.ts`
- Create: `src/lib/supabase/repositories/projectProgress.ts`
- Create: `src/components/ProjectProgressPanel.tsx`
- Create: `src/app/projetos/page.tsx`
- Create: `src/app/projetos/page.module.css`
- Create: `src/app/projetos/[slug]/page.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/projectProgress.test.ts`

**Interfaces:**
- `PortfolioProjectStatus = "planned" | "in_progress" | "paused" | "completed"`
- `buildProjectProgressUpsert(input): ProjectProgressUpsert` usando `projectId: PROJ-*`
- `buildProjectCatalogView(projects, progressRows): ProjectCatalogView[]`

- [ ] **Step 1: Escrever testes falhando** para status, normalização de objetivo/notas/próximo passo, isolamento por usuário e projeto sem progresso.
- [ ] **Step 2: Criar migration** para `portfolio_project_progress` com `project_id` `PROJ-*`, checks de status, objetivo, notas e próximo passo, unicidade `(user_id, project_id)`, RLS e grants mínimos; não conceder DELETE sem ação explícita de reset.
- [ ] **Step 3: Implementar helpers puros** e rodar os testes em vermelho/verde.
- [ ] **Step 4: Criar `/projetos`** com os cinco cartões públicos e estado persistido quando autenticado, consumindo o repository fora do componente visual.
- [ ] **Step 5: Criar `/projetos/[slug]`** com resumo, MVP, evoluções, fundamentos/tarefas relacionadas e painel de status pessoal.
- [ ] **Step 6: Adicionar links de Projetos à navegação** da home, ciclos, fundamentos e tarefas onde o contexto permitir.
- [ ] **Step 7: Rodar testes, lint, validação de conteúdo e build**.
- [ ] **Step 8: Commitar** com `feat: criar catalogo e progresso de projetos`.

### Task 4: Gerenciamento completo de ciclos

**Files:**
- Create via `supabase migration new manage_study_cycle_tasks`; modify the CLI-generated file whose name ends with `_manage_study_cycle_tasks.sql`.
- Modify: `src/lib/studyCycles.ts`
- Create: `src/lib/supabase/repositories/studyCycles.ts`
- Modify: `src/components/StudyCyclesWorkspace.tsx`
- Modify: `src/app/ciclos/page.tsx`
- Modify: `src/app/ciclos/page.module.css`
- Test: `tests/studyCycles.test.ts`

**Interfaces:**
- `buildStudyCycleProjectInsert(input)` usando `projectId: PROJ-*`
- `buildStudyCycleTaskReorder(input)`
- `buildStudyCycleTaskRemoval(input)`

- [ ] **Step 1: Escrever testes falhando** para remoção, posição seguinte, projeto associado e estados inválidos.
- [ ] **Step 2: Criar migration** para `study_cycle_projects` com `user_id`, `cycle_id`, `project_id: PROJ-*`, unicidade, FK composta para ciclo, cascade, RLS e policies próprias.
- [ ] **Step 3: Adicionar grants/policies DELETE** a `study_cycles`, `study_cycle_tasks` e aos novos vínculos, sempre limitados ao próprio usuário.
- [ ] **Step 4: Substituir a constraint de posição** por `UNIQUE (cycle_id, position) DEFERRABLE INITIALLY DEFERRED` e criar funções SQL `SECURITY INVOKER` para append, remoção com compactação e reordenação transacionais, com `auth.uid()`, ownership explícito, `set search_path = ''` e objetos qualificados; revogar execute de `PUBLIC`/`anon` e conceder somente a `authenticated`.
- [ ] **Step 5: Implementar repository, helpers e chamadas `rpc`** no domínio de ciclos, mantendo `mission_progress` como fonte única do status real.
- [ ] **Step 6: Atualizar a UI** com remover tarefa, mover para cima/baixo, associar/remover projeto e excluir ciclo com confirmação acessível.
- [ ] **Step 7: Recarregar os dados após cada mutação** e preservar feedback de erro seguro para conflito de ciclo ativo, RLS e posição.
- [ ] **Step 8: Rodar os testes de ciclos e lint**.
- [ ] **Step 9: Commitar** com `feat: completar gerenciamento de ciclos`.

### Task 5: Read model e página de progresso

**Files:**
- Create: `src/lib/progressDashboard.ts`
- Create: `src/lib/supabase/repositories/progressDashboard.ts`
- Create: `src/components/ProgressDashboard.tsx`
- Create: `src/app/progresso/page.tsx`
- Create: `src/app/progresso/page.module.css`
- Create: `src/components/HomeOperationalSummary.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/progressDashboard.test.ts`

**Interfaces:**
- `buildProgressDashboard(input): ProgressDashboardView`
- `ProgressDashboardView` com ciclo ativo, contadores, tarefas por fundamento/projeto, evidências recentes, notas e próximos passos; separar fase manual do projeto e progresso derivado das tarefas.

- [ ] **Step 1: Escrever testes falhando** para dados vazios, ciclo ativo, tarefas sem progresso, contagem de evidências, progresso por fundamento e progresso por projeto.
- [ ] **Step 2: Implementar o read model puro** sem consultar Supabase, usando o catálogo como denominador, tratando ausência como `not_started`, ignorando IDs privados órfãos e aplicando a precedência determinística do próximo passo.
- [ ] **Step 3: Implementar repository paginado** para consultar ciclos, tarefas de ciclo, mission_progress, mission_evidence, study_notes e project progress do usuário autenticado sem depender do teto de 1.000 linhas.
- [ ] **Step 4: Criar o componente client-side** para consumir o repository e o read model, sem acesso direto ao Supabase.
- [ ] **Step 5: Criar `/progresso`** com estados de Supabase ausente, visitante, carregando, vazio, erro e pronto.
- [ ] **Step 6: Criar resumo compacto na home** com os projetos associados ao ciclo ativo e link para `/progresso`, preservando o mapa orbital existente.
- [ ] **Step 7: Adicionar navegação e estados responsivos/acessíveis**.
- [ ] **Step 8: Rodar testes do read model, lint e build**.
- [ ] **Step 9: Commitar** com `feat: adicionar painel consolidado de progresso`.

### Task 6: Gate de dados, RLS e RPCs

**Files:**
- Create: `tests/supabaseRls.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Adicionar `npm run test:supabase`** para executar `tests/supabaseRls.test.ts` contra o Supabase local, criando usuários A/B e anônimo e cobrindo select/insert/update/delete, associações cruzadas, RPCs e rollback transacional.
- [ ] **Step 2: Verificar migrations localmente** com `npm run supabase:local:db:reset` e `npm run supabase:local:migrations`; não usar projeto remoto. Se o ambiente local não puder subir sem ação destrutiva, registrar bloqueio e não declarar RLS verificado.
- [ ] **Step 3: Rodar `npm run test:supabase`** e confirmar zero falhas. Falha de RLS, grants, RPC ou rollback bloqueia a Task 5.
- [ ] **Step 4: Registrar** no relatório do worker qualquer limitação do ambiente local sem alterar volumes destrutivamente.

### Task 7: Integração, documentação e verificação final

**Files:**
- Modify: `README.md`
- Modify: `src/app/ciclos/page.tsx`
- Modify: testes existentes quando os contratos mudarem

- [ ] **Step 1: Documentar** as novas tabelas, migration local, notas por UUID, catálogo de projetos, rotas `/projetos` e `/progresso` e limitações da importação legada.
- [ ] **Step 2: Adicionar links finais** de Projetos e Progresso à navegação de ciclos e às superfícies que não foram alteradas pelas Tasks 1–5.
- [ ] **Step 3: Rodar `npm test` completo** e confirmar zero falhas.
- [ ] **Step 4: Rodar `npm run test:supabase`** e confirmar zero falhas ou declarar a limitação explicitamente.
- [ ] **Step 5: Rodar `npm run lint`** e confirmar saída sem erros.
- [ ] **Step 6: Rodar `npm run content:validate`** e confirmar `Conteudo valido.`.
- [ ] **Step 7: Rodar `npm run build`** e confirmar compilação e geração das rotas estáticas.
- [ ] **Step 8: Rodar `git diff --check`** e revisar que não há secrets, service role, policies públicas ou mudanças fora do escopo.

## Dependências e waves de execução

- **Wave 1 — conteúdo e notas em paralelo:** Task 2 congela os IDs `PROJ-*` e as relações Markdown; Task 1 cria notas e seu repository. Esses workers não compartilham arquivos.
- **Wave 2 — estado de projetos:** Task 3 começa depois da Task 2 e usa `project_id`. Sua migration deve terminar antes de iniciar a migration da Task 4.
- **Wave 3 — ciclos:** Task 4 começa depois da Task 3, usa os IDs `PROJ-*` já congelados e é o único worker desta wave a alterar `src/app/ciclos/page.tsx`.
- **Wave 4 — validação de dados:** Task 6 executa migrations locais, advisors quando disponíveis e os testes A/B/anon depois das Tasks 1, 3 e 4. Falha de RLS ou RPC bloqueia a continuação.
- **Wave 5 — read model e UI consolidada:** Task 5 começa depois das Tasks 1, 2, 3, 4 e 6; seus repositories e o read model usam os contratos já congelados.
- **Wave 6 — integração final:** Task 7 começa depois da Task 5 e do gate de dados da Task 6.

## Verificação do plano

- A especificação foi coberta por sete tarefas em waves dependentes: notas,
  conteúdo, estado de projetos, ciclos, gate de dados, progresso e integração.
- O plano não cria tabelas duplicadas para fundamentos, etapas ou tarefas.
- O item explicitamente adiado — exigir evidência para conclusão — não aparece
  como implementação.
- Todas as operações Supabase novas exigem RLS e `auth.uid()`.
- Os pontos de risco de isolamento de notas e colisão de posições têm testes e
  operações atômicas previstas.
