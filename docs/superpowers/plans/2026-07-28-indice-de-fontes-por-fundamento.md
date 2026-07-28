# Índice de fontes por fundamento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exibir no índice de cada fundamento uma lista deduplicada das fontes GitHub já citadas nas sessões, sem remover as citações existentes.

**Architecture:** `src/lib/content.ts` receberá um helper puro que extrai links Markdown GitHub das sessões já carregadas, preservando ordem e removendo URLs repetidas. A página server-side do fundamento usará o resultado para renderizar uma seção compacta antes das sessões; o CSS ficará junto aos estilos existentes da página.

**Tech Stack:** Next.js App Router, TypeScript, Markdown/frontmatter, Node test runner via `tsx` e CSS Modules.

## Global Constraints

- Usar os links GitHub já presentes no Markdown das sessões do fundamento como fonte de verdade.
- Deduplicar links pelo URL e preservar o primeiro texto de link encontrado como rótulo exibido.
- Manter intactos os links existentes no conteúdo das sessões e tarefas.
- Não adicionar fontes aos cartões da página inicial.
- Não criar cadastro manual de fontes no frontmatter nem uma página global de referências.
- Não adicionar estado client-side, Supabase, autenticação ou novas dependências.
- Rodar `npm test`, `npm run content:validate`, `npm run lint` e `npm run build` antes de concluir.

---

### Task 1: Extrator testável de fontes GitHub

**Files:**
- Modify: `src/lib/content.ts` — adicionar o tipo `ExternalSource` e o helper de extração.
- Modify: `tests/content.test.ts` — cobrir filtro, ordem e deduplicação.

**Interfaces:**
- Consumes: `ContentSection[]` já produzido por `splitIntoSections()`.
- Produces: `getExternalSources(sections: ContentSection[]): ExternalSource[]`, com `ExternalSource` igual a `{ label: string; url: string }`.

- [ ] **Step 1: Escrever o teste que falha para extrair fontes únicas**

Adicionar a importação de `getExternalSources` e o teste:

```ts
test("extrai fontes GitHub em ordem e deduplica URLs", () => {
  const sources = getExternalSources([
    {
      title: "Primeira",
      slug: "primeira",
      order: 1,
      markdown: [
        "Veja o [guia de CLI](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool).",
        "Consulte também [HTTP](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http).",
      ].join(" "),
    },
    {
      title: "Segunda",
      slug: "segunda",
      order: 2,
      markdown: "A mesma [CLI](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool) aparece novamente.",
    },
  ]);

  assert.deepEqual(sources, [
    {
      label: "guia de CLI",
      url: "https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool",
    },
    {
      label: "HTTP",
      url: "https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http",
    },
  ]);
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha correta**

Run: `npm test -- tests/content.test.ts`

Expected: FAIL porque `getExternalSources` ainda não existe em `src/lib/content.ts`.

- [ ] **Step 3: Implementar o helper mínimo**

Adicionar ao loader:

```ts
export type ExternalSource = {
  label: string;
  url: string;
};

