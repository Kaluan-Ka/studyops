---
id: FUN-000007
title: HTTP e APIs
slug: http-e-apis
status: a_estudar
order: 2
summary: Contrato request-response para expor ferramentas locais com recursos, metodos, dados e falhas observaveis.
steps:
  - id: STEP-000019
    title: Entender request, response e metodos
    order: 1
    expected_evidence:
      - nota_markdown
  - id: STEP-000020
    title: Implementar um endpoint minimo
    order: 2
    expected_evidence:
      - teste_automatizado
      - exemplo_reproduzivel
  - id: STEP-000021
    title: Aplicar a API no portfolio
    order: 3
    expected_evidence:
      - exemplo_reproduzivel
      - nota_markdown
---

# HTTP e APIs

## O que voce vai aprender

HTTP e uma forma padronizada de transportar uma mensagem entre cliente e
servidor. Uma API e o contrato que escolhe quais recursos podem ser acessados,
quais dados entram, qual metodo representa a operacao e como o servidor
comunica resultado ou falha.

No StudyOps, a meta nao e decorar todos os codigos HTTP nem construir uma API
publica. E aprender a pegar uma operacao local compreensivel — ler uma nota ou
receber um documento — e expo-la por uma fronteira que pode ser chamada e
testada.

## Modelo mental de uma requisicao

```txt
cliente
  |
  | metodo + caminho + headers + body
  v
servidor -> valida -> executa -> monta resposta
  ^
  | status + headers + body
  |
cliente
```

Uma requisicao deve ser lida nesta ordem:

1. **Metodo:** o tipo de intencao, como ler ou criar.
2. **Caminho:** o recurso, como `/notes/cli`.
3. **Headers:** metadados da mensagem, como tipo do corpo.
4. **Body:** dados enviados, quando a operacao precisa deles.

A resposta comunica pelo menos um status e, quando necessario, headers e body.
O cliente nao deve depender de uma frase escondida no log do servidor para
saber se a operacao funcionou.

## Metodos e contrato

O [`system-design-primer`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http) resume os metodos mais comuns desta forma:

| Metodo | Intencao no StudyOps | Exemplo |
| --- | --- | --- |
| `GET` | ler um recurso | `GET /notes/cli` |
| `POST` | criar ou disparar processamento | `POST /notes` |
| `PUT` | criar ou substituir um recurso conhecido | fora do primeiro MVP |
| `PATCH` | alterar parcialmente | fora do primeiro MVP |
| `DELETE` | remover | fora do primeiro MVP |

O primeiro endpoint deve usar o menor conjunto de operacoes que resolve o
experimento. Adicionar um metodo porque ele existe no protocolo nao melhora o
contrato.

## Exemplo guiado em TypeScript

Este handler e pseudocodigo executavel apenas depois de conectado a um servidor
HTTP. O valor didatico esta em separar contrato, validacao e resposta:

```ts
type Note = { id: string; title: string; body: string };

function getNoteResponse(note: Note | undefined) {
  if (!note) {
    return {
      status: 404,
      body: { error: "note_not_found" },
    };
  }

  return {
    status: 200,
    body: note,
  };
}
```

O handler nao conhece TCP, portas ou banco. Ele recebe o resultado de uma
consulta e transforma estados da aplicacao em um contrato de resposta. Essa
fronteira pode ser testada com um objeto em memoria antes de ser ligada ao
servidor.

## Exemplo de chamada

```bash
curl -i http://localhost:3000/notes/cli
```

Resposta de sucesso:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":"cli","title":"CLI","body":"Entrada e saida"}
```

Resposta de recurso inexistente:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{"error":"note_not_found"}
```

O ponto importante e a diferenca entre resultado e diagnostico: a API informa
ao cliente um estado que ele consegue tratar programaticamente.

## O que foi extraido das fontes

- A secao [`Communication > Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http) do
  `donnemartin/system-design-primer/README.md` foi convertida em modelo de
  request/response, recurso, metodo, status e relacao com TCP/UDP.
- A secao [`Build your own Web Server`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-web-server) do
  `codecrafters-io/build-your-own-x/README.md` foi usada para escolher a
  progressao: observar um servidor minimo antes de adicionar framework ou
  infraestrutura.
- O item `Web servers/APIs` de `trilha-engenharia-ia.md` define a finalidade:
  expor funcionalidades de IA por HTTP.
- Os projetos Mini Redis, ingestao de documentos e `Local Research Searcher`
  em `projetos-portfolio-ia.md` fornecem operacoes concretas para o endpoint.

## Erros comuns

- Criar endpoint sem contrato de entrada e saida.
- Usar `POST` para toda operacao por desconhecer `GET`.
- Retornar sempre status de sucesso e colocar o erro apenas no body.
- Misturar regra de negocio, leitura de banco e montagem da resposta no mesmo
  bloco.
- Adicionar autenticacao, rate limit e escalabilidade antes de provar a
  operacao local.

## Perguntas de revisao

1. Quais partes formam uma requisicao HTTP?
2. Quando `GET` e mais adequado que `POST` neste bloco?
3. Por que `404` e diferente de `200` com uma lista vazia?
4. Qual parte do handler pode ser testada sem servidor?
5. Que informacao deveria estar no body e qual deveria estar no status?

## Onde aparece no portfolio

Como API local do `Local Research Searcher`, endpoint de recebimento do sistema
de ingestao e demonstracao HTTP do Mini Redis. O primeiro ciclo deve operar
localmente, com poucos recursos e sem autenticacao.

## Metodo de estudo

1. Escreva uma tabela de recurso, metodo, entrada, resposta e falha.
2. Modele o handler em memoria.
3. Teste sucesso e ausencia do recurso.
4. Ligue o handler a uma rota local.
5. Execute uma chamada com `curl` e guarde a resposta como evidencia.

Ao revisar o contrato, tente quebrá-lo com três perguntas: o que acontece com
um recurso inexistente, com um corpo malformado e com um método não suportado?
Cada pergunta deve produzir um resultado que o cliente consiga tratar. Isso
mantém o exercício no nível certo: aprender a fronteira request/response sem
prometer uma arquitetura pública ou um sistema distribuído.

## Proxima aplicacao

Expor a leitura de uma nota do `Local Research Searcher` por `GET` e deixar a
criacao de notas para uma tarefa posterior, quando o contrato de persistencia
estiver definido.
