# StudyOps

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
evidencias ou registrar notas. As notas continuam em `localStorage` nesta
primeira fatia; elas nao sao lidas nem gravadas enquanto nao houver uma sessao
autenticada.

No projeto Supabase, habilite Google em `Authentication > Providers > Google`.
No Google Cloud, crie um OAuth Client ID do tipo Web e use como callback:

```txt
https://<project-ref>.supabase.co/auth/v1/callback
```

Em `Authentication > URL Configuration`, cadastre a URL local e a URL de
producao como Site URL/Redirect URL, por exemplo:

```txt
http://localhost:3000
https://seu-dominio.example
```

O app envia a origem atual como `redirectTo`, portanto cada origem usada para
testar ou publicar precisa estar permitida no Supabase.

## Supabase local

A primeira fatia de progresso persistido usa o schema versionado em
`supabase/migrations/` e depende de variaveis publicas no ambiente local:

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
```

A migration de autenticacao cria `public.profiles` automaticamente depois de
um novo usuario em `auth.users`. O cliente tambem faz um upsert idempotente do
profile durante a sessao para reparar usuarios criados antes do trigger.

Depois de configurar o provider Google, rode a aplicacao com:

```bash
npm run dev
```

Visitantes continuam navegando pelo conteudo. Ao clicar em qualquer controle
de escrita, entram com Google e retornam para a origem atual.

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
