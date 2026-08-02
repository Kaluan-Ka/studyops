"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import { canMutateWithAuth } from "@/lib/authAccess";
import {
  buildEvidenceInsert,
  buildProgressUpsert,
  getMissionProgressStatusLabel,
  type MissionEvidenceType,
  type MissionProgressStatus,
} from "@/lib/missionProgress";
import styles from "@/app/page.module.css";

type MissionProgressRow = {
  id: string;
  user_id: string;
  content_id: string;
  status: MissionProgressStatus | "not_started" | "skipped";
  started_at: string | null;
  completed_at: string | null;
};

type MissionEvidenceRow = {
  id: string;
  evidence_type: MissionEvidenceType;
  title: string;
  body: string | null;
  artifact_url: string | null;
  artifact_path: string | null;
  produced_at: string;
};

type PanelState =
  | "unconfigured"
  | "signed_out"
  | "loading"
  | "ready_empty"
  | "ready_saved"
  | "error";

type MissionProgressPanelProps = {
  contentId: string;
  missionTitle: string;
};

const editableStatuses: MissionProgressStatus[] = [
  "in_progress",
  "blocked",
  "completed",
];

const evidenceTypes: Array<{ value: MissionEvidenceType; label: string }> = [
  { value: "note", label: "Nota" },
  { value: "test", label: "Teste" },
  { value: "implementation", label: "Implementacao" },
  { value: "decision", label: "Decisao" },
  { value: "link", label: "Link" },
  { value: "commit", label: "Commit" },
  { value: "other", label: "Outra" },
];

