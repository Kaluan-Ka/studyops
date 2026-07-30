---
name: StudyOps
description: Ambiente de estudo operacional para Engenharia de IA com mapa de progresso e cartas de missão.
colors:
  command-black: "#071016"
  orbital-navy: "#101725"
  mission-violet: "#1b1628"
  signal-green: "#8bf28e"
  telemetry-cyan: "#69d8ff"
  evidence-gold: "#ffd45d"
  parchment-panel: "#eef2e6"
  text-primary: "#edf6f1"
  text-muted: "#b7c9c7"
  locked-terrain: "#28313e"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "0"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 900
    letterSpacing: "0.06em"
rounded:
  control: "4px"
  panel: "8px"
  shell: "14px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-green}"
    textColor: "{colors.command-black}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  mission-card:
    backgroundColor: "{colors.parchment-panel}"
    textColor: "{colors.command-black}"
    rounded: "{rounded.control}"
    padding: "14px"
  operational-panel:
    backgroundColor: "{colors.orbital-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.panel}"
    padding: "16px"
  map-tile-current:
    backgroundColor: "{colors.telemetry-cyan}"
    textColor: "{colors.command-black}"
    size: "142px"
  map-tile-future:
    backgroundColor: "{colors.locked-terrain}"
    textColor: "{colors.text-muted}"
    size: "142px"
---

# Design System: StudyOps

## Overview

**Creative North Star: "Centro de Comando Orbital"**

StudyOps deve parecer uma mesa de operações observando um mundo de fundamentos. A interface combina linguagem de dashboard, atlas tático e boardgame: o usuário vê territórios, missões, progresso e evidências, mas sempre com clareza de estudo prático.

A identidade rejeita o MVP genérico de cards editoriais em fundo claro. Também rejeita gamificação decorativa: brilho, território, carta e painel só entram quando representam fundamento, status, tarefa, sessão, evidência ou próximo passo.

Fantasia é uma camada de explicação, não de decoração. Personagens, sessões narradas e linguagem de missão podem existir como camada 2, depois que o mundo já funciona como ferramenta de estudo. Um personagem só deve aparecer quando ajudar a explicar um fundamento, orientar uma missão, contextualizar uma evidência ou destravar o próximo passo.

### Referência canônica

A home atual em `src/app/page.tsx` e `src/app/page.module.css` é a referência canônica da identidade visual do StudyOps. Novas telas devem partir dela como linguagem-base: fundo de comando escuro, mapa/território como metáfora de progresso, painéis operacionais densos, cartas claras como objetos de missão e estados visuais ligados a ação real.

O documento `docs/design/home-canonica.md` registra como aplicar essa referência sem copiar a home literalmente para todas as telas. Quando houver conflito entre um padrão antigo e a home atual, a home vence para superfícies novas ou redesenhadas.

**Key Characteristics:**

- Mapa orbital/hexagonal como primeiro sinal da home.
- Painéis operacionais densos, legíveis e úteis.
- Cartas de missão inspiradas em cardgames, usadas para tarefas, sessões e evidências.
- Regiões futuras do mundo visíveis, mas apagadas.
- Progresso concluído mais colorido e luminoso que progresso bloqueado.

## Colors

A paleta mistura sala de comando escura, sinais de telemetria e cor de território conquistado.

### Primary

