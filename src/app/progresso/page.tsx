import Link from "next/link";

import { ProgressDashboardWorkspace } from "@/components/ProgressDashboardWorkspace";
import { getFundamentos, getProjects } from "@/lib/content";

import styles from "./page.module.css";

export default function ProgressPage() {
  const fundamentos = getFundamentos();
  const tasks = fundamentos.flatMap((fundament) => fundament.tasks.map((task) => ({ id: task.id, title: task.title, fundamentTitle: fundament.title })));
  const projects = getProjects().map((project) => ({ id: project.id, title: project.title }));
  return <div className={styles.page}><header className={styles.header}><Link href="/" className={styles.brand}>StudyOps</Link><nav aria-label="Navegação principal"><Link href="/">Mapa</Link><Link href="/ciclos">Ciclos</Link><Link href="/projetos">Projetos</Link><Link href="/progresso" aria-current="page">Progresso</Link></nav></header><main className={styles.main}><ProgressDashboardWorkspace tasks={tasks} projects={projects} /></main></div>;
}
