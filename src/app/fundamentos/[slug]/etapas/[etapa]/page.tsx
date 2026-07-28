import Link from "next/link";
import { notFound } from "next/navigation";

import { getFundamentos, getStepBySlug } from "@/lib/content";

import styles from "../../../../page.module.css";

type PageProps = {
  params: Promise<{ slug: string; etapa: string }>;
};

export function generateStaticParams() {
  return getFundamentos().flatMap((fundament) =>
    fundament.steps.map((step) => ({ slug: fundament.slug, etapa: step.slug })),
  );
}

export default async function StepPage({ params }: PageProps) {
  const { slug, etapa } = await params;
  const result = getStepBySlug(slug, etapa);

  if (!result) {
    notFound();
  }

  const { fundament, step } = result;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${fundament.slug}`} className={styles.backLink}>Voltar ao fundamento</Link>
      </header>
      <main className={styles.routeMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / {step.title}
        </p>
        <section className={styles.routeHero} aria-labelledby="etapa-titulo">
          <p className={styles.eyebrow}>Rota {step.order} · Sub-regiao pratica</p>
          <h1 id="etapa-titulo">{step.title}</h1>
          <p className={styles.detailLead}>
            Escolha uma tarefa pequena, produza a evidencia esperada e avance sem perder a relacao com o fundamento.
          </p>
          <p className={styles.evidenceHint}>
            Evidencias esperadas: {step.expectedEvidence.join(", ") || "a definir"}
          </p>
        </section>

        <section className={styles.missionSectionDeck} aria-labelledby="tarefas-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Deck da rota</p>
              <h2 id="tarefas-titulo">Missoes desta etapa</h2>
            </div>
            <span>{step.tasks.length} missoes</span>
          </div>
          <div className={styles.taskListLarge}>
            {step.tasks.map((task) => (
              <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskCard}>
                <span>Missao {task.order.toString().padStart(2, "0")}</span>
                <strong>{task.title}</strong>
                <p>{task.intro}</p>
                <small>Esperado: {task.expectedEvidence.join(", ") || "evidencia registrada"}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
