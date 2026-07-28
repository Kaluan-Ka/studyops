---
id: TASK-000046
fundamento_id: FUN-000008
etapa_id: STEP-000023
title: Capturar stdout e stderr
slug: capturar-stdout-e-stderr
status: a_fazer
order: 46
expected_evidence:
  - teste_automatizado
---

# Capturar stdout e stderr

Uma ferramenta pode produzir resultado valido e diagnostico no mesmo processo.
Separe os fluxos para que o consumidor nao confunda uma mensagem de erro com
dados do pipeline.

## Fontes usadas

- [`Testing`](https://github.com/jwasham/coding-interview-university#testing) e [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads), em `jwasham/coding-interview-university/README.md`.
- `projetos-portfolio-ia.md`, criterios de qualidade e limitacoes.
- `content/fundamentos/shell-e-processos.md`, stdout, stderr e exit code.

## Exemplo de contrato

```txt
sucesso: stdout="3 chunks", stderr="", code=0
falha: stdout="", stderr="arquivo ausente", code=1
```

O contrato nao precisa usar exatamente esses textos, mas precisa manter uma
regra consistente. Teste propriedades: sucesso nao deve misturar erro; falha
nao deve parecer uma saida valida.

## Roteiro de estudo

1. Crie um comando de sucesso.
2. Crie um comando que escreve stderr.
3. Observe os dois fluxos separadamente.
4. Transforme a observacao em teste.
5. Registre uma limitacao dependente do sistema operacional.

## Perguntas de revisao

1. Por que stdout nao deve conter logs de diagnostico?
2. O codigo de retorno substitui o texto de erro?
3. Qual evidencia mostra que os fluxos foram separados?
4. Como um worker deveria registrar sua falha?

## Resultado esperado

- Teste cobrindo stdout ou stderr.
- Erro nao confundido com resultado valido.
- Nota sobre o comportamento observado.
