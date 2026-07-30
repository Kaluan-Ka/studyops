---
id: TASK-000038
fundamento_id: FUN-000007
etapa_id: STEP-000019
title: Comparar metodos HTTP do exercicio
slug: comparar-metodos-http-do-exercicio
status: a_fazer
order: 38
goal: Escolher metodos HTTP pela intencao da operacao, nao por habito ou conveniencia.
expected_evidence:
  - nota_markdown
---

# Comparar metodos HTTP do exercicio

O metodo deve comunicar a intencao da operacao. Escolher entre `GET` e `POST`
e um exercicio de modelagem, nao uma decisao cosmetica.

## Fontes usadas

- [`Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http), em `donnemartin/system-design-primer/README.md`, tabela de verbos.
- `projetos-portfolio-ia.md`, MVP do `Local Research Searcher`.

## Comparacao guiada

| Pergunta | `GET /notes/cli` | `POST /notes` |
| --- | --- | --- |
| Le ou cria? | le | cria |
| Precisa de body? | normalmente nao | sim |
| Pode repetir sem criar outra nota? | sim | depende da regra |
| Uso no bloco? | consulta | entrada de documento |

O [`system-design-primer`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http) descreve `GET` como leitura e `POST` como criacao ou
disparo de um processo. Use essa distincao para escrever o contrato, mas nao
adicione `PUT`, `PATCH` e `DELETE` apenas para preencher uma tabela.

## Roteiro de estudo

1. Liste as duas operacoes que o portfolio realmente precisa.
2. Escolha o metodo para cada uma.
3. Escreva uma chamada e resposta de exemplo.
4. Registre o que aconteceria se a chamada fosse repetida.
5. Explique qual operacao fica para outra etapa.

## Perguntas de revisao

1. Por que uma leitura e diferente de criar um recurso?
2. O que significa repetir uma chamada sem alterar o resultado?
3. Quando um `POST` pode disparar processamento?
4. Que metodo voce nao precisa implementar agora?

## Resultado esperado

- Nota distinguindo leitura e criacao.
- Contrato reduzido a no maximo duas operacoes iniciais.
- Justificativa para deixar os demais metodos como evolucao.
