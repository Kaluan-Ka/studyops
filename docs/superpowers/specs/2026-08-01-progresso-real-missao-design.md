# Progresso real em pagina de missao

## Contexto

O StudyOps ja tem conteudo canonico de tarefas em Markdown/frontmatter e um schema Supabase versionado para progresso real:

- `mission_progress` guarda estado manual por usuario e `content_id` de tarefa.
- `mission_evidence` guarda evidencias produzidas pelo usuario ligadas ao progresso.
- `task.id` e a identidade canonica que deve preencher `mission_progress.content_id`.

Esta vertical slice conecta a pagina de tarefa ao schema existente sem criar migration nova e sem tocar no Supabase remoto.

## Objetivo

Permitir que uma missao mostre e registre progresso real persistido:

- estado manual: `in_progress`, `blocked` ou `completed`;
- evidencia concreta ligada ao progresso da tarefa;
- exibicao do estado e das evidencias na propria pagina.

O status editorial do Markdown continua existindo como contexto curado, mas nao deve ser apresentado como progresso persistido do usuario.

## Fora de escopo

- Nova migration Supabase.
- Supabase remoto, `supabase link`, `db push`, `db pull`, `migration repair`, `--linked` ou `--project-ref`.
- Dashboard percentual ou barra de progresso.
- Importacao automatica de GitHub, RAG, embeddings ou IA.
- Exclusao de evidencias, porque o schema atual nao concede `delete` para `authenticated`.
- Multiusuario complexo alem das policies de ownership ja existentes.

## Abordagem recomendada

Implementar uma ilha de progresso na pagina de tarefa usando o contrato atual:

1. A pagina server-side continua carregando a missao pelo Markdown.
2. A nova superficie recebe `task.id`, titulo e contexto minimo.
3. O app tenta usar Supabase apenas quando as variaveis publicas estiverem configuradas.
4. Se nao houver configuracao ou sessao, a UI mostra um painel operacional explicando que o progresso persistido ainda nao esta conectado nesta execucao local.
5. Quando houver usuario autenticado, a UI consulta `mission_progress` por `content_id = task.id`.
6. Ao salvar estado, o app cria ou atualiza o registro unico de progresso do usuario.
7. Ao salvar evidencia, o app garante um `mission_progress` existente e insere `mission_evidence` com payload real.
8. A UI recarrega o painel local da missao e exibe estado/evidencias salvos.

## Contrato de dados

`mission_progress`

- `user_id`: usuario autenticado via Supabase Auth.
- `content_id`: sempre `task.id`, como `TASK-000037`.
- `status`: somente `in_progress`, `blocked` ou `completed` nesta UI.
- `started_at`: preenchido quando o status vira `in_progress` pela primeira vez.
- `completed_at`: preenchido quando o status vira `completed`; limpo quando voltar para outro estado.

`mission_evidence`

- `user_id`: mesmo usuario autenticado.
- `progress_id`: registro de `mission_progress`.
- `evidence_type`: valor selecionado ou default seguro `note`.
- `title`: obrigatorio e nao vazio.
- `body`, `artifact_url` ou `artifact_path`: pelo menos um payload real obrigatorio.

## Experiencia

A pagina de tarefa deve preservar a linguagem de Centro de Comando Orbital:

- painel escuro operacional para progresso persistido;
- controles de estado compactos e claros;
- Evidence Gold para evidencias reais salvas;
- Signal Green para acao primaria;
- sem barra percentual.

Estados previstos:

- `unconfigured`: Supabase nao configurado no ambiente local.
- `signed_out`: Supabase configurado, mas sem usuario autenticado.
- `loading`: consulta em andamento.
- `ready_empty`: autenticado, sem progresso salvo para a missao.
- `ready_saved`: autenticado, com progresso/evidencias salvos.
- `error`: falha de leitura ou escrita sem expor detalhe sensivel.

## Componentes e arquivos previstos

- `src/lib/missionProgress.ts`: tipos, validacao e helpers puros para montar payloads de progresso/evidencia.
- `tests/missionProgress.test.ts`: testes TDD dos helpers e invariantes.
- `src/lib/supabase/client.ts`: cliente browser com `@supabase/ssr`, se a dependencia for instalada.
- `src/components/MissionProgressPanel.tsx`: ilha client-side de progresso e evidencia.
- `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`: inserir o painel usando `task.id`.
- `src/app/page.module.css` ou `src/app/content.module.css`: estilos alinhados a missao/painel operacional.
- `package.json` e lockfile: dependencias Supabase pinadas, se necessario.

## Erros e seguranca

- Nunca usar service role no cliente.
- Usar somente publishable key em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Nao imprimir tokens, cookies nem valores `.env`.
- Depender das RLS policies por `auth.uid()` ja existentes.
- Tratar erro de permissao como estado de UI, nao como razao para relaxar RLS.
- Nao criar evidencia sem payload real.

## Testes e verificacao

Antes de codigo de producao, criar teste falhando para:

- aceitar apenas status permitidos pela UI;
- montar payload de progresso com `content_id` opaco `TASK-000000`;
- preencher/limpar timestamps de inicio/conclusao corretamente;
- rejeitar evidencia sem titulo ou sem payload real.

Verificacao esperada:

- `npm run test`
- `npm run content:validate`
- `npm run lint`
- `npm run build`

Se a instalacao de dependencias Supabase exigir rede, pedir aprovacao antes de executar o comando. Se a stack local Supabase continuar falhando por `pgsodium_root.key`, registrar como limite de runtime/container local e nao como falha das migrations.
