# Ciclos de estudo — Design

## Objetivo

Adicionar a primeira fatia vertical de planejamento semanal do StudyOps: uma pessoa autenticada consegue criar um ciclo, associar tarefas da trilha, acompanhar o estado global dessas missões e registrar a revisão e o próximo passo.

O ciclo representa planejamento e reflexão. A execução real continua nas entidades já existentes `mission_progress` e `mission_evidence`.

## Escopo

Incluído:

- migration Supabase para `study_cycles`;
- migration Supabase para `study_cycle_tasks`;
- ownership por `auth.uid()`, RLS, grants e índices;
- formulário autenticado para criar e editar um ciclo;
- associação de tarefas editoriais existentes por `content_id`;
- listagem de ciclos próprios, com tarefas e status derivado de `mission_progress`;
- alteração do status global da missão a partir da tela do ciclo, reutilizando as regras existentes;
- campos de objetivo, revisão e próximo passo;
- link de navegação para `/ciclos` na interface existente;
- testes unitários para validação e montagem dos payloads do domínio.

Fora do escopo:

- tarefas livres sem `content_id` do catálogo Markdown;
- duplicação de status em `study_cycle_tasks`;
- vínculo `cycle_id` em `mission_progress`;
- exclusão física de ciclos ou tarefas;
- histórico separado de revisões;
- projetos, tópicos, automações, RPCs ou views novas.

## Modelo de dados

### `public.study_cycles`

- `id uuid primary key default gen_random_uuid()`;
- `user_id uuid not null references auth.users(id) on delete cascade`;
- `starts_on date not null`;
- `ends_on date not null`;
- `objective text not null` com validação de texto não vazio;
- `status text not null default 'planned'`, limitado a `planned`, `active`, `completed` e `cancelled`;
- `review text` opcional;
- `next_step text` opcional;
- `reviewed_at timestamptz` opcional;
- `completed_at timestamptz` opcional;
- `created_at` e `updated_at` com `now()`;
- `unique (id, user_id)` para a FK composta dos filhos.

Restrições:

- `ends_on >= starts_on`;
- no máximo um ciclo `active` por usuário via índice único parcial;
- o período não precisa começar em uma segunda-feira;
- não há grant ou policy de delete no MVP.

### `public.study_cycle_tasks`

- `id uuid primary key default gen_random_uuid()`;
- `user_id uuid not null references auth.users(id) on delete cascade`;
- `cycle_id uuid not null`;
- `content_id text not null` validado como `TASK-[0-9]{6}`;
- `position smallint not null` maior que zero;
- `planned_note text` opcional;
- `created_at` e `updated_at` com `now()`;
- FK composta `(cycle_id, user_id)` para `(study_cycles.id, user_id)`;
- unicidade de `(cycle_id, content_id)` e `(cycle_id, position)`.

O `content_id` é validado no cliente contra o catálogo versionado e pelo formato no banco. Não há FK para Markdown porque o catálogo não é persistido no Supabase.

### Segurança e acesso

As duas tabelas serão expostas no schema `public`, com RLS habilitado, acesso revogado de `anon` e grants somente de `select`, `insert` e `update` para `authenticated`. Todas as policies usam `(select auth.uid()) = user_id` em `using` e `with check`; a FK composta impede associar tarefa a ciclo de outra pessoa.

Índices:

- `study_cycles (user_id, starts_on desc)`;
- `study_cycles (user_id, status, starts_on desc)`;
- índice único parcial `(user_id) where status = 'active'`;
- `study_cycle_tasks (user_id, cycle_id, position)`;
- `study_cycle_tasks (user_id, content_id)`.

## Fluxo da aplicação

1. A rota `/ciclos` renderiza o catálogo editorial disponível e monta a superfície client-side autenticada.
2. Visitantes veem uma chamada para entrar com Google; nenhuma consulta privada é feita antes de existir sessão autenticada.
3. Usuários autenticados carregam seus ciclos ordenados por `starts_on desc` e as tarefas associadas.
4. A tela carrega `mission_progress` para os `content_id` exibidos e traduz a ausência de linha para “Não iniciada”.
5. Criar ou editar ciclo usa insert/update em `study_cycles`.
6. Adicionar uma tarefa usa insert em `study_cycle_tasks`; a tela impede duplicar uma tarefa no mesmo ciclo.
7. Alterar o estado da missão reutiliza `buildProgressUpsert` e a tabela `mission_progress`; a tarefa do ciclo apenas reflete esse estado.
8. Revisão e próximo passo são textos do ciclo, editáveis pelo mesmo formulário.

## Interface

A tela usa fundo escuro operacional, painel denso e cartas claras apenas para missões/tarefas, mantendo baixo arredondamento e foco visível. O objeto principal é o ciclo atual; a coluna secundária mostra objetivo, revisão e próximo passo.

Estados obrigatórios:

- Supabase não configurado;
- sessão ausente;
- carregando;
- lista vazia;
- pronto com dados;
- salvando;
- erro de leitura ou escrita;
- ciclo ativo, planejado, concluído ou cancelado.

O formulário exige início, fim e objetivo. Revisão e próximo passo são opcionais enquanto o ciclo está aberto e passam a ser solicitados na ação de conclusão. O MVP não oferece exclusão física; um ciclo pode ser marcado como cancelado.

## Testes e verificação

- testes unitários do domínio cobrem datas inválidas, objetivo vazio, status permitido, normalização de textos e payloads de ciclo/tarefa;
- a migration é validada com o Supabase CLI local, incluindo reset, listagem de migrations e consultas de schema/policies;
- testes existentes continuam passando;
- `npm test`, `npm run lint`, `npm run content:validate` e `npm run build` devem ser executados antes da conclusão;
- a tela deve ser verificada no estado deslogado e autenticado, incluindo criação, edição, associação de tarefa e atualização de status.

## Decisões e riscos

- O estado da missão permanece global para permitir reutilizar a mesma tarefa em ciclos futuros.
- O status concluído de uma missão não informa em qual ciclo ela foi concluída; histórico de eventos fica para evolução futura.
- IDs `TASK-*` precisam permanecer estáveis no conteúdo versionado.
- A exclusão fica fora do MVP para manter grants e recuperação simples; o cancelamento preserva o registro.
