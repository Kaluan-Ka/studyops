import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentNavigation } from "@/components/ContentNavigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MissionBriefing } from "@/components/MissionBriefing";
import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getFundamentBySlug } from "@/lib/content";
import { buildReadingBriefing } from "@/lib/missionBriefing";
import { makeNoteKey } from "@/lib/notes";

import styles from "../../../../page.module.css";

type PageProps = {
  params: Promise<{ slug: string; sessao: string }>;
};

export function generateStaticParams() {
  return getFundamentos().flatMap((fundament) =>
    fundament.sections.map((section) => ({ slug: fundament.slug, sessao: section.slug })),
  );
}

export default async function FundamentSessionPage({ params }: PageProps) {
  const { slug, sessao } = await params;
  const fundament = getFundamentBySlug(slug);
  const section = fundament?.sections.find((item) => item.slug === sessao);

  if (!fundament || !section) {
    notFound();
  }

  const sectionIndex = fundament.sections.findIndex((item) => item.slug === section.slug);
  const previous = fundament.sections[sectionIndex - 1];
  const next = fundament.sections[sectionIndex + 1];
  const firstStepEvidence = fundament.steps[0]?.expectedEvidence ?? ["nota_markdown"];
  const briefing = buildReadingBriefing({
    fundament,
    currentTitle: section.title,
    currentOrder: section.order,
    total: fundament.sections.length,
    expectedEvidence: firstStepEvidence,
    nextHref: next ? `/fundamentos/${fundament.slug}/sessoes/${next.slug}` : undefined,
    nextLabel: next?.title,
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${fundament.slug}`} className={styles.backLink}>Índice do fundamento</Link>
      </header>
      <main className={styles.readingMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / Sessão {section.order}
        </p>
        <article className={styles.readingShell} aria-labelledby="sessao-titulo">
          <header className={styles.readingHeaderPanel}>
            <p className={styles.eyebrow}>Briefing de leitura · Sessão {section.order} de {fundament.sections.length}</p>
            <h1 id="sessao-titulo">{section.title}</h1>
            <dl className={styles.readingMeta}>
              <div>
                <dt>Fundamento</dt>
                <dd>{fundament.title}</dd>
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
                  scope: "fundament-session",
                  fundamentSlug: fundament.slug,
                  sessionSlug: section.slug,
                })}
                target={{ scope: "fundament-session", fundamentId: fundament.id, sessionSlug: section.slug }}
                legacyTarget={{
                  scope: "fundament-session",
                  fundamentSlug: fundament.slug,
                  sessionSlug: section.slug,
                }}
                label="Registro de campo desta sessão"
              />
            </div>
            <ContentNavigation
              previous={previous ? { href: `/fundamentos/${fundament.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
              next={next ? { href: `/fundamentos/${fundament.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
