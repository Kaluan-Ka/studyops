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
      <main className={styles.regionMain}>
        <p className={styles.breadcrumb}><Link href="/">Fundamentos</Link> / {fundament.title}</p>
        <section className={styles.regionHero} aria-labelledby="fundamento-titulo">
          <div className={styles.regionSignal} aria-hidden="true">
            <span>{fundament.order.toString().padStart(2, "0")}</span>
          </div>
          <div className={styles.regionBrief}>
            <p className={styles.eyebrow}>Regiao aberta · Fundamento {fundament.order}</p>
            <h1 id="fundamento-titulo">{fundament.title}</h1>
            <p className={styles.detailLead}>{fundament.summary}</p>
            {fundament.intro ? <p className={styles.intro}>{fundament.intro}</p> : null}
          </div>
          <dl className={styles.regionStats} aria-label="Telemetria do fundamento">
            <div>
              <dt>Sessoes</dt>
              <dd>{fundament.sections.length}</dd>
            </div>
            <div>
              <dt>Rotas</dt>
              <dd>{fundament.steps.length}</dd>
            </div>
            <div>
              <dt>Missoes</dt>
              <dd>{fundament.tasks.length}</dd>
            </div>
            <div>
              <dt>Fontes</dt>
              <dd>{sources.length}</dd>
            </div>
          </dl>
        </section>

        {sources.length ? (
          <section className={styles.sourceDock} aria-labelledby="fontes-titulo">
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

        <section className={styles.readingRoute} aria-labelledby="sessoes-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Trilha de leitura</p>
              <h2 id="sessoes-titulo">Sessoes da regiao</h2>
            </div>
            <span>{fundament.sections.length} blocos</span>
          </div>
          <div className={styles.sessionGrid}>
            {fundament.sections.map((section) => (
              <Link key={section.slug} href={`/fundamentos/${fundament.slug}/sessoes/${section.slug}`} className={styles.readingNode}>
                <span>Sessao {section.order.toString().padStart(2, "0")}</span>
                <strong>{section.title}</strong>
                <small>Briefing de leitura</small>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.routeDeck} aria-labelledby="rotas-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Rotas praticas</p>
              <h2 id="rotas-titulo">Etapas e missoes</h2>
            </div>
            <span>{fundament.tasks.length} missoes</span>
          </div>
          <div className={styles.stepList}>
            {fundament.steps.map((step) => (
              <article key={step.id} className={styles.routeCard}>
                <div className={styles.routeLine} aria-hidden="true">{step.order.toString().padStart(2, "0")}</div>
                <div className={styles.stepHeading}>
                  <div>
                    <span>Rota {step.order}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <Link href={`/fundamentos/${fundament.slug}/etapas/${step.slug}`} className={styles.textLink}>
                    Abrir rota
                  </Link>
                </div>
                <p className={styles.evidenceHint}>
                  Evidencias: {step.expectedEvidence.length ? step.expectedEvidence.join(", ") : "a definir"}
                </p>
                <div className={styles.missionLinks}>
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