export function getExternalSources(sections: ContentSection[]): ExternalSource[] {
  const sources = new Map<string, ExternalSource>();
  const markdownLink = /\[([^\]]*)\]\((https:\/\/github\.com\/[^)\s]+)\)/g;

  for (const section of sections) {
    for (const match of section.markdown.matchAll(markdownLink)) {
      const url = match[2];

      if (!sources.has(url)) {
        sources.set(url, { label: match[1].trim() || url, url });
      }
    }
  }

  return [...sources.values()];
}
```

O regex deve limitar o índice a links HTTPS do GitHub, e o `Map` deve manter a primeira ocorrência.

- [ ] **Step 4: Rodar o teste para confirmar o comportamento**

Run: `npm test -- tests/content.test.ts`

Expected: PASS, incluindo os testes de conteúdo existentes.

- [ ] **Step 5: Verificar o conteúdo real carregado**

Run: `node --import tsx -e "import { getExternalSources, getFundamentos } from './src/lib/content.ts'; for (const fundament of getFundamentos()) console.log(fundament.slug, getExternalSources(fundament.sections).length);"`

Expected: os cinco fundamentos imprimem uma contagem positiva de fontes GitHub.

### Task 2: Renderizar o índice no fundamento

**Files:**
- Modify: `src/app/fundamentos/[slug]/page.tsx` — carregar fontes e renderizar a nova seção.
- Modify: `src/app/page.module.css` — estilizar o índice sem alterar cartões ou sessões existentes.

**Interfaces:**
- Consumes: `getExternalSources(fundament.sections)` e `ExternalSource[]` da Task 1.
- Produces: seção acessível `Fontes do fundamento` com links externos em nova aba.

- [ ] **Step 1: Escrever o teste de integração estática mínima**

Estender `tests/content.test.ts` para confirmar que cada fundamento real tem fontes extraíveis:

```ts
test("encontra fontes GitHub nos cinco fundamentos reais", () => {
  for (const fundament of getFundamentos()) {
    assert.ok(getExternalSources(fundament.sections).length > 0, fundament.slug);
  }
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha da nova expectativa**

Run: `npm test -- tests/content.test.ts`

Expected: PASS se a extração real já estiver correta; se falhar, corrigir somente o extrator antes de alterar a página. A página ainda não deve ser considerada coberta até a verificação manual do HTML.

- [ ] **Step 3: Integrar a seção server-side**

Alterar a importação e calcular as fontes após encontrar o fundamento:

```tsx
import { getExternalSources, getFundamentBySlug, getFundamentos } from "@/lib/content";

// ...

const sources = getExternalSources(fundament.sections);
```

Inserir, depois de `detailHero` e antes da seção `Sessoes`:

```tsx
{sources.length ? (
  <section className={styles.sourcesSection} aria-labelledby="fontes-titulo">
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionKicker}>Referencias usadas</p>
        <h2 id="fontes-titulo">Fontes do fundamento</h2>
      </div>
      <span>{sources.length} links</span>
    </div>
    <ul className={styles.sourcesList}>
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        </li>
      ))}
    </ul>
  </section>
) : null}
```

Não remover ou mover o `MarkdownContent` das páginas de sessão.

- [ ] **Step 4: Adicionar CSS focado no índice**

Adicionar ao `src/app/page.module.css`:

```css
.sourcesSection {
  margin: 0 0 16px;
  padding: 22px;
  border: 1px solid #d3dfd5;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.sourcesList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sourcesList a {
  color: #276b54;
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 5: Rodar lint e build localmente**

Run: `npm run lint && npm run build`

Expected: ambos terminam com código 0; o build deve continuar executando `content:validate` pelo `prebuild`.

### Task 3: Verificação final e inspeção do working tree

**Files:**
- Inspect: `src/lib/content.ts`
- Inspect: `src/app/fundamentos/[slug]/page.tsx`
- Inspect: `src/app/page.module.css`
- Inspect: `tests/content.test.ts`
- Inspect: `content/fundamentos/*.md`

**Interfaces:**
- Consumes: implementação das Tasks 1 e 2.
- Produces: evidência de que a nova lista existe, as citações originais permanecem e as verificações do projeto passam.

- [ ] **Step 1: Executar a suíte de testes**

Run: `npm test`

Expected: todos os testes terminam sem falhas.

- [ ] **Step 2: Validar a estrutura e os links do conteúdo**

Run: `npm run content:validate`

Expected: validação termina sem erros e mantém os cinco fundamentos, quinze etapas e trinta tarefas.

- [ ] **Step 3: Verificar alterações de formatação**

Run: `git diff --check`

Expected: nenhuma mensagem de whitespace inválido.

- [ ] **Step 4: Confirmar preservação das citações existentes**

Run: `rg -l 'https://github\\.com/' content/fundamentos content/tasks | wc -l`

Expected: a contagem não diminui em relação ao estado anterior; nenhum arquivo Markdown de conteúdo deve ser modificado por esta feature.

- [ ] **Step 5: Conferir o status final antes de qualquer commit**

Run: `git status --short --branch`

Expected: aparecem somente as alterações pré-existentes e os arquivos desta feature; não executar `git reset`, `git checkout` ou comandos destrutivos. O commit permanece bloqueado enquanto `.git` estiver somente leitura.
