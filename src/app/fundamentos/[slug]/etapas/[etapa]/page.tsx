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
      <main className={styles.detailMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / {step.title}
        </p>
        <section className={styles.detailHero}>
          <p className={styles.eyebrow}>Etapa {step.order}</p>
          <h1>{step.title}</h1>
          <p className={styles.detailLead}>
            Escolha uma tarefa pequena, produza a evidencia esperada e avance sem perder a relacao com o fundamento.
          </p>
          <p className={styles.evidenceHint}>
            Evidencias esperadas: {step.expectedEvidence.join(", ") || "a definir"}
          </p>
        </section>

        <section className={styles.detailSection} aria-labelledby="tarefas-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Pratica guiada</p>
              <h2 id="tarefas-titulo">Tarefas desta etapa</h2>
            </div>
            <span>{step.tasks.length} tarefas</span>
          </div>
          <div className={styles.taskListLarge}>
            {step.tasks.map((task) => (
              <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskCard}>
                <span>Tarefa {task.order.toString().padStart(2, "0")}</span>
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
