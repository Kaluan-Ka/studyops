---
id: TASK-000047
fundamento_id: FUN-000008
etapa_id: STEP-000024
title: Criar entrypoint de ingestao
slug: criar-entrypoint-de-ingestao
status: a_fazer
order: 47
expected_evidence:
  - exemplo_reproduzivel
---

# Criar entrypoint de ingestao

Crie um comando que represente a entrada do sistema de ingestao. Ele deve
receber o arquivo, validar a entrada e chamar a funcao de processamento, sem
esconder a fronteira entre as duas coisas.

## Fontes usadas

- `trilha-engenharia-ia.md`, projeto de script de ingestao.
- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`.
- `content/fundamentos/pipeline-de-ingestao.md`, etapas do fluxo.

## Fluxo esperado

```txt
studyops-ingest notas/cli.md
       |
       +--> valida caminho e formato
       +--> le arquivo
       +--> chama ingest(text, source)
       +--> imprime resultado ou erro
```

O entrypoint nao deve decidir como chunks sao formados. Essa regra pertence ao
modulo de ingestao, que podera ser testado diretamente.

## Roteiro de implementacao

1. Crie uma fixture de entrada.
2. Execute com caminho valido.
3. Execute com caminho ausente.
4. Verifique o codigo de retorno.
5. Registre qual funcao recebe o texto ja lido.

## Perguntas de revisao

1. Qual responsabilidade fica no entrypoint?
2. Por que o parser de chunks deve ficar separado?
3. O que acontece com um arquivo invalido?
4. Como o comando sera chamado por um teste?

## Resultado esperado

- Um comando de entrada documentado.
- Fixture de arquivo pequena.
- Saida ou registro de processamento reproduzivel.
