# Notas, projetos e progresso consolidado

## Objetivo

Fechar o ciclo básico do StudyOps sem implementar os territórios futuros da
trilha: notas persistidas por usuário, catálogo dos cinco projetos de portfólio,
ciclos com gerenciamento completo e uma visão consolidada de progresso.

Ficam fora deste incremento a exigência de evidência para concluir uma missão,
os blocos 2 a 4 da trilha, RAG, embeddings, importação de GitHub e Awesome
Radar.

## Decisões de arquitetura

O conteúdo canônico continua no repositório, em Markdown/frontmatter. Os cinco
projetos serão descritos em `content/projetos/` e terão slugs estáveis usados
pelas páginas e pelos vínculos com fundamentos e tarefas.

As páginas server-side são as únicas que leem Markdown/`fs` e passam snapshots
serializáveis para ilhas client-side. Repositories em
`src/lib/supabase/repositories/` não leem arquivos, não renderizam React e
recebem um `SupabaseClient` explicitamente; componentes client-side não montam
queries Supabase diretamente.

O Supabase guarda apenas estado privado do usuário:

- notas de estudo;
- estado pessoal dos projetos;
- vínculos entre ciclos e projetos.

O identificador de usuário será sempre o UUID de `auth.users.id`. O e-mail pode
ser exibido no perfil, mas não será usado como chave, `user_id` ou mecanismo de
autorização, porque pode mudar e não substitui `auth.uid()` nas policies.

## Modelo de dados

### `study_notes`

Substitui o armazenamento global em `localStorage`.

- `id uuid primary key`;
- `user_id uuid not null references auth.users(id) on delete cascade`;
- `target_type text not null` (`task`, `fundament`, `session`);
- `target_key text not null`;
- `body text not null`;
- `created_at` e `updated_at`;
- checks para `target_type`, formato do target e corpo não vazio;
- unicidade em `(user_id, target_type, target_key)`.

O `target_key` usará IDs estáveis (`TASK-*` e `FUN-*`) quando existirem. Para
sessões, usará um locator versionado derivado do fundamento, tarefa e slug da
seção até que sessões tenham IDs próprios.

### Projetos

O catálogo canônico terá cinco arquivos Markdown:

1. Mini Redis aplicado a IA;
2. Banco de dados documental mínimo;
3. Sistema de ingestão de documentos;
4. Observabilidade para estudos;
5. GitHub Repo Analyzer.

Cada projeto terá ID/slug, resumo, objetivo, MVP, evoluções e referências aos
fundamentos/tarefas relevantes. O `Local Research Searcher` será marcado como
projeto central dentro do conteúdo existente, sem virar um sexto projeto neste
incremento.

O estado pessoal será persistido em `portfolio_project_progress`:

- `id uuid primary key`;
- `user_id uuid not null references auth.users(id) on delete cascade`;
- `project_id text not null` com formato `PROJ-*`;
- `status text not null` (`planned`, `in_progress`, `paused`, `completed`);
- `objective text`, `notes text` e `next_step text` opcionais;
- timestamps;
- unicidade em `(user_id, project_id)`.

O status terá check explícito e o `project_id` terá formato `PROJ-*`. Não haverá
DELETE de progresso de projeto sem uma ação explícita de reset na interface.

Como os projetos e tarefas vivem em Markdown, os vínculos canônicos serão
declarados nos arquivos Markdown e validados pelo registry de conteúdo, sem FK
SQL para `FUN-*` ou `TASK-*`. Não haverá vínculo pessoal editável entre projeto
e tarefa neste incremento; a relação canônica do projeto será a fonte exibida
na interface.

### Ciclos

Manter `study_cycles` como fonte de planejamento, revisão e próximo passo, e
`study_cycle_tasks` como associação ordenada. Adicionar `study_cycle_projects`
para relacionar um ciclo a um ou mais IDs `PROJ-*` de projeto.

Adicionar exclusão segura apenas para registros do próprio usuário. A exclusão
de ciclo apaga suas tarefas e vínculos de projeto por cascade, mas não apaga
`mission_progress` nem `mission_evidence`.

A inclusão, remoção com compactação e reordenação de tarefas devem ser
transacionais. A unicidade `(cycle_id, position)` será compatível com swaps
atômicos por meio de `UNIQUE (cycle_id, position) DEFERRABLE INITIALLY
DEFERRED`, e as operações validarão ownership do ciclo antes de alterar linhas.

O status real da missão continuará exclusivamente em `mission_progress`; ciclo
e projeto não duplicarão esse status.

