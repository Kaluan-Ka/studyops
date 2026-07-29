---
target: home
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-07-28T20-26-02Z
slug: src-app-page-tsx
---
Method: dual-agent (A: 019faa58-5d03-7fd1-bb6a-b45a2d5ec559 · B: 019faa58-5d39-7bd3-9df3-73b0d61838d0)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Estados existem, mas a barra de "Região ativa" parece progresso completo sem progresso persistido. |
| 2 | Match System / Real World | 4 | A metáfora operacional fala muito bem a linguagem do StudyOps. |
| 3 | User Control and Freedom | 3 | Navegação e links são claros; falta estado ativo/localização nas âncoras. |
| 4 | Consistency and Standards | 3 | Sistema visual coeso; "Iniciar sessão" e "Começar sessão" divergem. |
| 5 | Error Prevention | 2 | "A estudar" e barra cheia podem induzir leitura errada de progresso. |
| 6 | Recognition Rather Than Recall | 3 | Opções ficam visíveis, mas o próximo passo some tarde demais no mobile. |
| 7 | Flexibility and Efficiency | 2 | Poucos aceleradores para uso recorrente, como "continuar de onde parei". |
| 8 | Aesthetic and Minimalist Design | 3 | Forte e memorável, mas o mapa ocupa espaço demais antes da ação operacional. |
| 9 | Error Recovery | 2 | Home tem poucos fluxos de erro; empty states e ausência de conteúdo não estão desenhados. |
| 10 | Help and Documentation | 2 | A copy orienta, mas não há ajuda contextual para o método ou termos operacionais. |
| **Total** | | **26/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: A home é autoral para StudyOps, não intercambiável. O mapa orbital/hexagonal, o briefing operacional, os territórios futuros apagados e as cartas claras de missão formam uma linguagem própria e coerente com "Centro de Comando Orbital". O produto aparece como método visual: referência, fundamento, implementação, projeto, evidência e próximo passo. O maior risco não é blandness; é a superfície comunicar "mundo de estudo" com mais força do que "operação executável agora", especialmente no mobile.

**Deterministic scan**: O detector CLI em `src/app/page.tsx` retornou `[]`, exit code `0`, sem achados por arquivo ou linha. O overlay em browser headless encontrou 50 anti-patterns, com logs individuais agrupados como: `low-contrast` 19, `undersized-ui-text` 16, `ai-color-palette` 7, `dark-glow` 7, `repeated-container-text` 2, `nested-cards` 2, `all-caps-body` 1, `hero-eyebrow-chip` 1, `overused-font` 1, `single-font` 1.

**Detector interpretation**: `ai-color-palette`, `dark-glow`, `overused-font` e `single-font` são majoritariamente falsos positivos diante de `DESIGN.md`, que define cyan, green, glow funcional e Inter como identidade. `repeated-container-text` também parece intencional para estados repetidos. Os sinais que merecem revisão manual são `low-contrast`, `undersized-ui-text`, `nested-cards` e alguns labels all-caps, especialmente em mobile e nos tiles pequenos.

**Visual overlays**: A injeção em headless funcionou e o overlay DOM ficou presente. Não houve aba humana visível neste harness; a evidência confiável é screenshot, console e inspeção manual.

## Overall Impression

A home tem uma tese visual forte: estudar IA como operar um mapa de fundamentos. Ela já parece StudyOps mesmo sem o nome no topo. O ponto que segura a experiência é que a ação prática fica subordinada ao espetáculo do mapa. No desktop isso é aceitável; no mobile vira custo real, porque o botão `Iniciar sessão` aparece apenas por volta de `y=2134px` em viewport 390x844.

## What's Working

1. **Identidade específica e defensável**: hexágonos, órbitas, tiles futuros apagados e cartas claras não parecem um dashboard genérico.
2. **Produto e método estão no layout**: mapa, briefing, missão e evidência expressam o ciclo do StudyOps sem depender de texto explicativo excessivo.
3. **Semântica básica sólida**: `header`, `nav`, `main`, seções com `aria-labelledby`, links reais e foco visível aparecem no código.

## Priority Issues

**[P1] Barra e estados sugerem progresso que ainda não existe**

