import Link from "next/link";
import { notFound } from "next/navigation";

import { MissionBriefing } from "@/components/MissionBriefing";
import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getTaskBySlug } from "@/lib/content";
import { buildTaskBriefing, formatEvidenceLabel, formatStatusLabel } from "@/lib/missionBriefing";
import { makeNoteKey } from "@/lib/notes";

import styles from "../../../../page.module.css";

type PageProps = {
  params: Promise<{ slug: string; tarefa: string }>;
};

export function generateStaticParams() {
  return getFundamentos().flatMap((fundament) =>
    fundament.tasks.map((task) => ({ slug: fundament.slug, tarefa: task.slug })),
  );
}

export default async function TaskPage({ params }: PageProps) {
  const { slug, tarefa } = await params;
  let task;

  try {
    task = getTaskBySlug(tarefa, slug);
  } catch {
    notFound();
  }

  const step = task.fundament.steps.find((item) => item.id === task.stepId);
  const briefing = buildTaskBriefing(task.fundament, task, step);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${task.fundament.slug}`} className={styles.backLink}>Voltar ao fundamento</Link>
      </header>
      <main className={styles.missionMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link>
          {step ? <> / <Link href={`/fundamentos/${task.fundament.slug}/etapas/${step.slug}`}>{step.title}</Link></> : null}
          <> / {task.title}</>
        </p>
        <section className={styles.missionCard} aria-labelledby="tarefa-titulo">
          <div className={styles.cardHeader}>
            <span className={styles.cardId}>TASK-{task.order.toString().padStart(3, "0")}</span>
            <strong>{formatStatusLabel(task.status)}</strong>
          </div>
          <p className={styles.eyebrow}>Carta de missão prática</p>
          <h1 id="tarefa-titulo">{task.title}</h1>
          <p className={styles.detailLead}>{task.intro}</p>
          <section className={styles.missionGoal} aria-labelledby="objetivo-real-titulo">
            <span>Objetivo real da missão</span>
            <h2 id="objetivo-real-titulo">{task.goal}</h2>
          </section>
          <dl className={styles.missionMeta}>
            <div>
              <dt>Fundamento</dt>
              <dd>{task.fundament.title}</dd>
            </div>
            {step ? (
              <div>
                <dt>Rota</dt>
                <dd>{step.title}</dd>
              </div>
            ) : null}
            <div>
              <dt>Sessões</dt>
              <dd>{task.sections.length}</dd>
            </div>
          </dl>
          <p className={styles.missionEvidence}>
            Evidências esperadas: {task.expectedEvidence.length ? task.expectedEvidence.map(formatEvidenceLabel).join(", ") : "a definir"}
          </p>
        </section>

        <MissionBriefing briefing={briefing} />

        <section className={styles.missionSectionDeck} aria-labelledby="sessoes-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Briefing de execução</p>
              <h2 id="sessoes-titulo">Sessões da missão</h2>
            </div>
            <span>{task.sections.length} blocos</span>
          </div>
          <div className={styles.sessionGrid}>
            {task.sections.map((section) => (
              <Link key={section.slug} href={`/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${section.slug}`} className={styles.missionSessionCard}>
                <span>Sessão {section.order.toString().padStart(2, "0")}</span>
                <strong>{section.title}</strong>
                <small>Executar briefing</small>
              </Link>
            ))}
          </div>
        </section>
        <StudyNote
          noteKey={makeNoteKey({
            scope: "task",
            fundamentSlug: task.fundament.slug,
            taskSlug: task.slug,
          })}
          label="Registro de campo da missão"
        />
      </main>
    </div>
  );
}
