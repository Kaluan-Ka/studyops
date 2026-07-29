import Link from "next/link";
import { notFound } from "next/navigation";

import { MissionBriefing } from "@/components/MissionBriefing";
import { getFundamentos, getStepBySlug } from "@/lib/content";
import { buildStepBriefing, formatEvidenceLabel } from "@/lib/missionBriefing";

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
  const briefing = buildStepBriefing(fundament, step);

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
          <p className={styles.eyebrow}>Rota {step.order} · Sub-região prática</p>
          <h1 id="etapa-titulo">{step.title}</h1>
          <p className={styles.detailLead}>
            Escolha uma tarefa pequena, produza a evidência esperada e avance sem perder a relação com o fundamento.
          </p>
          <p className={styles.evidenceHint}>
            Evidências esperadas: {step.expectedEvidence.length ? step.expectedEvidence.map(formatEvidenceLabel).join(", ") : "a definir"}
          </p>
        </section>

        <MissionBriefing briefing={briefing} />

        <section className={styles.missionSectionDeck} aria-labelledby="tarefas-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Deck da rota</p>
              <h2 id="tarefas-titulo">Missões desta etapa</h2>
            </div>
            <span>{step.tasks.length} missoes</span>
          </div>
          <div className={styles.taskListLarge}>
            {step.tasks.map((task) => (
              <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskCard}>
                <span>Missão {task.order.toString().padStart(2, "0")}</span>
                <strong>{task.title}</strong>
                <p>{task.intro}</p>
                <small>Esperado: {task.expectedEvidence.length ? task.expectedEvidence.map(formatEvidenceLabel).join(", ") : "evidência registrada"}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
