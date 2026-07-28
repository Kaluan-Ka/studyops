# Mapa detalhado de fontes — Bloco 1

Data: 2026-07-27

Este mapa aprofunda somente claims que podem aparecer nas sessões e tarefas do
lote atual. As fontes externas são usadas como método, vocabulário e referência
de arquitetura; os requisitos do StudyOps continuam vindo de
`trilha-engenharia-ia.md`, `projetos-portfolio-ia.md` e `AGENTS.md`.

## CLI para ferramentas

- Planning anchors:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, item `CLI tools`.
  - `projetos-portfolio-ia.md`: `## Projeto 3: Sistema de ingestao de documentos`, script local para ler arquivos e preparar dados.
- External sources:
  - [`Build your own Command-Line Tool`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool), em `codecrafters-io/build-your-own-x/README.md`: usar reconstrução pequena como método de aprendizagem, sem tratar o índice como especificação de uma biblioteca.
  - [`How to use it`](https://github.com/jwasham/coding-interview-university#how-to-use-it) e [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan), em `jwasham/coding-interview-university/README.md`: estudar em ordem, escrever implementação própria e testar o comportamento com entradas observáveis.
- Approved detailed claims:
  - Uma CLI é uma fronteira observável: recebe argumentos/entrada, valida, processa e comunica resultado por saída e código de retorno. A decomposição é uma aplicação didática do método build-your-own, não uma afirmação atribuída ao índice.
  - Separar parsing, núcleo de processamento e entrypoint torna possível testar a lógica sem iniciar o processo; a execução real ainda precisa de uma evidência de contrato.
- Portfolio application: CLI local para TXT/Markdown que alimenta o pipeline de ingestão e, depois, comandos de manutenção do `Local Research Searcher`.
- Scope cut: nenhuma biblioteca de CLI, autenticação, persistência ou importação de repositório é requisito.

## HTTP e APIs

- Planning anchors:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, item `Web servers/APIs`.
  - `projetos-portfolio-ia.md`: `## Projeto central: Local Research Searcher` e `## Projeto 3: Sistema de ingestao de documentos`.
- External sources:
  - [`Build your own Web Server`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-web-server), em `codecrafters-io/build-your-own-x/README.md`: progressão de aprendizagem por um servidor mínimo, sem atribuir detalhes dos tutoriais listados ao repositório índice.
  - [`Hypertext transfer protocol (HTTP)`](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http), em `donnemartin/system-design-primer/README.md`: HTTP como protocolo de request/response, com método, recurso, dados e status.
- Approved detailed claims:
  - O contrato mínimo de uma API deve tornar explícitos método, caminho/recurso, entrada, status e corpo da resposta.
  - Um handler pode ser testado em memória antes de ser conectado a servidor, porta ou persistência; `404` e `200` representam estados diferentes para o cliente.
- Portfolio application: endpoint local de leitura de nota e endpoint futuro de recebimento de documento para o `Local Research Searcher`.
- Scope cut: não exigir autenticação, rate limiting, escalabilidade, Supabase ou chamadas de modelo.

## Shell e processos

- Planning anchors:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, item `Shell/processos`.
  - `projetos-portfolio-ia.md`: `## Projeto 3: Sistema de ingestao de documentos`, separação entre receber e processar arquivo.
- External sources:
  - [`Build your own Shell`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-shell), em `codecrafters-io/build-your-own-x/README.md`: método de reconstruir uma ferramenta pequena para observar a fronteira entre comando e execução.
  - [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads), em `jwasham/coding-interview-university/README.md`: tópico de estudo para diferenciar processo, thread e recursos, sem prometer domínio de concorrência.
  - [`Asynchronism`](https://github.com/donnemartin/system-design-primer#asynchronism), [`Message queues`](https://github.com/donnemartin/system-design-primer#message-queues), [`Task queues`](https://github.com/donnemartin/system-design-primer#task-queues) e [`Back pressure`](https://github.com/donnemartin/system-design-primer#back-pressure), em `donnemartin/system-design-primer/README.md`: comparação de trabalho em background, fila limitada e custo de desacoplamento.
- Approved detailed claims:
  - O shell inicia comandos; o processo é a execução concreta; stdout, stderr e código de retorno são observações diferentes do mesmo experimento.
  - Um worker pode retirar trabalho demorado do caminho principal, mas introduz estados, falhas e necessidade de sinalização; antes disso, deve existir um fluxo síncrono medido.
- Portfolio application: entrypoint local do pipeline e futura separação entre recebimento de documento e processamento.
- Scope cut: worker real, fila distribuída, retry sofisticado e back pressure ficam como comparação futura, não como requisito do MVP.

## Pipeline de ingestão

- Planning anchors:
  - `trilha-engenharia-ia.md`: script de ingestão que lê arquivos, quebra em trechos e salva dados.
  - `projetos-portfolio-ia.md`: `## Projeto 3: Sistema de ingestao de documentos` e `## Projeto central: Local Research Searcher`.
- External sources:
  - [`Message queues`](https://github.com/donnemartin/system-design-primer#message-queues) e [`Task queues`](https://github.com/donnemartin/system-design-primer#task-queues), em `donnemartin/system-design-primer/README.md`: sustentam somente a comparação entre fluxo síncrono e processamento em background.
  - [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan) e [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`: implementação própria e verificação incremental.
- Approved detailed claims:
  - O pipeline deve explicitar receber, validar, extrair, transformar, anexar fonte/metadados e entregar ou persistir registros.
  - `source`, índice do chunk e conteúdo são parte da rastreabilidade mínima; a regra de chunking deve ser simples e experimental, não apresentada como universal.
  - Fila/worker só devem ser comparados depois que a versão síncrona revelar um custo ou bloqueio concreto.
- Portfolio application: transformar TXT/Markdown em chunks pesquisáveis para o sistema de ingestão e o `Local Research Searcher`.
- Scope cut: sem banco, busca textual, embeddings, RAG ou fila real neste lote.

## Testes e evidências

- Planning anchors:
  - `trilha-engenharia-ia.md`: `## Metodo semanal` e `## Criterio de sucesso`.
  - `projetos-portfolio-ia.md`: `## Principios` e `## Criterios de qualidade para todos os projetos`.
- External sources:
  - [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`: testar comportamentos em níveis adequados e usar mocks/injeção somente quando uma fronteira externa real exigir isolamento.
  - [`Build your own Database`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-database), em `codecrafters-io/build-your-own-x/README.md`: referência de exercícios pequenos orientados por testes; não é requisito construir um banco neste bloco.
- Approved detailed claims:
  - A pergunta de teste deve escolher o nível: função, handler, processo ou aceite do pipeline. Um fake isola uma fronteira, mas não prova a integração real substituída.
  - Uma evidência útil contém entrada, resultado e interpretação/limitação; leitura sem nota, teste ou artefato não fecha o ciclo.
- Portfolio application: validar núcleo da CLI, contrato da API, execução de processo e preservação de fonte/chunk no pipeline.
- Scope cut: mocks e injeção de dependência são opcionais; não incluir infraestrutura externa ou testes de performance avançados.

## Claims mantidos como comparação futura

- Fila real, worker distribuído e back pressure: servem para decidir uma evolução do pipeline depois de medir bloqueio, volume ou tempo de processamento.
- Persistência, busca textual, cache, Docker, embeddings e RAG: pertencem a blocos/projetos posteriores e não devem aparecer como pré-requisito das tarefas deste lote.