**Why it matters**: A regra canônica do StudyOps é não inventar progresso. A barra de `width: 100%` em `.progressTrack div` faz a "Região ativa" parecer concluída ou totalmente preenchida, quando hoje ela representa inventário de conteúdo.

**Fix**: Trocar a barra por um "inventário da região" visual, sem leitura percentual, ou calcular progresso real quando evidências persistidas existirem. O copy deve dizer explicitamente o que é medido hoje.

**Suggested command**: `$impeccable clarify`

**[P1] A ação principal perde força no mobile**

**Why it matters**: Para uma superfície Operate, "estudar agora" precisa aparecer cedo. Na captura mobile 390x844, o briefing começa em torno de `y=1380px` e `Iniciar sessão` só em `y=2134px`, depois de mais de duas telas.

**Fix**: Criar uma faixa compacta de missão atual logo abaixo do hero no mobile, ou reduzir o mapa inicial e mover `Iniciar sessão` para antes do mapa completo. Outra opção: deixar o mapa como exploração secundária quando o usuário já tem uma próxima sessão.

**Suggested command**: `$impeccable adapt`

**[P2] O mapa é bonito, mas frágil para escala real**

**Why it matters**: As posições são hard-coded para cinco fundamentos e três regiões futuras. Se o conteúdo crescer, a composição pode quebrar, sobrepor textos ou perder a ordem mental da trilha.

**Fix**: Definir capacidade explícita para a home: máximo de tiles no mapa, regra de agrupamento, overflow para "mais fundamentos" ou layout gerado por dados com posições derivadas.

**Suggested command**: `$impeccable layout`

**[P2] Estados e acessibilidade precisam de endurecimento**

**Why it matters**: Há foco visível, mas tiles absolutos, `clip-path`, `display: contents` nos `li`, labels pequenos e motion hover sem cobertura ampla de `prefers-reduced-motion` aumentam risco para teclado, leitor de tela e baixa visão.

**Fix**: Revisar ordem de foco versus ordem visual, anunciar estado atual com `aria-current` ou texto mais explícito, elevar touch targets para pelo menos 44px em mobile, revisar contraste real dos labels pequenos e ampliar reduced motion para hover de tiles/cards.

**Suggested command**: `$impeccable audit`

**[P3] Copy sem acentos reduz acabamento**

**Why it matters**: "Missoes", "sessoes", "evidencias" e "regiao" deixam cheiro de protótipo técnico em uma interface portuguesa que, visualmente, já está bem mais madura.

**Fix**: Acentuar a UI visível e padronizar "Iniciar sessão" versus "Começar sessão".

**Suggested command**: `$impeccable polish`

## Persona Red Flags

**Alex (Power User)**: Encontra a missão no desktop, mas não tem caminho rápido tipo "continuar de onde parei", recentes, favoritos ou atalhos. No mobile, precisa rolar demais para começar.

**Sam (Accessibility-Dependent User)**: Links são focáveis, mas a ordem linear do mapa absoluto pode não corresponder à organização visual. O estado "Em foco" é textual, mas não é anunciado como localização atual ou seleção operacional.

**Casey (Distracted Mobile User)**: A ação útil fica fora da primeira e da segunda tela. O usuário abre para estudar agora e recebe primeiro exploração, mapa inteiro, legenda e só depois ação.

## Minor Observations

- Os tiles "A estudar" brilham quase como conquistados; podem parecer mais avançados do que estão.
- O resumo operacional final é correto, mas pouco acionável.
- "Markdown versionado" é verdadeiro, mas soa mais como detalhe de implementação do que benefício direto.
- O deck de cartas no desktop é bonito, mas repete ações para todos os fundamentos antes de priorizar a missão atual.
- O detector de runtime acusa muitos labels pequenos; alguns são falsos positivos, mas vale revisar os textos dentro dos hexágonos em mobile.

## Questions to Consider

1. Se a home é modo Operate, por que o botão de próxima sessão não aparece imediatamente abaixo do H1 em mobile?
2. O que exatamente a barra "Região ativa" mede hoje: disponibilidade de conteúdo, progresso de estudo ou evidência produzida?
3. Um fundamento "A estudar" deve brilhar em verde/dourado, ou deveria parecer disponível mas ainda não aceso?
