import Link from "next/link";

import { HomeProgressModule } from "@/components/HomeProgressModule";
import { getFundamentos } from "@/lib/content";
import { buildStudyMap, type StudyMapTile } from "@/lib/studyMap";

import styles from "./page.module.css";

function tileClassName(tile: StudyMapTile, index: number): string {
  return [
    styles.mapTile,
    tile.state === "current" ? styles.mapTileCurrent : styles.mapTileAvailable,
    styles[`mapTile${index + 1}`],
  ].join(" ");
}

export default function Home() {
  const fundamentos = getFundamentos();
  const studyMap = buildStudyMap(fundamentos);
  const currentTile = studyMap.currentTile;
  const missionIds = fundamentos.flatMap((fundamento) => (
    fundamento.tasks.map((task) => task.id)
  ));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          StudyOps
        </Link>
        <nav aria-label="Navegação principal">
          <a href="#mapa">Mapa</a>
          <a href="#missoes">Missões</a>
          <a href="#evidencias">Evidências</a>
          <Link href="/ciclos">Ciclos</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section id="mapa" className={styles.commandDeck} aria-labelledby="titulo">
          <div className={styles.mapPanel}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Atlas operacional de Engenharia de IA</p>
              <h1 id="titulo">Comande sua trilha pelo mapa de fundamentos.</h1>
              <p>
                Cada região conecta referência, fundamento, implementação, projeto, evidência e
                próximo passo. O Bloco 1 está ativo; o resto do mundo aparece no radar.
              </p>
            </div>

            {currentTile ? (
              <div className={styles.mobileMissionDock} aria-label="Próxima missão">
                <span>Missão atual</span>
                <strong>{currentTile.title}</strong>
                {currentTile.sessionHref ? (
                  <Link href={currentTile.sessionHref} className={styles.primaryLink}>
                    Iniciar sessão
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className={styles.orbitalMap} aria-label="Mapa de fundamentos do StudyOps">
              <div className={styles.orbitOuter} aria-hidden="true" />
              <div className={styles.orbitInner} aria-hidden="true" />

              <ul className={styles.tileList}>
                {studyMap.tiles.map((tile, index) => (
                  <li key={tile.slug}>
                    <Link
                      href={tile.href}
                      className={tileClassName(tile, index)}
                      aria-current={tile.state === "current" ? "page" : undefined}
                    >
                      <span className={styles.tileStatus}>
                        {tile.state === "current" ? "Em foco" : "A estudar"}
                      </span>
                      <strong>{tile.title}</strong>
                      <small>
                        {tile.taskCount} tarefas · {tile.sessionCount} sessões
                      </small>
                    </Link>
                  </li>
                ))}
                {studyMap.futureRegions.map((region, index) => (
                  <li key={region.title}>
                    <div
                      className={[
                        styles.mapTile,
                        styles.mapTileFuture,
                        styles[`mapTileFuture${index + 1}`],
                      ].join(" ")}
                      aria-label={`${region.title}: ${region.label}`}
                    >
                      <span className={styles.tileStatus}>{region.label}</span>
                      <strong>{region.title}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.currentRegionLabel}>
              <span>{studyMap.activeBlock.label}</span>
              <strong>{studyMap.activeBlock.title}</strong>
            </div>

            <div className={styles.mapLegend} aria-label="Legenda do mapa">
              <span><i className={styles.legendCurrent} /> Em foco</span>
              <span><i className={styles.legendAvailable} /> A estudar</span>
              <span><i className={styles.legendFuture} /> Território futuro</span>
            </div>
          </div>

          <aside className={styles.briefingPanel} aria-labelledby="briefing-titulo">
            <p className={styles.eyebrow}>Briefing da operação</p>
            <h2 id="briefing-titulo">{studyMap.activeBlock.title}</h2>
            <p>{studyMap.activeBlock.summary}</p>

            <section className={styles.narrativeGuide} aria-labelledby="guia-narrativo-titulo">
              <div className={styles.guideSignal} aria-hidden="true">
                <span>{studyMap.narrativeGuide.callSign}</span>
              </div>
              <div className={styles.guideBody}>
                <p className={styles.guideSpeaker}>{studyMap.narrativeGuide.speaker}</p>
                <h3 id="guia-narrativo-titulo">{studyMap.narrativeGuide.title}</h3>
                <p>{studyMap.narrativeGuide.message}</p>
                <dl className={styles.guideTelemetry}>
                  <div>
                    <dt>{studyMap.narrativeGuide.focusLabel}</dt>
                    <dd>{studyMap.narrativeGuide.focusValue}</dd>
                  </div>
                  <div>
                    <dt>Evidência</dt>
                    <dd>{studyMap.narrativeGuide.evidenceLabel}</dd>
                  </div>
                </dl>
                <Link href={studyMap.narrativeGuide.href} className={styles.guideLink}>
                  {studyMap.narrativeGuide.nextStepLabel}
                </Link>
              </div>
            </section>

            <HomeProgressModule
              missionIds={missionIds}
              missionInventoryLabel={studyMap.contentInventory.missionLabel}
              evidenceInventoryLabel={studyMap.contentInventory.evidenceLabel}
            />

            {currentTile ? (
              <article className={styles.briefingCard}>
                <span>Carta de missão atual</span>
                <h3>{currentTile.title}</h3>
                <p>{currentTile.summary}</p>
                <dl>
                  <div>
                    <dt>Tarefas</dt>
                    <dd>{currentTile.taskCount}</dd>
                  </div>
                  <div>
                    <dt>Sessões</dt>
                    <dd>{currentTile.sessionCount}</dd>
                  </div>
                  <div>
                    <dt>Evidências</dt>
                    <dd>{currentTile.evidenceCount}</dd>
                  </div>
                </dl>
              </article>
            ) : null}

            <div className={styles.briefingActions}>
              {currentTile?.sessionHref ? (
                <Link href={currentTile.sessionHref} className={styles.primaryLink}>
                  Iniciar sessão
                </Link>
              ) : null}
              {currentTile ? (
                <Link href={currentTile.href} className={styles.secondaryLink}>
                  Ver fundamento
                </Link>
              ) : null}
            </div>
          </aside>
        </section>

        <section id="missoes" className={styles.section} aria-labelledby="missoes-titulo">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>Deck do Bloco 1</p>
              <h2 id="missoes-titulo">Cartas de missão</h2>
            </div>
            <span>Markdown versionado</span>
          </div>

          <div className={styles.track}>
            {studyMap.tiles.map((tile) => (
              <article className={styles.fundamento} key={tile.slug}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardId}>
                    FUN-{tile.order.toString().padStart(2, "0")}
                  </span>
                  <strong>{tile.state === "current" ? "Em foco" : "A estudar"}</strong>
                </div>
                <div>
                  <h3>{tile.title}</h3>
                  <p className={styles.cardSummary}>{tile.summary}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span>
                    {tile.taskCount} tarefas · {tile.sessionCount} sessões ·{" "}
                    {tile.evidenceCount} evidências
                  </span>
                  <Link href={tile.href} className={styles.textLink}>
                    Ver fundamento
                  </Link>
                  {tile.sessionHref ? (
                    <Link href={tile.sessionHref} className={styles.primaryLink}>
                      Iniciar sessão
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="evidencias" className={styles.summaryGrid} aria-label="Resumo operacional">
          <div>
            <span>Fundamentos no mapa</span>
            <strong>{studyMap.stats.fundamentos}</strong>
            <p>Territórios ativos no primeiro bloco da trilha.</p>
          </div>
          <div>
            <span>Missões práticas</span>
            <strong>{studyMap.stats.tarefas}</strong>
            <p>Tarefas pequenas ligadas a implementação e portfólio.</p>
          </div>
          <div>
            <span>Evidências esperadas</span>
            <strong>{studyMap.stats.evidencias}</strong>
            <p>Tipos de artefato que acendem progresso real no StudyOps.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
