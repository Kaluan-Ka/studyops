import Link from "next/link";

import { PortfolioProjectsWorkspace } from "@/components/PortfolioProjectsWorkspace";
import { getProjects } from "@/lib/content";

import styles from "./page.module.css";

export default function ProjectsPage() {
  const projects = getProjects().map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    fundamentIds: project.fundamentIds,
    taskIds: project.taskIds,
  }));

  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}>StudyOps</Link><nav aria-label="Navegação principal"><Link href="/">Mapa</Link><Link href="/ciclos">Ciclos</Link><Link href="/projetos" aria-current="page">Projetos</Link><Link href="/progresso">Progresso</Link></nav></header>
    <main className={styles.main}><PortfolioProjectsWorkspace projects={projects} /></main>
  </div>;
}
