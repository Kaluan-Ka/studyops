# Source map — Bloco 1: Ferramentas para empacotar IA

Data: 2026-07-27

## Decisao de escopo

O primeiro lote real segue o Bloco 1 de `trilha-engenharia-ia.md`, chamado
"Ferramentas para empacotar IA". O bloco explicita tres eixos: CLI tools, web
servers/APIs e shell/processos. Para transformar esses eixos em um lote
praticavel de cinco fundamentos, foram incluidos dois fundamentos de suporte
que aparecem nos projetos recomendados, no metodo de estudo e nos criterios de
qualidade: pipeline de ingestao e testes/evidencias.

O lote proposto continua pequeno: 5 fundamentos, 3 etapas por fundamento e 2
tarefas por etapa. O conteudo editorial atual em `content/` e apenas estrutura
temporaria e nao foi usado como fonte factual.

## Ordem proposta

1. CLI para ferramentas
2. HTTP e APIs
3. Shell e processos
4. Pipeline de ingestao
5. Testes e evidencias

Essa ordem vai da interface de entrada, passa pela exposicao de servicos,
explica a execucao no sistema operacional, aplica os conceitos no fluxo de
documentos e fecha cada ciclo com verificacao reproduzivel.

## CLI para ferramentas

- Planning anchor:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, itens `CLI tools` e `Projetos recomendados`.
  - `projetos-portfolio-ia.md`: `## Projeto central: Local Research Searcher`, MVP de cadastrar notas e links; `## Projeto 3: Sistema de ingestao de documentos`, entrada de arquivos.
- Repository sources:
  - `codecrafters-io/build-your-own-x` `README.md`, secao `Build your own Command-Line Tool`: mapa de guias para recriar ferramentas de linha de comando em pequenos projetos.
  - `jwasham/coding-interview-university` `README.md`, secoes `How to use it` e `The Daily Plan`: uso de checklist, ordem e implementacao propria como metodo de estudo.
- Candidate claims:
  - Claim: uma CLI pode ser estudada como uma ferramenta pequena e concreta, com entrada, processamento e saida verificaveis.
    Evidence: `codecrafters-io/build-your-own-x/README.md`, `Build your own Command-Line Tool`; `trilha-engenharia-ia.md`, `CLI tools`.
    Portfolio use: CLI para indexar documentos locais e comandos auxiliares do `Local Research Searcher`.
  - Claim: o ciclo de estudo deve transformar o topico em implementacao propria e checklist, nao apenas leitura.
    Evidence: `jwasham/coding-interview-university/README.md`, `How to use it` e `The Daily Plan`.
    Portfolio use: registrar comando implementado, exemplo de uso e nota de limitacoes.
- Curatorial risk: nao transformar a tarefa em estudo de frameworks de CLI; o MVP deve produzir um comando minimo para um fluxo real.

## HTTP e APIs

- Planning anchor:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, item `Web servers/APIs` e projeto de API simples.
  - `projetos-portfolio-ia.md`: `## Projeto 1: Mini Redis aplicado a IA`, API HTTP simples; `## Projeto 3: Sistema de ingestao de documentos`, entrada de arquivos; `## Projeto central: Local Research Searcher`, MVP local.
- Repository sources:
  - `codecrafters-io/build-your-own-x` `README.md`, secao `Build your own Web Server`: guias para construir servidores web e APIs REST do zero.
  - `donnemartin/system-design-primer` `README.md`, secao `Communication > Hypertext transfer protocol (HTTP)`: modelo request/response, recursos, verbos HTTP e relacao com TCP/UDP.
- Candidate claims:
  - Claim: HTTP organiza a comunicacao entre cliente e servidor como requisicao e resposta; metodos e recursos fazem parte do contrato da API.
    Evidence: `donnemartin/system-design-primer/README.md`, `Communication > Hypertext transfer protocol (HTTP)`.
    Portfolio use: expor consulta de notas, ingestao de arquivo ou comando do Mini Redis por endpoint pequeno.
  - Claim: construir um servidor minimo e uma forma pratica de observar o caminho entre protocolo, endpoint e resposta.
    Evidence: `codecrafters-io/build-your-own-x/README.md`, `Build your own Web Server`.
    Portfolio use: API local do `Local Research Searcher` antes de integrar autenticacao ou Supabase.
- Curatorial risk: nao introduzir escalabilidade, autenticacao ou framework web como requisito do primeiro ciclo; primeiro validar contrato e resposta local.

## Shell e processos

- Planning anchor:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, item `Shell/processos`.
  - `projetos-portfolio-ia.md`: `## Projeto 3: Sistema de ingestao de documentos`, separacao entre receber arquivo e processar arquivo; `Metodo de arquitetura`, processamento assincrono.
- Repository sources:
  - `codecrafters-io/build-your-own-x` `README.md`, secao `Build your own Shell`: guias para recriar um shell e explorar comandos do sistema.
  - `jwasham/coding-interview-university` `README.md`, secao `Processes and Threads`: processos, threads, concorrencia, locks e recursos de processo/thread.
  - `donnemartin/system-design-primer` `README.md`, secao `Asynchronism`: trabalho em background, worker e limites de fila.
