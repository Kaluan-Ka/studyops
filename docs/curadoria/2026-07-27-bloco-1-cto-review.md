# CTO review — Bloco 1: Ferramentas para empacotar IA

Data: 2026-07-27
Source map revisado: `docs/curadoria/2026-07-27-bloco-1-source-map.md`

## 1. Approved claims

- O Bloco 1 da trilha explicita CLI tools, web servers/APIs e shell/processos.
- Uma CLI minima e adequada como primeiro artefato porque pode receber uma
  entrada, executar um processamento concreto e produzir uma saida verificavel.
- HTTP deve ser ensinado inicialmente como contrato request/response com
  recursos, metodos e status, sem antecipar autenticacao, escalabilidade ou
  Supabase.
- Shell e processos devem ficar restritos a execucao de comandos, status de
  saida, separacao de processo principal e worker e observacao de falhas.
- Pipeline de ingestao e um fundamento de suporte justificado pelo projeto de
  ingestao: receber arquivo, extrair texto, transformar em chunks e preservar
  fonte/metadados.
- Testes e evidencias fecham o ciclo definido nos documentos locais e permitem
  validar CLI, endpoints e pipeline sem servicos externos.
- O lote deve ter exatamente 5 fundamentos, 15 etapas e 30 tarefas.

## 2. Claims to revise

- A frase de que construir um servidor minimo "observa o caminho entre
  protocolo, endpoint e resposta" deve virar uma tarefa pratica, nao uma
  explicacao ampla sobre redes.
- A frase sobre processos e threads deve evitar prometer dominio de
  concorrencia; a primeira evidencia deve ser uma comparacao ou nota curta
  sobre um processo local e um worker simulado.
- O claim sobre testes unitarios, integracao, mocks e injecao de dependencia
  deve usar apenas a parte necessaria para os exercicios. Mocks e injecao de
  dependencia ficam como opcao quando houver uma fronteira externa real.

## 3. Missing or weak sources

- `codecrafters-io/build-your-own-x/README.md` e um indice curado de guias,
  nao uma especificacao de CLI, shell ou servidor. O conteudo final deve
  citar a secao exata apenas para justificar o exercicio "build your own" e
  nao deve atribuir ao repositorio detalhes dos tutoriais externos.
- Nao ha necessidade de forcar `TheAlgorithms/Python` neste lote: os cinco
  fundamentos sao de ferramentas, protocolos, processos, ingestao e testes,
  enquanto a trilha reserva o repositorio de algoritmos para hash tables,
  busca, cache e ranking em blocos posteriores.
- Para `Pipeline de ingestao`, o detalhamento de TXT/Markdown, chunks, fonte e
  metadados vem do mapa local de portfolio; o `system-design-primer` sustenta
  apenas a parte de desacoplamento assíncrono, fila e worker.

## 4. Scope cuts required before content writing

- Nao incluir SQLite, busca textual, cache, Docker, embeddings, RAG,
  autenticacao ou chamadas de modelo como requisito de qualquer tarefa deste
  lote.
- Nao exigir fila real ou worker distribuido: a aplicacao inicial do pipeline
  deve ser sincrona e local; a fila entra como comparacao e proxima aplicacao.
- Nao criar tarefas de leitura sem evidencia. Cada tarefa deve gerar nota,
  teste, exemplo reproduzivel, diff de saida ou README atualizado.
- Cada fundamento seguira tres etapas: entender, implementar minimo e aplicar
  no portfolio. Cada etapa tera duas tarefas pequenas e independentes.

## Gate result

**Aprovado para escrita de conteudo**, com as revisoes e cortes acima
incorporados nos arquivos Markdown. Nenhum item de "Claims to revise" ou
"Missing or weak sources" impede a escrita se os limites forem respeitados.
