# CTO review — detalhamento do Bloco 1

Data: 2026-07-27

Source map revisado: `docs/curadoria/2026-07-27-bloco-1-detalhamento-source-map.md`

## Approved

- O detalhamento permanece nos cinco fundamentos, quinze etapas e trinta tarefas já aprovados.
- As fontes GitHub estão ligadas às seções do README por anchors exatos: CLI, shell, web server, HTTP, estudo diário, processos, testes, filas e back pressure.
- Claims sobre `build-your-own-x` descrevem apenas o método de reconstruir algo pequeno e o papel do índice curado; nenhum tutorial externo é tratado como especificação.
- Claims sobre HTTP ficam limitados a request/response, método, recurso, entrada, status e corpo.
- Claims sobre processos ficam limitados a comando, processo, stdout, stderr, código de retorno e comparação inicial com worker.
- Pipeline mantém a versão síncrona e local como caminho principal, preservando fonte, índice do chunk e metadados.
- Testes e evidências são descritos como escolha de fronteira e produção de artefato observável, sem exigir mocks quando não há dependência externa.

## Revisões aplicadas

- Citações vagas de repositório devem ser substituídas por links inline no texto de `Fontes usadas` ou no parágrafo que usa a fonte.
- A frase sobre servidor mínimo deve aparecer como tarefa de observar request, resposta e status, não como promessa de ensinar redes completas.
- A comparação processo/worker deve registrar hipótese, medida ou ausência de medida; não pode afirmar que um worker é necessário sem evidência.
- O exemplo de chunking deve expor sua limitação e não vender corte por caracteres como solução geral.
- As sessões podem crescer em explicação, mas não devem ser divididas em headings artificiais só para aumentar a contagem.

## Bloqueios e escopo

- Nenhum claim está bloqueado para escrita depois das revisões acima.
- Fila real, worker distribuído, banco, busca textual, cache, Docker, embeddings, RAG, autenticação e chamadas de modelo permanecem fora do MVP.
- A escrita deve preservar IDs, slugs, etapas, tarefas e `expected_evidence` existentes.

## Resultado do gate

**Aprovado para aprofundamento editorial e inclusão de links externos.**

O próximo gate é `npm run content:validate`, seguido dos testes da camada de
anotações e das verificações completas da aplicação.
