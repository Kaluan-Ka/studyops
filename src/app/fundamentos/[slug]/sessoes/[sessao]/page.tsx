import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentNavigation } from "@/components/ContentNavigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { StudyNote } from "@/components/StudyNote";
import { getFundamentos, getFundamentBySlug } from "@/lib/content";
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <Link href={`/fundamentos/${fundament.slug}`} className={styles.backLink}>Indice do fundamento</Link>
      </header>
      <main className={styles.readingMain}>
        <p className={styles.breadcrumb}>
          <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / Sessao {section.order}
        </p>
        <section className={styles.readingShell} aria-labelledby="sessao-titulo">
          <header className={styles.readingHeaderPanel}>
            <p className={styles.eyebrow}>Briefing de leitura · Sessao {section.order} de {fundament.sections.length}</p>
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
          </header>
          <article className={styles.readingArticle}>
            <MarkdownContent markdown={section.markdown} />
            <StudyNote
              noteKey={makeNoteKey({
                scope: "fundament-session",
                fundamentSlug: fundament.slug,
                sessionSlug: section.slug,
              })}
              label="Registro de campo desta sessao"
            />
            <ContentNavigation
              previous={previous ? { href: `/fundamentos/${fundament.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
              next={next ? { href: `/fundamentos/${fundament.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
            />
          </article>
        </section>
      </main>
    </div>
  );
}
