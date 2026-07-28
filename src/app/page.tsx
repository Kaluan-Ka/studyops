import Link from "next/link";

import { getFundamentos } from "@/lib/content";

import styles from "./page.module.css";

function countSessions(fundamentos: ReturnType<typeof getFundamentos>): number {
  return fundamentos.reduce(
    (total, fundament) =>
      total +
      fundament.sections.length +
      fundament.tasks.reduce((taskTotal, task) => taskTotal + task.sections.length, 0),
    0,
  );
}

export default function Home() {
  const fundamentos = getFundamentos();
  const totalTasks = fundamentos.reduce((total, fundament) => total + fundament.tasks.length, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          StudyOps
        </Link>
        <nav aria-label="Navegacao principal">
          <a href="#fundamentos">Fundamentos</a>
          <a href="#tarefas">Tarefas</a>
          <a href="#sessoes">Sessoes</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="titulo">
          <p className={styles.eyebrow}>Conteudo curado em pequenas sessoes</p>
          <h1 id="titulo">Aprenda engenharia de IA em ciclos que cabem na rotina.</h1>
          <p>
            Cada fundamento combina explicacao, implementacao, aplicacao e evidencia. Abra uma
            sessao por vez e avance pelo conteudo sem transformar o estudo em uma pagina infinita.
          </p>
        </section>

        <section id="fundamentos" className={styles.section} aria-labelledby="fundamentos-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Trilha do Bloco 1</p>
              <h2 id="fundamentos-titulo">Fundamentos</h2>
            </div>
            <span>Markdown versionado</span>
          </div>

          <div className={styles.track}>
            {fundamentos.map((fundamento) => {
              const firstSection = fundamento.sections[0];

              return (
                <article className={styles.fundamento} key={fundamento.id}>
                  <div className={styles.marker}>{fundamento.order}</div>
                  <div>
                    <p className={styles.status}>{fundamento.status.replaceAll("_", " ")}</p>
                    <h3>{fundamento.title}</h3>
                    <p className={styles.cardSummary}>{fundamento.summary}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span>
                      {fundamento.steps.length} etapas · {fundamento.tasks.length} tarefas
                    </span>
                    <Link href={`/fundamentos/${fundamento.slug}`} className={styles.textLink}>
                      Ver fundamento
                    </Link>
                    {firstSection ? (
                      <Link
                        href={`/fundamentos/${fundamento.slug}/sessoes/${firstSection.slug}`}
                        className={styles.primaryLink}
                      >
                        Comecar sessao
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="tarefas" className={styles.summaryGrid} aria-label="Resumo do conteudo">
          <div>
            <span>Fundamentos</span>
            <strong>{fundamentos.length}</strong>
            <p>Capitulos curados para o primeiro bloco da trilha.</p>
          </div>
          <div>
            <span>Tarefas praticas</span>
            <strong>{totalTasks}</strong>
            <p>Entregas pequenas ligadas a etapas e projetos de portfolio.</p>
          </div>
          <div id="sessoes">
            <span>Sessoes de leitura</span>
            <strong>{countSessions(fundamentos)}</strong>
            <p>Blocos independentes para diluir a leitura e manter o proximo passo claro.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
