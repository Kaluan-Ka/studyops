# Redesenho das paginas internas do StudyOps

Data: 2026-07-28

## Contexto

A home atual do StudyOps ja consolidou a linguagem de Centro de Comando Orbital:
mapa de fundamentos, briefing operacional, territorios apagados, cartas de
missao e evidencia como criterio de progresso. As paginas internas ainda usam um
molde mais generico de hero, grids e cards claros. O redesenho deve trazer essas
superficies para o mesmo mundo visual sem copiar a composicao da home.

## Objetivo

Redesenhar as paginas internas por ordem de impacto:

1. Pagina de fundamento como regiao aberta do mapa.
2. Pagina de tarefa como carta e briefing de missao.
3. Paginas de sessao como briefing de leitura focado.
4. Notas e evidencias como painel de registro de campo.
5. Pagina de etapa como sub-regiao ou rota entre fundamento e tarefas.

O escopo preserva o conteudo Markdown/frontmatter atual. Nao adiciona progresso
persistido, autenticacao, Supabase, IA, importacao externa ou novas entidades.

## Principios de design

- O objeto principal da tela deve aparecer antes de qualquer decoracao.
- Fundamentos, etapas, sessoes, tarefas e evidencias devem ter formas visuais
  diferentes, mas pertencentes ao mesmo sistema.
- Cartas claras so devem representar missao, tarefa, sessao acionavel ou
  evidencia esperada.
- Paineis escuros devem carregar contexto, orientacao e telemetria derivada do
  conteudo existente.
- Brilho e cor indicam foco, estado vivo ou evidencia, nunca pontuacao
  inventada.
- Em mobile, a hierarquia deve continuar: objeto principal, contexto, rotas,
  missoes e registro.

## Superficies

### 1. Fundamento como regiao aberta

A pagina de fundamento deve parecer que o usuario abriu uma regiao do mapa.
O topo deixa de ser apenas um hero textual e vira uma composicao operacional:
identificacao do fundamento, resumo, contadores reais, fontes e proxima acao.

A area principal deve mostrar as etapas como rotas da regiao. Cada rota exibe
ordem, titulo, evidencias esperadas e tarefas conectadas. As sessoes de leitura
aparecem como trilha lateral ou faixa de wayfinding, com estado de "leitura em
blocos". Tarefas aparecem como missoes clicaveis, com numeracao e vinculo claro
com a etapa.

### 2. Etapa como sub-regiao ou rota

A pagina de etapa fica entre fundamento e tarefa. Ela deve agir como ampliacao
de uma rota especifica: objetivo pratico da etapa, evidencias esperadas e deck
de tarefas. O visual deve ser mais concentrado que o fundamento e menos solene
que a tarefa individual.

### 3. Tarefa como carta e briefing de missao

A pagina de tarefa deve parecer uma carta de missao apoiada sobre a mesa de
operacao. O primeiro bloco deve comunicar: tipo da missao, titulo, objetivo,
fundamento, etapa e evidencias esperadas.

As sessoes da tarefa aparecem como briefing de execucao, em blocos sequenciais.
A anotacao local aparece logo depois como registro de campo da missao. A pagina
nao deve inventar checklist de conclusao; deve apenas organizar o que ja existe:
introducao, sessoes e evidencias esperadas.

### 4. Sessao como briefing de leitura

As paginas de sessao de fundamento e de tarefa compartilham o mesmo padrao de
leitura. Devem ficar mais calmas e focadas que fundamento e tarefa: largura
controlada, painel de leitura claro, breadcrumb operacional e navegacao anterior
/ proxima bem visivel.

O Markdown deve continuar legivel, com hierarquia clara para titulos, listas,
codigo, tabelas e links. A nota local fica dentro do fluxo como logbook, nao como
card generico colado ao fim.

### 5. Notas e evidencias como registro de campo

O componente `StudyNote` deve ser redesenhado como logbook tecnico. Ele continua
client-side e localStorage, mas sua aparencia deve comunicar registro local de
evidencia, duvida, resultado ou proximo passo.

Estados esperados:

- carregando anotacao;
- nenhuma anotacao salva;
- anotacao salva neste navegador;
- alteracoes ainda nao salvas;
- erro de acesso ao armazenamento local.

Os controles devem manter foco visivel, texto legivel e estados desabilitados
claros.

## Arquitetura de UI

O primeiro incremento deve ser majoritariamente composto por ajustes de markup e
CSS nos arquivos existentes:

- `src/app/fundamentos/[slug]/page.tsx`
- `src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx`
- `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`
- `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`
- `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`
- `src/components/StudyNote.tsx`
- `src/app/page.module.css`
- `src/app/content.module.css`

Criar componentes auxiliares so e necessario se a duplicacao entre paginas de
sessao ou estruturas de cartas ficar claramente repetitiva durante a
implementacao. O padrao preferido para este lote e manter o MVP simples.

## Dados e fluxo

Todos os dados continuam vindo de `src/lib/content.ts` e dos arquivos Markdown
em `content/`.

Os contadores exibidos devem ser derivados somente de:

- quantidade de sessoes do fundamento ou tarefa;
- quantidade de etapas;
- quantidade de tarefas;
- quantidade de evidencias esperadas;
- quantidade de fontes externas extraidas do Markdown.

Nenhum percentual, progresso concluido ou status persistido deve ser fabricado.

## Acessibilidade e responsividade

- Preservar semantica de `main`, `section`, `article`, listas e headings.
- Garantir foco visivel em links, textarea e botoes.
- Manter contraste legivel em fundos escuros e claros.
- Evitar texto sobreposto em cards, botoes, tiles ou paineis.
- Em mobile, trocar grids por coluna unica e manter cards com dimensoes estaveis.
- Textos longos devem quebrar linha sem estourar o container.

## Testes e verificacao

Verificacao minima depois da implementacao:

- `npm run lint`
- `npm test`
- abrir a home e uma pagina de cada tipo no navegador local;
- verificar desktop e mobile para fundamento, tarefa e sessao;
- confirmar que notas locais ainda salvam, limpam e restauram.

## Fora de escopo

- Persistencia remota de progresso.
- CRUD de tarefas, fundamentos ou evidencias.
- Alteracao do conteudo Markdown.
- Criacao de dashboards novos.
- Animacoes complexas ou canvas.
- Reescrita de `DESIGN.md`, ja que a identidade existente sera herdada.