- Candidate claims:
  - Claim: um shell minimo pode ser usado para estudar a fronteira entre entrada de comando e execucao de processos.
    Evidence: `codecrafters-io/build-your-own-x/README.md`, `Build your own Shell`.
    Portfolio use: comandos de ingestao e indexacao executados de forma reproduzivel no ambiente local.
  - Claim: processos e threads possuem recursos e problemas de concorrencia diferentes; o desenho deve explicitar quando o trabalho fica no processo principal ou vai para um worker.
    Evidence: `jwasham/coding-interview-university/README.md`, `Processes and Threads`; `donnemartin/system-design-primer/README.md`, `Asynchronism`.
    Portfolio use: separar recebimento de documento e processamento posterior no sistema de ingestao.
- Curatorial risk: nao transformar o fundamento em curso de sistemas operacionais; limitar a comandos, processos, status de saida e separacao de trabalho.

## Pipeline de ingestao

- Planning anchor:
  - `trilha-engenharia-ia.md`: `## Bloco 1: Ferramentas para empacotar IA`, projeto de script de ingestao que le arquivos, quebra em trechos e salva no banco.
  - `projetos-portfolio-ia.md`: `## Projeto 3: Sistema de ingestao de documentos`, MVP com arquivos TXT/Markdown, extracao, chunks, fonte e metadados; `## Projeto central: Local Research Searcher`, cadastro e indexacao de notas e links.
- Repository sources:
  - `donnemartin/system-design-primer` `README.md`, secao `Asynchronism > Message queues` e `Task queues`: separar publicacao de job, processamento por worker e sinalizacao de resultado.
  - `jwasham/coding-interview-university` `README.md`, secoes `Processes and Threads`, `Testing` e `String searching & manipulations`: estudar execucao, verificacao e tratamento de texto em ciclos praticos.
- Candidate claims:
  - Claim: um pipeline de ingestao deve tornar explicitas as etapas de receber, extrair, transformar e persistir, preservando a fonte e os metadados.
    Evidence: `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`.
    Portfolio use: transformar TXT/Markdown em registros pesquisaveis para o `Local Research Searcher`.
  - Claim: quando o processamento demora, uma fila e um worker podem desacoplar a requisicao do trabalho em background; isso adiciona custo e deve ser justificado.
    Evidence: `donnemartin/system-design-primer/README.md`, `Asynchronism > Message queues` e `Task queues`.
    Portfolio use: evolucao posterior do script de ingestao, sem exigir infraestrutura distribuida no MVP.
- Curatorial risk: manter o primeiro exercicio sincrono e local; fila e worker entram como comparacao ou proxima aplicacao, nao como dependencia obrigatoria.

## Testes e evidencias

- Planning anchor:
  - `trilha-engenharia-ia.md`: `## Metodo semanal` e `## Criterio de sucesso`, que exigem implementar, testar, documentar e gerar artefato concreto.
  - `projetos-portfolio-ia.md`: `## Principios`, `## Criterios de qualidade para todos os projetos` e o ciclo semanal de estudo.
- Repository sources:
  - `jwasham/coding-interview-university` `README.md`, secao `Testing`: testes unitarios, mocks, testes de integracao e injecao de dependencia.
  - `codecrafters-io/build-your-own-x` `README.md`, secao `Build your own Database`: referencia a uma serie de pequenos exercicios orientados por testes (`test-driven small coding puzzles`).
- Candidate claims:
  - Claim: testes unitarios e de integracao verificam comportamentos em niveis diferentes; mocks e injecao de dependencia devem ser estudados apenas quando ajudam a isolar uma fronteira real.
    Evidence: `jwasham/coding-interview-university/README.md`, `Testing`.
    Portfolio use: validar CLI, endpoints e etapas do pipeline sem depender de servicos externos.
  - Claim: decompor uma tecnologia em exercicios pequenos orientados por testes produz evidencias incrementais e torna o aprendizado auditavel.
    Evidence: `codecrafters-io/build-your-own-x/README.md`, `Build your own Database`, entrada `Go: Code a database in 45 steps: a series of test-driven small coding puzzles`.
    Portfolio use: cada etapa deve gerar teste, exemplo reproduzivel, nota ou README atualizado.
- Curatorial risk: nao contar leitura como progresso; toda tarefa precisa declarar resultado esperado e evidencia observavel.

## Forma prevista do conteudo

Cada fundamento tera tres etapas:

1. entender o contrato ou mecanismo;
2. implementar uma versao minima;
3. aplicar no fluxo de uma ferramenta de IA ou projeto de portfolio.

Cada etapa tera duas tarefas pequenas, com uma evidencia verificavel. A
redacao final deve usar apenas os claims aprovados no gate CTO e citar as
secoes precisas acima em `Fontes usadas`.

## Pontos para revisao CTO

- Confirmar se `Pipeline de ingestao` e `Testes e evidencias` sao fundamentos de
  suporte adequados ao Bloco 1 ou se devem ser substituidos por fundamentos
  mais diretamente ligados a CLI, APIs e shell.
- Confirmar que o lote nao antecipa SQLite, busca textual, cache ou Docker como
  fundamentos principais.
- Confirmar que as tarefas podem gerar evidencias sem exigir Supabase, API de
  modelo ou infraestrutura distribuida.
