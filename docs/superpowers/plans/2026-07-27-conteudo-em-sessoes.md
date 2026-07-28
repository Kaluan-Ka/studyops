# Navegador de conteúdo em sessões Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar os fundamentos, etapas e tarefas reais do Markdown à aplicação, dividindo cada arquivo em sessões navegáveis por títulos `##`.

**Architecture:** Um loader server-side lerá frontmatter e corpo Markdown, normalizará fundamentos, etapas, tarefas e sessões e fornecerá buscas tipadas às páginas do App Router. As páginas serão server components e usarão rotas dinâmicas para índices e sessões individuais; o conteúdo continuará fora de `src` e sem persistência de progresso.

**Tech Stack:** Next.js App Router 16, React 19, TypeScript, `gray-matter`, `react-markdown`, `remark-gfm`, `node:test` via `tsx`.

## Global Constraints

- Preservar os IDs, slugs, etapas e `expected_evidence` dos arquivos existentes.
- Ler o conteúdo exclusivamente de `content/`; não recriar fundamentos antigos nem hardcodar dados editoriais na UI.
- Dividir sessões por títulos Markdown de primeiro nível `##`; o texto antes do primeiro `##` permanece como introdução.
- Exibir somente conteúdo de leitura; status, notas e evidências do usuário ficam fora desta etapa.
- Não alterar `AGENTS.md`, `trilha-engenharia-ia.md`, `projetos-portfolio-ia.md` ou `docs/decisions/`.
- Rodar `npm run content:validate`, `npm run lint` e `npm run build` antes de declarar a implementação verificada.

---

### Task 1: Criar loader e parser de conteúdo

**Files:**
- Create: `src/lib/content.ts`
- Create: `tests/content.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: arquivos `content/fundamentos/*.md` e `content/tasks/<fundamento-slug>/*.md`.
- Produces: `ContentSection`, `Fundament`, `Step`, `Task`, `getFundamentos()`, `getFundamentBySlug()`, `getStepBySlug()`, `getTaskBySlug()` e buscas de sessão.

- [ ] **Step 1: Escrever os testes de parser que falham**

  Criar testes `node:test` para uma string Markdown com introdução, dois títulos `##`, código fenced e tabela. Verificar que `splitIntoSections()` preserva a introdução, cria dois slugs únicos, mantém o código e não inclui o título `##` dentro do corpo da sessão. Adicionar testes para `getFundamentos()` retornar cinco fundamentos ordenados e para a tarefa `definir-contrato-de-entrada-e-saida` pertencer à etapa `STEP-000016`.

  O teste deverá importar as funções públicas do loader e usar asserções equivalentes a:

  ```ts
  const parsed = splitIntoSections(`# Título\n\nIntrodução.\n\n## Conceito explicado\n\nTexto.\n\n## Exemplo\n\n\`\`\`ts\nconst ok = true;\n\`\`\``);
  assert.equal(parsed.intro, "Introdução.");
  assert.deepEqual(parsed.sections.map((item) => item.slug), ["conceito-explicado", "exemplo"]);
  assert.match(parsed.sections[1].markdown, /const ok = true/);
  assert.equal(getFundamentos().length, 5);
  assert.equal(getTaskBySlug("definir-contrato-de-entrada-e-saida").stepId, "STEP-000016");
  ```

- [ ] **Step 2: Adicionar o script de teste e confirmar RED**

  Adicionar em `package.json` o script `"test": "tsx --test tests/**/*.test.ts"` e executar:

  ```bash
  npm test
  ```

  Esperado: falha porque `src/lib/content.ts` e as funções importadas ainda não existem.

- [ ] **Step 3: Implementar o modelo e a divisão por `##`**

  Implementar tipos e funções puras no loader. A divisão deve remover frontmatter antes de procurar títulos, ignorar o H1, guardar o trecho anterior ao primeiro `##` em `intro`, normalizar títulos com slugify e acrescentar `-2`, `-3` quando houver títulos repetidos. A função deve conservar o Markdown interno sem reinterpretá-lo.

  Implementar leitura server-side com `fs`, `path` e `gray-matter`, ordenar por `order`, associar tarefas pelo `fundamento_id`/`etapa_id` e usar erro explícito para arquivo ou relação inválida. Expor exatamente as funções usadas pelos testes e pelas páginas.

- [ ] **Step 4: Executar GREEN e refatorar apenas com testes verdes**

  Executar novamente:

  ```bash
  npm test
  ```

  Esperado: todos os testes do loader passam. Remover duplicações internas sem mudar as interfaces públicas.

### Task 2: Renderizar Markdown e criar índice de conteúdo

**Files:**
- Modify: `package.json`
- Create: `src/components/MarkdownContent.tsx`
- Create: `src/components/ContentNavigation.tsx`
- Create: `src/app/content.module.css`

**Interfaces:**
- Consumes: `ContentSection` e `markdown` retornados por `src/lib/content.ts`.
- Produces: componentes server-side `MarkdownContent` e `ContentNavigation` para sessões, breadcrumbs e links anterior/próxima.

