---
id: TASK-000059
fundamento_id: FUN-000010
etapa_id: STEP-000030
title: Executar aceite do pipeline
slug: executar-aceite-do-pipeline
status: a_fazer
order: 59
goal: Validar o pipeline ponta a ponta com um criterio de aceite simples e reproduzivel.
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Executar aceite do pipeline

O aceite verifica o fluxo completo com fixtures conhecidas. Ele nao substitui
testes unitarios; responde se as etapas ainda funcionam juntas.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  fluxo de arquivo ate chunk.
- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`.
- `content/fundamentos/pipeline-de-ingestao.md`, registro e etapas.

## Roteiro de aceite

```txt
entrada: fixtures/cli.md
esperado:
  - formato reconhecido
  - source preservado
  - chunk_index comecando em 0
  - conteudo nao vazio
  - saida reproduzivel
```

Execute tambem uma fixture vazia e uma extensao fora do escopo. O aceite deve
mostrar resultado e falha, nao apenas o caso feliz.

## Perguntas de revisao

1. Qual etapa falhou quando a fonte desaparece?
2. O aceite depende de uma ordem de arquivos?
3. Que resultado precisa ser comparado textualmente?
4. Qual limitacao deve acompanhar a evidencia?

## Resultado esperado

- Execucao automatizada ou roteiro reproduzivel.
- Fonte e conteudo verificados no resultado.
- Caso invalido registrado.
