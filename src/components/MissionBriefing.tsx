import Link from "next/link";

import type { MissionBriefing as MissionBriefingData } from "@/lib/missionBriefing";

import styles from "@/app/page.module.css";

type MissionBriefingProps = {
  briefing: MissionBriefingData;
  compact?: boolean;
};

export function MissionBriefing({ briefing, compact = false }: MissionBriefingProps) {
  const evidence = briefing.evidence.length ? briefing.evidence : ["Evidência a definir"];

  return (
    <section className={compact ? styles.missionBriefingCompact : styles.missionBriefing} aria-labelledby={`${slugId(briefing.kicker)}-titulo`}>
      <div className={styles.missionBriefingBody}>
        <p className={styles.sectionKicker}>{briefing.kicker}</p>
        <h2 id={`${slugId(briefing.kicker)}-titulo`}>{briefing.title}</h2>
        <p>{briefing.description}</p>
        <dl className={styles.missionBriefingMeta}>
          <div>
            <dt>Contexto</dt>
            <dd>{briefing.context}</dd>
          </div>
          {briefing.status ? (
            <div>
              <dt>Status</dt>
              <dd>{briefing.status}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      <aside className={styles.missionBriefingAction} aria-label="Ação e evidência recomendadas">
        <span>Entrega esperada</span>
        <ul>
          {evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={styles.missionBriefingLinks}>
          <Link href={briefing.primary.href} className={styles.primaryLink}>{briefing.primary.label}</Link>
          {briefing.secondary ? (
            <Link href={briefing.secondary.href} className={styles.secondaryLink}>{briefing.secondary.label}</Link>
          ) : null}
        </div>
      </aside>
    </section>
  );
}

function slugId(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
