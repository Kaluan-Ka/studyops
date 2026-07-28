import Link from "next/link";
import { notFound } from "next/navigation";

import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getTaskBySlug } from "@/lib/content";
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${task.fundament.slug}`} className={styles.backLink}>Voltar ao fundamento</Link>
      </header>
      <main className={styles.detailMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link>
          {step ? <> / <Link href={`/fundamentos/${task.fundament.slug}/etapas/${step.slug}`}>{step.title}</Link></> : null}
          <> / {task.title}</>
        </p>
        <section className={styles.detailHero}>
          <p className={styles.eyebrow}>Tarefa pratica</p>
          <h1>{task.title}</h1>
          <p className={styles.detailLead}>{task.intro}</p>
          <p className={styles.evidenceHint}>Evidencias esperadas: {task.expectedEvidence.join(", ") || "a definir"}</p>
        </section>

        <section className={styles.detailSection} aria-labelledby="sessoes-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Aula em blocos</p>
              <h2 id="sessoes-titulo">Sessoes da tarefa</h2>
            </div>
            <span>{task.sections.length} blocos</span>
          </div>
          <div className={styles.sessionGrid}>
            {task.sections.map((section) => (
              <Link key={section.slug} href={`/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${section.slug}`} className={styles.sessionCard}>
                <span>Sessao {section.order}</span>
                <strong>{section.title}</strong>
                <small>Leitura curta</small>
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
          label="Anotacao da tarefa"
        />
      </main>
    </div>
  );
}