## RLS e autorização

Todas as novas tabelas privadas:

- terão RLS habilitado;
- revogarão acesso de `anon`;
- concederão apenas operações necessárias a `authenticated`;
- usarão `using ((select auth.uid()) = user_id)`;
- usarão `with check ((select auth.uid()) = user_id)`;
- terão `DELETE` somente se a interface oferecer exclusão.

Não haverá tabela pública de usuários nem autorização baseada em e-mail ou
`user_metadata`.

Funções RPC de ciclo serão `SECURITY INVOKER`, usarão `search_path` vazio e
objetos qualificados, terão `EXECUTE` revogado de `PUBLIC` e `anon` e serão
concedidas somente a `authenticated`. `SECURITY INVOKER` não substitui grants e
RLS: o chamador ainda precisará das permissões de tabela.

## Fluxos de interface

### Notas

O componente de nota carregará e salvará pelo Supabase usando a identidade do
usuário autenticado. O botão Limpar removerá a nota do banco. Enquanto o usuário
estiver desconectado, o conteúdo continuará público e o editor ficará bloqueado.

Notas antigas do `localStorage` não serão migradas silenciosamente. Quando forem
detectadas, o app mostrará uma ação explícita para importá-las para a conta
autenticada; após a importação confirmada, removerá o armazenamento legado do
navegador.

### Projetos

Criar uma superfície de projetos com os cinco cartões, status pessoal, notas,
próximo passo e tarefas/fundamentos relacionados. A leitura do catálogo será
pública; edição de status e registros exigirá autenticação.

### Ciclos

Na rota `/ciclos`, permitir:

- criar e editar ciclo;
- associar e remover tarefas;
- reordenar tarefas;
- associar projetos;
- excluir ciclo;
- ver revisão, próximo passo e avanço das missões.

### Progresso

Criar `/progresso` com um read model montado na aplicação, combinando catálogo
Markdown e dados privados:

- ciclo ativo e próximo passo;
- tarefas totais, em andamento, bloqueadas e concluídas;
- evidências recentes;
- notas registradas;
- progresso por fundamento;
- fase manual e progresso derivado por projeto, como métricas separadas.

A home exibirá apenas um resumo compacto dos projetos associados ao ciclo ativo
e link para a visão completa. Se não houver ciclo ativo, não será escolhido um
projeto arbitrário como foco. Não criar view ou dashboard analítico no banco
nesta fase.

O read model usará ordenação determinística: ciclos por `starts_on DESC`,
`created_at DESC`, `id ASC`; tarefas por `position ASC`, `content_id ASC`;
projetos por `order ASC`, `id ASC`; e evidências por `produced_at DESC`,
`id ASC`. O catálogo Markdown é o denominador; linhas privadas com IDs ausentes
no catálogo são ignoradas.

## Testes e verificação

Adicionar testes puros para:

- isolamento de notas por usuário;
- normalização de targets de nota;
- status e payload de projeto;
- montagem do read model de progresso;
- exclusão e reordenação sem colisão de posições.

Adicionar testes de integração local do Supabase como gate obrigatório, cobrindo
dois usuários, `anon`, RLS, RPCs e rollback de reordenação. O read model deve
ignorar registros privados com IDs ausentes no catálogo Markdown e usar o
catálogo como denominador. A regra do próximo passo será: `next_step` do ciclo
ativo; depois a primeira missão em andamento; depois a primeira missão
planejada; depois o próximo passo manual do projeto; por fim, nenhum próximo
passo. Consultas privadas deverão paginar ou limitar explicitamente seus
resultados.

A verificação final deverá executar `npm test`, `npm run test:supabase`,
`npm run lint`, `npm run content:validate`, `npm run build` e `git diff --check`.

## Critérios de aceite

- Usuários diferentes nunca leem ou alteram notas uns dos outros.
- As cinco fichas de projeto aparecem no catálogo e podem receber estado pessoal.
- Uma tarefa pode ser relacionada a um projeto sem duplicar conteúdo Markdown.
- Um ciclo pode ser editado, ter tarefas removidas/reordenadas, receber projetos
  e ser excluído sem apagar progresso histórico de missões.
- `/progresso` responde o que está ativo, o que foi concluído, quais evidências
  existem e qual é o próximo passo.
- Usuários A, B e visitantes anônimos não atravessam RLS, nem conseguem executar
  RPCs privadas ou associar registros de outro usuário.
- O conteúdo público continua navegável sem login.
