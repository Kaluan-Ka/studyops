"use client";

import { useEffect, useState } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import {
  buildHomeProgressSummary,
  type HomeEvidenceRow,
  type HomeProgressRow,
  type HomeProgressSummary,
} from "@/lib/homeProgress";

import styles from "@/app/page.module.css";

type HomeProgressModuleProps = {
  missionIds: string[];
  missionInventoryLabel: string;
  evidenceInventoryLabel: string;
};

type HomeProgressState = "unconfigured" | "signed_out" | "loading" | "ready" | "empty" | "error";

export function HomeProgressModule({
  missionIds,
  missionInventoryLabel,
  evidenceInventoryLabel,
}: HomeProgressModuleProps) {
  const { status: authStatus, user, supabase, errorMessage } = useAuth();
  const [state, setState] = useState<HomeProgressState>("loading");
  const [summary, setSummary] = useState<HomeProgressSummary>(() => buildHomeProgressSummary({
    missionIds,
    progressRows: [],
    evidenceRows: [],
  }));
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHomeProgress() {
      if (authStatus === "unconfigured") {
        setState("unconfigured");
        setFeedback("");
        setSummary(buildHomeProgressSummary({ missionIds, progressRows: [], evidenceRows: [] }));
        return;
      }

      if (authStatus === "signed_out") {
        setState("signed_out");
        setFeedback("");
        setSummary(buildHomeProgressSummary({ missionIds, progressRows: [], evidenceRows: [] }));
        return;
      }

      if (authStatus === "error") {
        setState("error");
        setFeedback(errorMessage || "Nao foi possivel verificar a sessao.");
        setSummary(buildHomeProgressSummary({ missionIds, progressRows: [], evidenceRows: [] }));
        return;
      }

      if (authStatus !== "authenticated" || !supabase || !user?.id) {
        setState("loading");
        setFeedback("");
        return;
      }

      if (missionIds.length === 0) {
        const emptySummary = buildHomeProgressSummary({
          missionIds,
          progressRows: [],
          evidenceRows: [],
        });
        setSummary(emptySummary);
        setState(emptySummary.state);
        return;
      }

      setState("loading");
      setFeedback("");

      const { data: progressRows, error: progressError } = await supabase
        .from("mission_progress")
        .select("id,content_id,status,started_at,completed_at,updated_at")
        .in("content_id", missionIds)
        .order("updated_at", { ascending: false });

      if (!active) {
        return;
      }

      if (progressError) {
        setState("error");
        setFeedback("Nao foi possivel carregar o progresso real.");
        return;
      }

      const typedProgressRows = (progressRows ?? []) as HomeProgressRow[];
      const progressIds = typedProgressRows.map((row) => row.id);
      let evidenceRows: HomeEvidenceRow[] = [];

      if (progressIds.length > 0) {
        const { data, error } = await supabase
          .from("mission_evidence")
          .select("id,title,evidence_type,produced_at")
          .in("progress_id", progressIds)
          .order("produced_at", { ascending: false });

        if (!active) {
          return;
        }

        if (error) {
          setState("error");
          setFeedback("Nao foi possivel carregar as evidencias reais.");
          return;
        }

        evidenceRows = (data ?? []) as HomeEvidenceRow[];
      }

      const nextSummary = buildHomeProgressSummary({
        missionIds,
        progressRows: typedProgressRows,
        evidenceRows,
      });

      setSummary(nextSummary);
      setState(nextSummary.state);
    }

    void loadHomeProgress();

    return () => {
      active = false;
    };
  }, [authStatus, errorMessage, missionIds, supabase, user?.id]);

  const showProgressBar = state === "ready" && summary.progressPercentage !== null;

  return (
    <div className={styles.progressModule}>
      <span>Progresso real</span>
      <strong>{getStatusLabel(state, summary.statusLabel)}</strong>
      <p>{getDescription(state)}</p>

      {showProgressBar ? (
        <div
          className={styles.progressBar}
          aria-label={`Progresso concluido: ${summary.progressPercentage}%`}
        >
          <span style={{ width: `${summary.progressPercentage}%` }} />
        </div>
      ) : null}

      <dl className={styles.progressInventory}>
        <div>
          <dt>{state === "ready" ? "Persistido" : "Inventário"}</dt>
          <dd>{state === "ready" ? summary.inventoryLabel : evidenceInventoryLabel}</dd>
        </div>
        <div>
          <dt>Bloco ativo</dt>
          <dd>{missionInventoryLabel}</dd>
        </div>
      </dl>

      {state === "signed_out" ? (
        <div className={styles.progressAuthNotice}>
          <p>Entre para acender progresso, missões concluídas e evidências reais.</p>
          <GoogleSignInButton compact />
        </div>
      ) : null}

      {state === "error" ? (
        <p className={styles.progressError}>{feedback}</p>
      ) : null}

      {state === "ready" && summary.recentEvidence.length > 0 ? (
        <div className={styles.progressEvidenceList} aria-label="Evidencias reais recentes">
          {summary.recentEvidence.map((evidence) => (
            <article key={evidence.id}>
              <span>{evidence.evidence_type}</span>
              <strong>{evidence.title}</strong>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function getStatusLabel(state: HomeProgressState, persistedLabel: string): string {
  if (state === "ready") {
    return persistedLabel;
  }

  if (state === "loading") {
    return "Verificando sessão";
  }

  if (state === "error") {
    return "Telemetria indisponível";
  }

  if (state === "empty") {
    return "Sem progresso persistido";
  }

  return "Modo leitura pública";
}

function getDescription(state: HomeProgressState): string {
  if (state === "ready") {
    return "Linhas persistidas do seu usuário autenticado, protegidas por RLS.";
  }

  if (state === "loading") {
    return "A home continua pública enquanto o app verifica dados privados.";
  }

  if (state === "error") {
    return "O conteúdo público segue disponível; os dados privados não foram carregados.";
  }

  if (state === "empty") {
    return "Seu mapa público está pronto; conclua uma missão para acender a barra real.";
  }

  return "Visitantes veem o mapa e o inventário público sem dados privados.";
}
