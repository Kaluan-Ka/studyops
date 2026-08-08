# StudyOps

> Este projeto foi desenvolvido inteiramente no Codex.

StudyOps e uma webapp pessoal para acompanhar a trilha de Engenharia de IA e
transformar estudo em evidencias de portfolio.

O MVP comeca pelos fundamentos: cada fundamento possui etapas, tarefas praticas
e evidencias esperadas. O conteudo curado fica versionado no repositorio em
Markdown/frontmatter; progresso, resolucoes e evidencias de usuario entram no
Supabase.

## Stack

- Next.js App Router
- TypeScript
- Conteudo Markdown/frontmatter em `content/`
- Script Node/TypeScript para validacao e criacao de conteudo
- Supabase para autenticacao e progresso persistido
- Vercel para deploy

## Autenticacao e permissao

A leitura de fundamentos, sessoes e missoes e publica. O login e feito somente
com Google e e exigido para iniciar uma missao, alterar seu status, salvar
evidencias ou registrar notas. 

No projeto Supabase, habilite Google em `Authentication > Providers > Google`.
No Google Cloud, crie um OAuth Client ID do tipo Web e use como callback:

```txt
https://<project-ref>.supabase.co/auth/v1/callback
```

Em `Authentication > URL Configuration`, cadastre a URL local e a URL de
producao como Site URL/Redirect URL.

O app envia a origem atual como `redirectTo`, portanto cada origem usada para
testar ou publicar precisa estar permitida no Supabase.

## Ciclos de estudo

A rota `/ciclos` e a primeira fatia vertical de planejamento semanal do
StudyOps. Ela permite que uma pessoa autenticada:

- crie ciclos com inicio, fim, objetivo e status;
- associe tarefas existentes do catalogo Markdown ao ciclo;
- acompanhe o estado real dessas tarefas a partir de `mission_progress`;
- atualize o status da missao sem duplicar esse estado no ciclo;
- registre revisao e proximo passo ao concluir o ciclo.

## Supabase local

O progresso persistido e os ciclos usam o schema versionado em
`supabase/migrations/` e dependem de variaveis publicas no ambiente local:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use apenas a publishable key no cliente. Nunca coloque service role ou secrets
em variaveis `NEXT_PUBLIC_`.

Para iniciar o ambiente local e aplicar as migrations:

```bash
npm run supabase:local:start
npm run supabase:local:status
npm run supabase:local:db:reset
```

A migration de autenticacao cria `public.profiles` automaticamente depois de
um novo usuario em `auth.users`. O cliente tambem faz um upsert idempotente do
profile durante a sessao para reparar usuarios criados antes do trigger.

Para conferir as migrations aplicadas no ambiente local:

```bash
npm run supabase:local:migrations
```

Depois de configurar o provider Google, rode a aplicacao com:

```bash
npm run dev
```

Visitantes continuam navegando pelo conteudo. Ao clicar em qualquer controle
de escrita, entram com Google e retornam para a origem atual.

## Deploy na Vercel

Antes do deploy, aplique as migrations no projeto Supabase de producao. O
deploy na Vercel nao executa migrations automaticamente; a migration dos ciclos
precisa existir no Supabase antes de publicar a versao que usa `/ciclos`.

No projeto da Vercel, configure apenas as variaveis publicas usadas pelo
browser client:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

No Supabase, adicione a URL de producao da Vercel em
`Authentication > URL Configuration` como Site URL/Redirect URL. No Google
Cloud, mantenha o callback OAuth apontando para:

```txt
https://<project-ref>.supabase.co/auth/v1/callback
```

Antes de publicar, rode localmente:

```bash
npm test
npm run lint
npm run content:validate
npm run build
```

## Design

A home atual e a referencia canonica da identidade visual do StudyOps. Ela define
o produto como um Centro de Comando Orbital: mapa de fundamentos, briefing
operacional, territorios futuros apagados e cartas de missao.

Antes de criar ou redesenhar telas, use:

- `DESIGN.md`
- `docs/design/home-canonica.md`
- `src/app/page.tsx`
- `src/app/page.module.css`

## Scripts

```bash
npm run content:validate
npm run content:create -- fundamento "Hash Table"
npm run content:create -- task FUN-000001 STEP-000001 "Implementar hashmap"
npm run preview
npm run lint
npm run build
```

`npm run build` executa a validacao de conteudo antes do build. Use
`npm run preview` para inspecao visual local mais leve depois de um build ja
existente. Use `npm run preview:fresh` quando quiser reconstruir tudo antes de
abrir o servidor de preview.

`npm run dev` continua disponivel para desenvolvimento com hot reload, mas
consome mais CPU e memoria por usar o servidor de desenvolvimento do Next.js.

## Conteudo

```txt
content/
  .registry/
    ids.json
  fundamentos/
  tasks/
  summaries/
```

IDs canonicos seguem o formato opaco definido para o MVP:

- `FUN-000001`
- `STEP-000001`
- `TASK-000001`
- `PROJ-000001`
- `EVID-000001`
