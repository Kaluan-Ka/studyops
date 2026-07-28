---
id: TASK-000051
fundamento_id: FUN-000009
etapa_id: STEP-000026
title: Implementar ingestao de TXT e Markdown
slug: implementar-ingestao-de-txt-e-markdown
status: a_fazer
order: 51
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Implementar ingestao de TXT e Markdown

Implemente primeiro o fluxo sincrono e local. A meta e obter registros
reproduziveis, nao suportar todos os formatos de documento.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  MVP de TXT e Markdown.
- `trilha-engenharia-ia.md`, projeto de script de ingestao.
- `content/fundamentos/pipeline-de-ingestao.md`, exemplo de `chunkText`.

## Pseudocodigo executavel

```ts
function ingest(source: string, format: "txt" | "markdown", text: string) {
  if (!text.trim()) throw new Error("arquivo vazio");

  return chunkText(source, text, 80, format);
}
```

O parser deve receber texto e origem como argumentos. Assim, leitura de disco,
transformacao e persistencia podem ser testadas em separado.

## Roteiro de implementacao

1. Crie uma fixture TXT.
2. Crie uma fixture Markdown.
3. Leia cada fixture no entrypoint.
4. Chame `ingest` com formato e origem.
5. Salve ou imprima os chunks gerados.
6. Compare a saida com o formato definido.

## Perguntas de revisao

1. Onde o formato e validado?
2. O parser sabe onde o arquivo estava?
3. O que acontece com texto vazio?
4. Qual parte esta pronta para receber um teste unitario?

## Resultado esperado

- Fixture TXT e Markdown processadas.
- Teste do resultado produzido.
- Exemplo de registros gerados.
