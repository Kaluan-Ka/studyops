import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentNavigation } from "@/components/ContentNavigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getTaskBySlug } from "@/lib/content";
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${task.fundament.slug}/tarefas/${task.slug}`} className={styles.backLink}>Indice da tarefa</Link>
      </header>
      <main className={styles.readingMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link> / {task.title} / Sessao {section.order}
        </p>
        <article className={styles.readingArticle}>
          <p className={styles.eyebrow}>Sessao {section.order} de {task.sections.length}</p>
          <h1>{section.title}</h1>
          <MarkdownContent markdown={section.markdown} />
          <StudyNote
            noteKey={makeNoteKey({
              scope: "task-session",
              fundamentSlug: task.fundament.slug,
              taskSlug: task.slug,
              sessionSlug: section.slug,
            })}
            label="Anotacao desta sessao da tarefa"
          />
          <ContentNavigation
            previous={previous ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
            next={next ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
          />
        </article>
      </main>
    </div>
  );
}
