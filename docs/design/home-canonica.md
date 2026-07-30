# Home Canonica do StudyOps

Este documento transforma a home atual em referencia canonica para novas superficies do StudyOps. Ele nao substitui `DESIGN.md`; ele explica como aplicar a home sem copiar a mesma composicao em todos os lugares.

## Fonte canonica

- Implementacao: `src/app/page.tsx`
- Estilos: `src/app/page.module.css`
- Modelo visual: Centro de Comando Orbital
- Escopo atual: home do MVP com conteudo Markdown/frontmatter existente

Quando uma tela nova precisar de direcao visual, comece por estes arquivos. Quando houver conflito entre uma tela antiga e a home atual, a home deve orientar a evolucao futura.

## O que a home canoniza

### 1. Estudo como operacao

A interface deve ajudar o usuario a responder o que esta estudando agora, onde isso aparece na trilha e qual e o proximo passo pratico. O visual operacional existe para organizar decisao e acao, nao para decorar.

Use:

- briefing;
- estado atual;
- proxima sessao;
- tarefa ou missao;
- evidencia esperada.

Evite:

- metricas inventadas;
- conquistas sem evidencia;
- ranking ou pontuacao que nao exista no conteudo real.

### 2. Mundo visual

A home define a linguagem principal: fundo escuro de comando, mapa orbital/hexagonal, sinais de telemetria, cartas claras e territorios futuros apagados.

Novas telas devem herdar o clima e os tokens, mas nao precisam repetir o mapa. Uma pagina de leitura pode ser mais calma; uma pagina de tarefas pode usar cartas; um dashboard pode usar briefing e paineis densos.

A fantasia deve entrar com cuidado. Primeiro, o mundo precisa funcionar como ferramenta de estudo: orientar fundamento, missao, evidencia e proximo passo. Personagens, sessoes narradas e vozes de missao pertencem a uma segunda camada, usada somente quando explicar melhor o conteudo ou a acao. O personagem ideal nao decora a tela; ele traduz um fundamento, chama atencao para uma evidencia ou ajuda a destravar a proxima aplicacao.

### 3. Componentes de referencia

**Mapa de fundamentos**

Use hexagonos para territorio, fundamento ou regiao de trilha. Tiles clicaveis devem ter hover/foco claro. Territorios futuros devem parecer presentes, mas adormecidos, e nao devem reagir como links.

**Briefing operacional**

Use para resumir estado, contexto e proximo passo. Barras e sinais devem representar conteudo existente ou estado explicitamente derivado. Nao usar percentuais aparentes quando ainda nao houver progresso persistido.

Decisao registrada em 2026-07-28: a home nao deve usar barra de progresso enquanto o progresso real ainda nao estiver persistido no Supabase. Ate la, o briefing deve usar contadores, inventario de conteudo, checklist ou sinais nao-percentuais. A barra volta quando houver dados reais de progresso do usuario, como evidencias concluidas, tarefas finalizadas ou ciclos registrados.

**Cartas de missao**

Use cartas claras sobre fundo escuro para tarefas, fundamentos, sessoes e evidencias esperadas. A carta deve carregar acao ou decisao; se for apenas agrupamento visual, use painel ou secao sem carta.

**Paineis de resumo**

Use paineis escuros para contadores e contexto agregado. Contadores devem vir do conteudo existente, nao de estimativas narrativas.

## Regras praticas para novas telas

- Comece com o objeto principal da tarefa, nao com uma landing page.
- Use Signal Green para acao primaria, progresso validado e estados vivos.
- Use Telemetry Cyan para foco, navegacao tecnica e destaque secundario.
- Use Evidence Gold para evidencias, numeros e calor de conquista real.
- Use Parchment Panel para cartas de missao, nao para paineis genericos.
- Mantenha baixo arredondamento em botoes, paineis e cartas.
- Garanta foco visivel em todos os links e controles.
- Em mobile, preserve o mapa ou objeto principal antes do briefing.
- Nao introduza IA, Supabase, importacao externa ou progresso persistido apenas por necessidade visual.
- Reserve barras de progresso para progresso real vindo do Supabase; antes disso, use somente contadores e sinais de inventario.
- Trate personagens e narracao como camada 2: nunca devem competir com o objeto principal da tarefa.

## Criterio de compatibilidade

Uma nova tela esta alinhada com a home canonica quando:

- o usuario entende o estado atual e o proximo passo em poucos segundos;
- cada card, brilho, mapa ou contador representa algo real;
- qualquer personagem ou narracao ajuda a entender fundamento, missao, evidencia ou proximo passo;
- a tela parece parte do StudyOps mesmo sem repetir a home literalmente;
- a interface funciona em desktop e mobile sem sobreposicao;
- a decisao visual pode ser explicada a partir de `DESIGN.md`.