export function MissionProgressPanel({ contentId, missionTitle }: MissionProgressPanelProps) {
  const { status: authStatus, user, supabase, errorMessage } = useAuth();
  const canMutate = canMutateWithAuth(authStatus, user?.id);
  const [state, setState] = useState<PanelState>("loading");
  const [progress, setProgress] = useState<MissionProgressRow | null>(null);
  const [evidences, setEvidences] = useState<MissionEvidenceRow[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MissionProgressStatus>("in_progress");
  const [evidenceType, setEvidenceType] = useState<MissionEvidenceType>("note");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceBody, setEvidenceBody] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [artifactPath, setArtifactPath] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      if (authStatus === "unconfigured") {
        setProgress(null);
        setEvidences([]);
        setState("unconfigured");
        return;
      }

      if (authStatus === "signed_out") {
        setProgress(null);
        setEvidences([]);
        setState("signed_out");
        return;
      }

      if (authStatus === "error") {
        setProgress(null);
        setEvidences([]);
        setState("error");
        setFeedback(errorMessage || "Nao foi possivel verificar a sessao.");
        return;
      }

      if (authStatus !== "authenticated" || !supabase || !user?.id) {
        setProgress(null);
        setEvidences([]);
        setState("loading");
        return;
      }

      setState("loading");

      const { data: progressRow, error: progressError } = await supabase
        .from("mission_progress")
        .select("id,user_id,content_id,status,started_at,completed_at")
        .eq("content_id", contentId)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (progressError) {
        setState("error");
        setFeedback("Nao foi possivel carregar o progresso persistido.");
        return;
      }

      const typedProgress = progressRow as MissionProgressRow | null;
      setProgress(typedProgress);

      if (isEditableStatus(typedProgress?.status)) {
        setSelectedStatus(typedProgress.status);
      }

      if (!typedProgress) {
        setEvidences([]);
        setState("ready_empty");
        return;
      }

      const { data: evidenceRows, error: evidenceError } = await supabase
        .from("mission_evidence")
        .select("id,evidence_type,title,body,artifact_url,artifact_path,produced_at")
        .eq("progress_id", typedProgress.id)
        .order("produced_at", { ascending: false });

      if (!active) {
        return;
      }

      if (evidenceError) {
        setState("error");
        setFeedback("Nao foi possivel carregar as evidencias persistidas.");
        return;
      }

      setEvidences((evidenceRows ?? []) as MissionEvidenceRow[]);
      setState("ready_saved");
    }

    void loadProgress();

    return () => {
      active = false;
    };
  }, [authStatus, contentId, errorMessage, supabase, user?.id]);

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para registrar esta ação.");
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const payload = buildProgressUpsert({
        userId: user.id,
        contentId,
        nextStatus: selectedStatus,
        currentStartedAt: progress?.started_at,
      });

      const { data, error } = await supabase
        .from("mission_progress")
        .upsert(payload, { onConflict: "user_id,content_id" })
        .select("id,user_id,content_id,status,started_at,completed_at")
        .single();

      if (error) {
        setState("error");
        setFeedback("Nao foi possivel salvar o estado da missao.");
        return;
      }

      setProgress(data as MissionProgressRow);
      setState("ready_saved");
      setFeedback("Estado persistido nesta missao.");
    } catch {
      setState("error");
      setFeedback("Revise o estado escolhido antes de salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEvidenceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para registrar esta ação.");
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const currentProgress = progress ?? await ensureProgress();

      if (!currentProgress) {
        setState("error");
        setFeedback("Nao foi possivel preparar o progresso da missao.");
        return;
      }

      const payload = buildEvidenceInsert({
        userId: user.id,
        progressId: currentProgress.id,
        evidenceType,
        title: evidenceTitle,
        body: evidenceBody,
        artifactUrl,
        artifactPath,
      });

      const { data, error } = await supabase
        .from("mission_evidence")
        .insert(payload)
        .select("id,evidence_type,title,body,artifact_url,artifact_path,produced_at")
        .single();

      if (error) {
        setState("error");
        setFeedback("Nao foi possivel salvar a evidencia.");
        return;
      }

      setEvidences((current) => [data as MissionEvidenceRow, ...current]);
      setEvidenceTitle("");
      setEvidenceBody("");
      setArtifactUrl("");
      setArtifactPath("");
      setState("ready_saved");
      setFeedback("Evidencia persistida nesta missao.");
    } catch {
      setState("error");
      setFeedback("Revise a evidencia antes de salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function ensureProgress(): Promise<MissionProgressRow | null> {
    if (!canMutate || !supabase || !user?.id) {
      return null;
    }

    const payload = buildProgressUpsert({
      userId: user.id,
      contentId,
      nextStatus: selectedStatus,
      currentStartedAt: progress?.started_at,
    });

    const { data, error } = await supabase
      .from("mission_progress")
      .upsert(payload, { onConflict: "user_id,content_id" })
      .select("id,user_id,content_id,status,started_at,completed_at")
      .single();

    if (error) {
      return null;
    }

    const nextProgress = data as MissionProgressRow;
    setProgress(nextProgress);
    return nextProgress;
  }

  const statusLabel = isEditableStatus(progress?.status)
    ? getMissionProgressStatusLabel(progress.status)
    : getMissionProgressStatusLabel(null);

  return (
    <section className={styles.realProgressPanel} aria-labelledby="progresso-real-titulo">
      <div className={styles.realProgressHeader}>
        <div>
          <p className={styles.sectionKicker}>Progresso real persistido</p>
          <h2 id="progresso-real-titulo">{missionTitle}</h2>
        </div>
        <span>{statusLabel}</span>
      </div>

      {state === "unconfigured" ? (
        <p className={styles.realProgressNotice}>
          Supabase nao esta configurado neste ambiente local. A missao continua legivel, mas estado e evidencia persistidos ficam desligados.
        </p>
      ) : null}

      {state === "signed_out" ? (
        <div className={styles.realProgressNotice}>
          <p>Leia a missão livremente. Entre com Google para iniciar, registrar status ou salvar evidências.</p>
          <GoogleSignInButton compact />
        </div>
      ) : null}

      {state === "loading" ? (
        <p className={styles.realProgressNotice}>Carregando telemetria da missao...</p>
      ) : null}

      {state === "error" ? (
        <p className={styles.realProgressNotice}>
          {feedback || "Falha ao acessar o progresso persistido."}
        </p>
      ) : null}

      {canMutate && (state === "ready_empty" || state === "ready_saved" || state === "error") ? (
        <div className={styles.realProgressGrid}>
          <form className={styles.realProgressForm} onSubmit={handleStatusSubmit}>
            <fieldset>
              <legend>Estado manual</legend>
              <div className={styles.statusControlGroup}>
                {editableStatuses.map((status) => (
                  <label key={status}>
                    <input
                      type="radio"
                      name="mission-status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                    />
                    <span>{getMissionProgressStatusLabel(status)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={isSaving || !canMutate}>
              Salvar estado
            </button>
          </form>

          <form className={styles.realProgressForm} onSubmit={handleEvidenceSubmit}>
            <fieldset>
              <legend>Evidencia real</legend>
              <label>
                Tipo
                <select
                  value={evidenceType}
                  onChange={(event) => setEvidenceType(event.target.value as MissionEvidenceType)}
                >
                  {evidenceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Titulo
                <input
                  value={evidenceTitle}
                  onChange={(event) => setEvidenceTitle(event.target.value)}
                  placeholder="Ex.: Contrato request response desenhado"
                />
              </label>
              <label>
                Corpo
                <textarea
                  value={evidenceBody}
                  onChange={(event) => setEvidenceBody(event.target.value)}
                  placeholder="Resultado, decisao, teste, comparacao ou proximo passo..."
                  rows={5}
                />
              </label>
              <label>
                URL do artefato
                <input
                  value={artifactUrl}
                  onChange={(event) => setArtifactUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label>
                Caminho local
                <input
                  value={artifactPath}
                  onChange={(event) => setArtifactPath(event.target.value)}
                  placeholder="docs/notas/exemplo.md"
                />
              </label>
            </fieldset>
            <button type="submit" disabled={isSaving || !canMutate}>
              Salvar evidencia
            </button>
          </form>
        </div>
      ) : null}

      {feedback && state !== "unconfigured" && state !== "signed_out" ? (
        <p className={styles.realProgressFeedback} aria-live="polite">{feedback}</p>
      ) : null}

      {evidences.length > 0 ? (
        <div className={styles.evidenceDeck} aria-label="Evidencias persistidas">
          {evidences.map((evidence) => (
            <article key={evidence.id} className={styles.evidenceItem}>
              <span>{evidence.evidence_type}</span>
              <h3>{evidence.title}</h3>
              {evidence.body ? <p>{evidence.body}</p> : null}
              {evidence.artifact_url ? <a href={evidence.artifact_url}>Abrir artefato</a> : null}
              {evidence.artifact_path ? <small>{evidence.artifact_path}</small> : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function isEditableStatus(
  status: MissionProgressRow["status"] | undefined,
): status is MissionProgressStatus {
  return status === "in_progress" || status === "blocked" || status === "completed";
}
