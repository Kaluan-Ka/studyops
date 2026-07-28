---
id: TASK-000050
fundamento_id: FUN-000009
etapa_id: STEP-000025
title: Definir formato de chunk e metadados
slug: definir-formato-de-chunk-e-metadados
status: a_fazer
order: 50
expected_evidence:
  - nota_markdown
  - exemplo_reproduzivel
---

# Definir formato de chunk e metadados

Um chunk precisa continuar ligado a sua origem depois de passar por varias
etapas. Defina o formato antes de escrever o parser.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  fonte, chunks e metadados.
- `projetos-portfolio-ia.md`, `Projeto central: Local Research Searcher`, MVP.
- `content/fundamentos/pipeline-de-ingestao.md`, registro minimo.

## Formato sugerido

```json
{
  "source": "notas/cli.md",
  "chunk_index": 0,
  "content": "Uma CLI e uma interface local.",
  "metadata": {
    "format": "markdown",
    "title": "CLI"
  }
}
```

`source` responde de onde veio; `chunk_index` preserva ordem; `content` e o
material transformado; `metadata` guarda contexto que ajuda a interpretar o
trecho.

## Roteiro de estudo

1. Escolha uma nota curta.
2. Preencha um registro manualmente.
3. Remova cada campo e descreva qual informacao seria perdida.
4. Defina quais campos sao obrigatorios.
5. Registre o que fica fora do MVP.

## Perguntas de revisao

1. Por que o conteudo sozinho nao e suficiente?
2. Como a ordem pode ser reconstruida?
3. Que metadado ajuda a filtrar depois?
4. O formato permite testar a origem?

## Resultado esperado

- Exemplo versionado de um registro.
- Campos obrigatorios justificados.
- Nota sobre o que fica fora do primeiro formato.
