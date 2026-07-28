# Conteúdo Markdown em sessões navegáveis

Data: 2026-07-27

## Objetivo

Integrar o conteúdo curado do StudyOps à aplicação sem exibir capítulos longos
de uma vez. Cada seção Markdown de primeiro nível (`##`) será tratada como uma
sessão de estudo independente, com índice, rota própria e navegação sequencial.

Esta etapa é somente leitura. Status, notas e evidências do usuário continuam
fora do escopo.

## Contexto e restrições

- Os arquivos em `content/` são a fonte editorial canônica.
- O frontmatter atual e os IDs existentes devem ser preservados.
- Os cinco fundamentos, quinze etapas e trinta tarefas devem aparecer a partir
  dos arquivos reais, sem dados hardcoded na interface.
- O conteúdo antes do primeiro `##` não pode ser perdido; ele será exibido na
  visão geral da entidade.
- A solução não deve restaurar os fundamentos antigos nem alterar os documentos
  de referência do projeto.
- A validação `npm run content:validate` continua obrigatória.

## Modelo de dados de leitura

O carregador server-side em `src/lib/content.ts` fornecerá tipos derivados do
Markdown:

- `Fundament`: frontmatter do fundamento, resumo, introdução, sessões, etapas e
  tarefas agrupadas por etapa.
- `Step`: `id`, `title`, `order`, `expected_evidence` e tarefas relacionadas.
- `Task`: frontmatter da tarefa, introdução, sessões e relação com fundamento e
  etapa.
- `ContentSection`: título, slug, ordem e Markdown do conteúdo após o título.

As sessões serão extraídas por títulos `##`. O slug será derivado do título com
uma função determinística compatível com os slugs existentes. Títulos repetidos
receberão sufixo numérico para manter rotas únicas e previsíveis.

## Rotas e navegação

As páginas serão server components do App Router:

```txt
/                                      visão geral dos fundamentos
/fundamentos/[slug]                    fundamento, sessões e etapas
/fundamentos/[slug]/etapas/[etapa]     etapa e tarefas relacionadas
/fundamentos/[slug]/tarefas/[tarefa]   tarefa e índice de sessões
/fundamentos/[slug]/sessoes/[sessao]   uma sessão do fundamento
/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]
                                       uma sessão da tarefa
```

Páginas de sessão exibem uma única seção `##`, além de breadcrumb e controles
de sessão anterior/próxima. Slugs inválidos usam `notFound()`.

## Renderização Markdown

O corpo será renderizado como Markdown compatível com o conteúdo atual:

- títulos subsequentes;
- parágrafos e links;
- listas ordenadas e não ordenadas;
- código inline e blocos fenced;
- tabelas GFM;
- citações.

O renderer não aceitará HTML arbitrário do conteúdo. A renderização ocorrerá no
servidor e links externos poderão receber comportamento seguro de abertura.

## Composição da interface

A home exibirá os cinco fundamentos reais, cada um com resumo, status editorial,
quantidade de etapas, quantidade de tarefas e link para a primeira sessão.

A página do fundamento exibirá o resumo, a introdução, o índice de sessões e as
etapas em ordem. Cada etapa exibirá suas tarefas relacionadas.

A página da tarefa exibirá suas evidências esperadas, introdução, índice de
sessões e links de navegação para fundamento e etapa.

Não haverá controles de alteração de status, cadastro de notas ou upload de
evidências nesta etapa.

## Tratamento de erros

- Caminho ou slug desconhecido: `notFound()`.
- Sessão inexistente: `notFound()`.
- Conteúdo malformado: erro explícito no carregador, fazendo o build falhar em
  vez de esconder o problema editorial.
- Relações inválidas entre fundamento, etapa e tarefa continuam sendo detectadas
  por `npm run content:validate`.

## Verificação

Testes unitários cobrirão a divisão por `##`, slugificação, preservação do
Markdown, indexação de fundamentos e associação de tarefas às etapas.

Antes de considerar o incremento pronto, executar:

```bash
npm run content:validate
npm run lint
npm run build
```

## Fora de escopo

- Persistência no Supabase.
- Status individual de sessão ou tarefa.
- Notas e evidências criadas pelo usuário.
- Busca semântica, IA, autenticação ou importação externa.
- Reescrita dos documentos de trilha, portfólio ou curadoria.
