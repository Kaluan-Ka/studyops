---
id: TASK-000058
fundamento_id: FUN-000010
etapa_id: STEP-000029
title: Testar contrato da API com adaptador falso
slug: testar-contrato-da-api-com-adaptador-falso
status: a_fazer
order: 58
expected_evidence:
  - teste_automatizado
---

# Testar contrato da API com adaptador falso

Teste o contrato HTTP sem depender de banco, modelo ou servico externo. O fake
fornece dados controlados; o teste prova o comportamento do endpoint.

## Fontes usadas

- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`, mocks e injecao de dependencia.
- [`Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http), em `donnemartin/system-design-primer/README.md`.
- `content/fundamentos/http-e-apis.md`, handler `getNote`.

## Exemplo de adaptador

```ts
const fakeNotes = {
  findById: (id: string) => id === "cli"
    ? { id: "cli", title: "CLI" }
    : undefined,
};
```

O endpoint recebe o adaptador e devolve `200` ou `404`. O teste nao deve provar
que o banco funciona; isso pertence a outra fronteira.

## Roteiro de estudo

1. Defina a interface minima do adaptador.
2. Passe o fake para o handler.
3. Teste recurso existente e ausente.
4. Verifique status e body.
5. Registre qual integracao real ainda falta.

## Perguntas de revisao

1. O que esta sendo isolado?
2. Por que o fake nao prova o banco?
3. Como a injecao deixa o teste possivel?
4. Qual teste de integracao seria o proximo?

## Resultado esperado

- Teste do contrato de entrada e saida.
- Dependencia externa substituida somente na fronteira necessaria.
- Falha esperada verificada.