- [ ] **Step 1: Instalar o renderer Markdown necessário**

  Adicionar `react-markdown` e `remark-gfm` às dependências com `npm install react-markdown remark-gfm`. Confirmar que `package.json` e `package-lock.json` foram atualizados sem alterar outras dependências.

- [ ] **Step 2: Criar o renderer sem HTML arbitrário**

  Implementar `MarkdownContent` com `ReactMarkdown` e `remarkPlugins={[remarkGfm]}`. Configurar componentes para links externos, `pre`/`code`, tabelas e headings subsequentes, mantendo os blocos de código legíveis. Não habilitar `rehype-raw`.

- [ ] **Step 3: Criar navegação de sessão**

  Implementar `ContentNavigation` recebendo `previous` e `next` opcionais, cada um com `href` e `title`, exibindo links somente quando existirem. A navegação deve ser reutilizada nas páginas de fundamento e tarefa.

- [ ] **Step 4: Criar estilos focados em leitura curta**

  Adicionar estilos para largura de leitura confortável, destaque de código, tabelas com overflow horizontal, índice de sessões, breadcrumbs, cartões de etapa/tarefa e estados vazios. Preservar a linguagem visual existente e o comportamento responsivo sem criar controles de progresso.

### Task 3: Criar páginas de fundamentos, etapas, tarefas e sessões

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/fundamentos/[slug]/page.tsx`
- Create: `src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx`
- Create: `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`
- Create: `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`
- Create: `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`

**Interfaces:**
- Consumes: loader, renderer e navegação das Tasks 1 e 2.
- Produces: páginas com `generateStaticParams`, `notFound()` para slugs inválidos e links estáveis entre fundamento, etapa, tarefa e sessão.

- [ ] **Step 1: Substituir os dados hardcoded da home**

  Fazer `src/app/page.tsx` chamar `getFundamentos()`. Renderizar os cinco fundamentos ordenados, resumo, status, quantidade de etapas, quantidade de tarefas e link para `/fundamentos/[slug]`. Atualizar os resumos operacionais para contar fundamentos, tarefas e sessões reais.

- [ ] **Step 2: Criar a visão geral do fundamento**

  Renderizar título, resumo, introdução, índice de sessões com links, etapas na ordem e tarefas agrupadas. Gerar os parâmetros estáticos a partir de `getFundamentos()` e chamar `notFound()` quando o slug não existir.

- [ ] **Step 3: Criar a página da etapa**

  Resolver o fundamento pelo slug e a etapa pelo slug derivado do título. Mostrar o título, evidências esperadas, tarefas relacionadas e links para cada tarefa. Retornar `notFound()` quando a etapa não pertencer ao fundamento.

- [ ] **Step 4: Criar páginas de tarefa e sessão de tarefa**

  Mostrar título, introdução, fundamento, etapa, evidências esperadas e índice de sessões na página da tarefa. Na rota de sessão, mostrar somente a seção solicitada, breadcrumb e navegação anterior/próxima dentro da mesma tarefa.

- [ ] **Step 5: Criar páginas de sessão de fundamento**

  Resolver a sessão pelo slug, renderizar seu título e Markdown e incluir navegação entre sessões do mesmo fundamento. Gerar parâmetros estáticos para os cinco fundamentos e suas sessões.

- [ ] **Step 6: Verificar navegação e não duplicar conteúdo editorial**

  Conferir que nenhum nome antigo como `Hash Table`, `Cache` ou `Busca textual` foi reintroduzido como dado da home e que todos os links usam slugs derivados do loader.

### Task 4: Validar a integração completa

**Files:**
- Inspect: `src/lib/content.ts`
- Inspect: `src/app/**/*.tsx`
- Inspect: `src/app/**/*.css`
- Test: `tests/content.test.ts`

**Interfaces:**
- Consumes: todas as páginas, componentes e testes das tasks anteriores.
- Produces: aplicação compilável e conteúdo curado validado sem alterar os documentos protegidos.

- [ ] **Step 1: Executar testes do loader**

  ```bash
  npm test
  ```

  Esperado: saída sem falhas para parser, contagem, relações e slugs.

- [ ] **Step 2: Validar o conteúdo editorial**

  ```bash
  npm run content:validate
  ```

  Esperado: `Conteudo valido.`

- [ ] **Step 3: Executar lint e build**

  ```bash
  npm run lint
  npm run build
  ```

  Esperado: ambos terminam com código zero; o build deve executar a validação de conteúdo antes de compilar as rotas.

- [ ] **Step 4: Revisar o diff e o estado do Git**

  Executar `git diff --check`, `git status --short` e revisar que apenas arquivos da integração, testes, dependências, especificação e plano foram adicionados ou modificados, mantendo intactos `AGENTS.md`, `trilha-engenharia-ia.md`, `projetos-portfolio-ia.md` e `docs/decisions/`.
