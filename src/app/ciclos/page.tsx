import Link from "next/link";

import { StudyCyclesWorkspace } from "@/components/StudyCyclesWorkspace";
import { getFundamentos } from "@/lib/content";

import styles from "./page.module.css";

export default function StudyCyclesPage() {
  const taskOptions = getFundamentos().flatMap((fundament) =>
    fundament.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      fundamentTitle: fundament.title,
    })),
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>StudyOps</Link>
        <nav aria-label="Navegação principal">
          <Link href="/">Mapa</Link>
          <Link href="/#missoes">Missões</Link>
          <Link href="/ciclos" aria-current="page">Ciclos</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <StudyCyclesWorkspace taskOptions={taskOptions} />
      </main>
    </div>
  );
}
