import Link from "next/link";
import { notFound } from "next/navigation";

import { getExternalSources, getFundamentBySlug, getFundamentos } from "@/lib/content";

import styles from "../../page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getFundamentos().map((fundament) => ({ slug: fundament.slug }));
}

export default async function FundamentPage({ params }: PageProps) {
  const { slug } = await params;
  const fundament = getFundamentBySlug(slug);

  if (!fundament) {
    notFound();
  }

  const sources = getExternalSources(fundament.sections);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href="/" className={styles.backLink}>Voltar para fundamentos</Link>
      </header>
      <main className={styles.detailMain}>
        <p className={styles.breadcrumb}><Link href="/">Fundamentos</Link> / {fundament.title}</p>
        <section className={styles.detailHero}>
          <p className={styles.eyebrow}>Fundamento {fundament.order}</p>
          <h1>{fundament.title}</h1>
          <p className={styles.detailLead}>{fundament.summary}</p>
          {fundament.intro ? <p className={styles.intro}>{fundament.intro}</p> : null}
        </section>

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

        <section className={styles.detailSection} aria-labelledby="sessoes-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Leitura em blocos</p>
              <h2 id="sessoes-titulo">Sessoes</h2>
            </div>
            <span>{fundament.sections.length} blocos</span>
          </div>
          <div className={styles.sessionGrid}>
            {fundament.sections.map((section) => (
              <Link
                key={section.slug}
                href={`/fundamentos/${fundament.slug}/sessoes/${section.slug}`}
                className={styles.sessionCard}
              >
                <span>Sessao {section.order}</span>
                <strong>{section.title}</strong>
                <small>Leitura curta</small>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.detailSection} aria-labelledby="etapas-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Aplicacao pratica</p>
              <h2 id="etapas-titulo">Etapas e tarefas</h2>
            </div>
            <span>{fundament.tasks.length} tarefas</span>
          </div>
          <div className={styles.stepList}>
            {fundament.steps.map((step) => (
              <article key={step.id} className={styles.stepCard}>
                <div className={styles.stepHeading}>
                  <div>
                    <span>Etapa {step.order}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <Link href={`/fundamentos/${fundament.slug}/etapas/${step.slug}`} className={styles.textLink}>
                    Abrir etapa
                  </Link>
                </div>
                <p className={styles.evidenceHint}>
                  Evidencias: {step.expectedEvidence.length ? step.expectedEvidence.join(", ") : "a definir"}
                </p>
                <div className={styles.taskList}>
                  {step.tasks.map((task) => (
                    <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskLink}>
                      <span>{task.order.toString().padStart(2, "0")}</span>
                      {task.title}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
