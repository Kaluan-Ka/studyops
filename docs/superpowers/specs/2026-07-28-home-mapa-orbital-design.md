# Home Mapa Orbital Design

## Contexto

StudyOps e uma webapp pessoal para acompanhar a trilha de Engenharia de IA e transformar estudo em evidencias de portfolio. O app atual cobre apenas o primeiro bloco da trilha, mas a home deve apontar para o mundo completo descrito em `trilha-engenharia-ia.md` e `projetos-portfolio-ia.md`.

O design atual e funcional, porem generico: uma pagina clara com cards editoriais. A nova direcao aprovada e **Centro de Comando Orbital**: uma mistura de centro operacional, mapa espacial/planetario e boardgame.

## Objetivo

Redesenhar a home para que a primeira tela pareca o tabuleiro principal do StudyOps. O usuario deve entender rapidamente:

- o que esta estudando agora;
- qual regiao/fundamento esta ativo;
- quais fundamentos do Bloco 1 existem;
- que existe um mundo maior alem do bloco atual;
- qual e o proximo passo pratico;
- quais evidencias sustentam progresso real.

## Direcao Aprovada

**Centro de Comando Orbital**

A home e uma estacao de operacoes olhando para um mapa de mundo. O mapa usa regioes hexagonais como territorios de fundamento. A lateral funciona como briefing: regiao ativa, progresso, carta de missao, evidencia esperada e acoes.

O Bloco 1 aparece como territorio ativo. Blocos futuros aparecem como regioes apagadas, derivadas da trilha:

- Dados, busca e memoria para IA.
- Modelos e IA aplicada.
- Infraestrutura para projetos de IA.
- Portfolio, curadoria, GitHub Repo Analyzer, Awesome Radar e Local Research Searcher.

## Estrutura da Home

### Header

O header deve parecer uma barra operacional, nao uma navegacao editorial. Ele preserva o nome `StudyOps` e aponta para as areas principais: mapa, missoes e evidencias. Links podem continuar ancorando secoes da mesma pagina neste incremento.

### Primeiro Viewport

O primeiro viewport deve conter:

- mapa orbital/hexagonal dominante;
- titulo: StudyOps como trilha operacional de Engenharia de IA;
- descricao curta do metodo;
- tiles para fundamentos atuais;
- tiles apagados para regioes futuras;
- legenda de estados;
- painel lateral de briefing;
- chamada para iniciar a primeira sessao ou abrir o fundamento em foco.

### Mapa

Cada fundamento do Bloco 1 vira um tile no mapa. O estado visual deve seguir:

- `concluido`: mais colorido e luminoso;
- `em foco`: cyan/verde com brilho;
- `a estudar`: visivel, mas menos intenso;
- `futuro`: escuro/apagado, sem link obrigatorio.

Como ainda nao existe progresso persistido no banco, o primeiro incremento pode derivar estados do frontmatter atual e escolher um fundamento inicial em foco por ordem.

### Briefing

O briefing traduz o mapa em acao:

- nome do bloco ativo;
- resumo do fundamento em foco;
- contagem de fundamentos, tarefas e sessoes;
- evidencia esperada ou tipo de entrega;
- links para `Ver fundamento` e `Comecar sessao`.

### Cartas

Cards deixam de ser cards genericos e passam a ser cartas de missao. Elas podem representar:

- fundamentos;
- tarefas praticas;
- sessoes de leitura;
- evidencias esperadas.

No primeiro incremento, a home deve usar cartas de missao como complemento do mapa, nao como componente dominante.

## Conteudo

Preservar o conteudo real vindo de `content/`. Nao inventar progresso de usuario, metricas reais, usuarios, conquistas ou dados persistidos.

Pode-se criar copy de interface e labels sinteticos para explicar o mundo visual, desde que nao parecam dados reais. Exemplo aceitavel: "Territorio futuro". Exemplo a evitar: "87% concluido" sem fonte real.

## Arquitetura de UI

Manter a implementacao simples:

- `src/app/page.tsx` continua sendo a home.
- `src/app/page.module.css` concentra a maior parte do novo visual da home.
- Dados continuam vindo de `getFundamentos()`.
- Criar helpers locais apenas se reduzirem duplicacao real, por exemplo para contagem de tarefas/sessoes ou estado visual do tile.
- Nao alterar o modelo de dados neste incremento.
- Nao implementar Supabase, progresso persistido, IA ou importacao externa.

## Responsividade

Desktop:

- mapa e briefing lado a lado;
- mapa ocupa maior largura;
- header compacto.

Mobile:

- header quebra sem sobrepor texto;
- mapa aparece antes do briefing;
- tiles mantem dimensoes estaveis;
- links e botoes continuam clicaveis;
- textos nao devem estourar cards ou tiles.

## Acessibilidade

- Mapa deve ser uma lista ou conjunto de links semanticamente navegavel.
- Tiles clicaveis precisam ter texto real e foco visivel.
- Estados visuais nao podem depender somente de cor; labels ou texto auxiliar devem indicar estado.
- Contraste deve ser suficiente em fundo escuro.
- Territorios futuros nao clicaveis devem ser distinguiveis de links ativos.

## Testes

Como o incremento e principalmente visual, a verificacao deve cobrir:

- `npm run lint`;
- `npm run content:validate`;
- `npm run build`;
- inspecao em browser desktop e mobile, com screenshot se Playwright estiver disponivel;
- checagem manual de que o mapa nao fica em branco, nao sobrepoe texto e preserva links para fundamentos/sessoes.

## Fora de Escopo

- Persistir progresso real do usuario.
- Adicionar autenticacao.
- Criar mapa 3D/WebGL.
- Implementar personagens explicadores.
- Reestruturar paginas internas de fundamento/tarefa/sessao.
- Criar sistema completo de achievements.
- Importar dados de GitHub ou Awesome Radar.

## Criterios de Aceite

- A home nao parece mais um MVP generico.
- O primeiro viewport comunica StudyOps como mapa operacional de estudo.
- O Bloco 1 aparece como regiao ativa do mundo.
- Blocos futuros aparecem como extensao apagada do mapa.
- Fundamentos atuais continuam acessiveis.
- A primeira sessao de cada fundamento continua acessivel quando existir.
- Cards e painels indicam missao, tarefa, sessao ou evidencia, nao decoracao vazia.
- A interface funciona em desktop e mobile sem sobreposicao incoerente.
