import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentNavigation } from "@/components/ContentNavigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MissionBriefing } from "@/components/MissionBriefing";
import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getTaskBySlug } from "@/lib/content";
import { buildReadingBriefing } from "@/lib/missionBriefing";
import { makeNoteKey } from "@/lib/notes";

import styles from "../../../../../../page.module.css";

type PageProps = {
  params: Promise<{ slug: string; tarefa: string; sessao: string }>;
};

export function generateStaticParams() {
  return getFundamentos().flatMap((fundament) =>
    fundament.tasks.flatMap((task) =>
      task.sections.map((section) => ({ slug: fundament.slug, tarefa: task.slug, sessao: section.slug })),
    ),
  );
}

export default async function TaskSessionPage({ params }: PageProps) {
  const { slug, tarefa, sessao } = await params;
  let task;

  try {
    task = getTaskBySlug(tarefa, slug);
  } catch {
    notFound();
  }

  const section = task.sections.find((item) => item.slug === sessao);

  if (!section) {
    notFound();
  }

  const sectionIndex = task.sections.findIndex((item) => item.slug === section.slug);
  const previous = task.sections[sectionIndex - 1];
  const next = task.sections[sectionIndex + 1];
  const briefing = buildReadingBriefing({
    fundament: task.fundament,
    currentTitle: section.title,
    currentOrder: section.order,
    total: task.sections.length,
    expectedEvidence: task.expectedEvidence,
    nextHref: next ? `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${next.slug}` : undefined,
    nextLabel: next?.title,
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${task.fundament.slug}/tarefas/${task.slug}`} className={styles.backLink}>Índice da tarefa</Link>
      </header>
      <main className={styles.readingMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link> / {task.title} / Sessão {section.order}
        </p>
        <article className={styles.readingShell} aria-labelledby="sessao-titulo">
          <header className={styles.readingHeaderPanel}>
            <p className={styles.eyebrow}>Briefing de missão · Sessão {section.order} de {task.sections.length}</p>
            <h1 id="sessao-titulo">{section.title}</h1>
            <dl className={styles.readingMeta}>
              <div>
                <dt>Missão</dt>
                <dd>{task.title}</dd>
              </div>
              <div>
                <dt>Registro</dt>
                <dd>Logbook local</dd>
              </div>
            </dl>
            <MissionBriefing briefing={briefing} compact />
          </header>
          <div className={styles.readingArticle}>
            <MarkdownContent markdown={section.markdown} />
            <div id="registro-de-campo">
              <StudyNote
                noteKey={makeNoteKey({
                  scope: "task-session",
                  fundamentSlug: task.fundament.slug,
                  taskSlug: task.slug,
                  sessionSlug: section.slug,
                })}
                target={{ scope: "task-session", taskId: task.id, sessionSlug: section.slug }}
                legacyTarget={{
                  scope: "task-session",
                  fundamentSlug: task.fundament.slug,
                  taskSlug: task.slug,
                  sessionSlug: section.slug,
                }}
                label="Registro de campo desta sessão"
              />
            </div>
            <ContentNavigation
              previous={previous ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
              next={next ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