- **Command Black** (#071016): fundo principal das superfícies operacionais.
- **Signal Green** (#8bf28e): ação primária, progresso validado e estados vivos.
- **Telemetry Cyan** (#69d8ff): região em foco, órbitas, leitura técnica e destaque secundário.

### Secondary

- **Evidence Gold** (#ffd45d): evidência, conquista, item concluído e calor humano no sistema.
- **Mission Violet** (#1b1628): profundidade espacial e contraste em áreas de fundo.

### Neutral

- **Orbital Navy** (#101725): base de painéis e gradientes escuros.
- **Parchment Panel** (#eef2e6): interior de cartas de missão, para contraste tátil.
- **Text Primary** (#edf6f1): texto principal em fundos escuros.
- **Text Muted** (#b7c9c7): descrições e metadados.
- **Locked Terrain** (#28313e): territórios futuros ou itens ainda apagados.

### Named Rules

**The Evidence Lights the Map Rule.** Cores mais vivas indicam conclusão, foco ou evidência. Conteúdo ainda não iniciado deve parecer presente, mas adormecido.

**The Fantasy Serves the Study Rule.** Elementos narrativos devem carregar função pedagógica ou operacional. Se um elemento fantástico não muda o entendimento, a decisão ou a evidência produzida pelo usuário, ele deve sair ou voltar para uma evolução futura.

## Typography

**Display Font:** Inter com fallback system-ui.
**Body Font:** Inter com fallback system-ui.
**Label Font:** Inter em peso alto.

**Character:** A tipografia deve ser operacional e precisa. A personalidade vem de composição, molduras, mapas e contraste, não de fonte fantasiosa.

### Hierarchy

- **Display** (800, responsivo por breakpoint, 1.02): títulos de tela e afirmação principal da home.
- **Headline** (750-800, 24px-32px, 1.1): nomes de território, briefing e seções de alto nível.
- **Title** (700-800, 16px-22px, 1.25): cards, missões e fundamentos.
- **Body** (400-500, 15px-18px, 1.55): descrição de conteúdo e contexto.
- **Label** (900, 10px-12px, 0.06em, uppercase): telemetria, status e metadados operacionais.

## Layout

A home usa uma composição de duas zonas: mapa dominante à esquerda e briefing operacional à direita. Em desktop, o mapa deve ocupar a maior área do primeiro viewport; o painel lateral traduz a região ativa em missão, progresso, sessão recomendada e evidências. Em mobile, o mapa vem primeiro e o briefing empilha abaixo.

O mundo completo aparece como regiões: Bloco 1 ativo, blocos futuros apagados. O layout deve deixar claro que o app atual cobre só a primeira região, mas que a trilha completa tem escala maior.

Telas internas não precisam repetir o mapa orbital. Elas devem preservar a lógica da home: uma área principal para o objeto de estudo, uma área secundária para contexto/proximo passo quando útil, e cards apenas quando representarem tarefas, sessões, evidências ou decisões. Evite transformar páginas de leitura em dashboards decorativos.

## Elevation & Depth

Depth vem de camadas tonais, glow funcional e sombras duras de carta. Painéis operacionais usam pouco arredondamento e bordas finas. Cartas de missão podem ter sombra deslocada para lembrar peças físicas sobre mesa.

## Shapes

Hexágonos representam território e fundamento. Cards usam retângulos de cantos pequenos, molduras técnicas e eventuais recortes visuais. Botões e controles mantêm raio baixo para preservar a linguagem operacional.

## Components

### Map Tiles

- **Shape:** hexágono por `clip-path`.
- **Completed:** gradiente quente/verde com glow moderado.
- **Active:** cyan/verde com brilho mais evidente.
- **Locked:** azul-cinza escuro, baixo contraste, sem glow.

### Mission Cards

- **Shape:** retângulo com raio baixo e borda forte.
- **Color:** painel claro sobre mundo escuro.
- **Content:** tipo, título, resumo curto, evidência esperada ou ação.
- **Behavior:** hover e foco podem reforçar a sensação de peça física, mas sem deslocar layout de forma agressiva.

### Operational Panels

- **Shape:** painéis densos com borda fina.
- **Color:** fundos escuros translúcidos ou tonais.
- **Content:** briefing, progresso, links de ação e contexto da região ativa.
- **Data Rule:** barras, contadores e sinais devem representar conteúdo existente ou estado explicitamente derivado. Não usar percentuais aparentes quando não houver progresso persistido.
- **Progress Bar Rule:** barras de progresso ficam reservadas para progresso real persistido no Supabase. Antes disso, use contadores, inventário de conteúdo, checklist ou sinais não-percentuais.

### Buttons

- **Primary:** fundo Signal Green, texto Command Black, peso alto.
- **Secondary:** transparente com borda Signal Green ou Telemetry Cyan.
- **State:** hover pode aumentar borda/glow, sem deslocar layout.

## Do's and Don'ts

- Do: tornar o mapa a tese da home.
- Do: usar cards como objetos de missão, não como cards genéricos de dashboard.
- Do: mostrar regiões futuras apagadas para dar escala ao StudyOps.
- Do: conectar cor e brilho a progresso, foco e evidência.
- Do: usar a home como referência canônica para novas superfícies visuais.
- Do: usar personagens ou narração apenas quando eles explicarem fundamento, missão, evidência ou próximo passo.
- Don't: transformar estudo em pontuação vazia, ranking artificial ou conquistas sem evidência.
- Don't: adicionar fantasia como mascote, ornamento ou ruído visual antes de o fluxo de estudo estar útil.
- Don't: usar paleta monocromática verde ou visual SaaS genérico.
- Don't: esconder o próximo passo em decoração.
- Don't: copiar o mapa orbital para telas onde ele não ajuda a tarefa principal.
