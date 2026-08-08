"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import { canMutateWithAuth } from "@/lib/authAccess";
import {
  buildProgressUpsert,
  getMissionProgressStatusLabel,
  isMissionProgressStatus,
  type MissionProgressStatus,
} from "@/lib/missionProgress";
import {
  buildStudyCycleInsert,
  buildStudyCycleTaskInsert,
  buildStudyCycleUpdate,
  getStudyCycleStatusLabel,
  isStudyCycleStatus,
  type StudyCycleStatus,
  type StudyCycleTaskStatus,
} from "@/lib/studyCycles";

import styles from "@/app/ciclos/page.module.css";

type TaskOption = {
  id: string;
  title: string;
  fundamentTitle: string;
};

type ProjectOption = { id: string; title: string };

type CycleRow = {
  id: string;
  user_id: string;
  starts_on: string;
  ends_on: string;
  objective: string;
  status: StudyCycleStatus;
  review: string | null;
  next_step: string | null;
  reviewed_at: string | null;
  completed_at: string | null;
};

type CycleTaskRow = {
  id: string;
  user_id: string;
  cycle_id: string;
  content_id: string;
  position: number;
  planned_note: string | null;
};

type MissionProgressRow = {
  content_id: string;
  status: StudyCycleTaskStatus;
  started_at: string | null;
  completed_at: string | null;
};

type CycleTaskView = CycleTaskRow & {
  title: string;
  fundamentTitle: string;
  mission: MissionProgressRow;
};

type CycleProjectRow = { id: string; user_id: string; cycle_id: string; project_id: string; position: number };
type CycleProjectView = CycleProjectRow & { title: string };

type CycleView = {
  cycle: CycleRow;
  tasks: CycleTaskView[];
  projects: CycleProjectView[];
};

type CycleForm = {
  startsOn: string;
  endsOn: string;
  objective: string;
  status: StudyCycleStatus;
  review: string;
  nextStep: string;
};

type TaskDraft = {
  contentId: string;
  plannedNote: string;
};

type WorkspaceState = "unconfigured" | "signed_out" | "loading" | "ready" | "error";

type CycleLoadResult = {
  state: WorkspaceState;
  cycles: CycleView[];
  message?: string;
};

const cycleStatusOptions: Array<{ value: StudyCycleStatus; label: string }> = [
  { value: "planned", label: "Planejado" },
  { value: "active", label: "Em andamento" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

const missionStatusOptions: Array<{ value: MissionProgressStatus; label: string }> = [
  { value: "in_progress", label: "Em execução" },
  { value: "blocked", label: "Bloqueada" },
  { value: "completed", label: "Concluída" },
];

export function StudyCyclesWorkspace({ taskOptions, projectOptions }: { taskOptions: TaskOption[]; projectOptions: ProjectOption[] }) {
  const { status: authStatus, user, supabase, errorMessage } = useAuth();
  const canMutate = canMutateWithAuth(authStatus, user?.id);
  const [state, setState] = useState<WorkspaceState>("loading");
  const [cycles, setCycles] = useState<CycleView[]>([]);
  const [form, setForm] = useState<CycleForm>(makeInitialCycleForm);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const [taskDrafts, setTaskDrafts] = useState<Record<string, TaskDraft>>({});
  const [projectDrafts, setProjectDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const loadSequence = useRef(0);

  const fetchCycles = useCallback(async (): Promise<CycleLoadResult | null> => {
    const sequence = ++loadSequence.current;

    if (authStatus === "unconfigured") {
      return { state: "unconfigured", cycles: [] };
    }

    if (authStatus === "signed_out") {
      return { state: "signed_out", cycles: [] };
    }

    if (authStatus === "error") {
      return {
        state: "error",
        cycles: [],
        message: errorMessage ?? "Não foi possível verificar a sessão.",
      };
    }

    if (authStatus !== "authenticated" || !supabase || !user?.id) {
      return { state: "loading", cycles: [] };
    }

    const { data: cycleRows, error: cycleError } = await supabase
      .from("study_cycles")
      .select(
        "id,user_id,starts_on,ends_on,objective,status,review,next_step,reviewed_at,completed_at",
      )
      .order("starts_on", { ascending: false });

    if (sequence !== loadSequence.current) {
      return null;
    }

    if (cycleError) {
      return {
        state: "error",
        cycles: [],
        message: "Não foi possível carregar os ciclos persistidos.",
      };
    }

    const typedCycles = ((cycleRows ?? []) as CycleRow[]).filter((cycle) =>
      isStudyCycleStatus(cycle.status),
    );
    const cycleIds = typedCycles.map((cycle) => cycle.id);
    const { data: taskRows, error: taskError } = cycleIds.length
      ? await supabase
        .from("study_cycle_tasks")
        .select("id,user_id,cycle_id,content_id,position,planned_note")
        .in("cycle_id", cycleIds)
        .order("position", { ascending: true })
      : { data: [], error: null };

    if (sequence !== loadSequence.current) {
      return null;
    }

    if (taskError) {
      return {
        state: "error",
        cycles: [],
        message: "Não foi possível carregar as tarefas dos ciclos.",
      };
    }

    const typedTasks = (taskRows ?? []) as CycleTaskRow[];
    const { data: projectRows, error: projectError } = cycleIds.length
      ? await supabase
        .from("study_cycle_projects")
        .select("id,user_id,cycle_id,project_id,position")
        .in("cycle_id", cycleIds)
        .order("position", { ascending: true })
      : { data: [], error: null };

    if (sequence !== loadSequence.current) return null;
    if (projectError) {
      return { state: "error", cycles: [], message: "Não foi possível carregar os projetos dos ciclos." };
    }

    const contentIds = [...new Set(typedTasks.map((task) => task.content_id))];
    const { data: progressRows, error: progressError } = contentIds.length
      ? await supabase
        .from("mission_progress")
        .select("content_id,status,started_at,completed_at")
        .in("content_id", contentIds)
      : { data: [], error: null };

    if (sequence !== loadSequence.current) {
      return null;
    }

    if (progressError) {
      return {
        state: "error",
        cycles: [],
        message: "Não foi possível carregar o estado das missões.",
      };
    }

    const progressByContentId = new Map(
      ((progressRows ?? []) as MissionProgressRow[]).map((progress) => [
        progress.content_id,
        progress,
      ]),
    );
    const optionsById = new Map(taskOptions.map((option) => [option.id, option]));
    const projectsById = new Map(projectOptions.map((option) => [option.id, option]));
    const typedProjects = (projectRows ?? []) as CycleProjectRow[];
    const nextCycles = typedCycles.map((cycle) => ({
      cycle,
      tasks: typedTasks
        .filter((task) => task.cycle_id === cycle.id)
        .map((task) => ({
          ...task,
          title: optionsById.get(task.content_id)?.title ?? task.content_id,
          fundamentTitle: optionsById.get(task.content_id)?.fundamentTitle ?? "Tarefa da trilha",
          mission: progressByContentId.get(task.content_id) ?? {
            content_id: task.content_id,
            status: "not_started" as const,
            started_at: null,
            completed_at: null,
          },
        })),
      projects: typedProjects
        .filter((project) => project.cycle_id === cycle.id)
        .map((project) => ({
          ...project,
          title: projectsById.get(project.project_id)?.title ?? project.project_id,
        })),
    }));

    return { state: "ready", cycles: nextCycles };
  }, [authStatus, errorMessage, projectOptions, supabase, taskOptions, user?.id]);

  const applyCycleLoadResult = useCallback((result: CycleLoadResult) => {
    setCycles(result.cycles);
    setState(result.state);

    if (result.message) {
      setFeedback(result.message);
    } else if (result.state !== "ready") {
      setFeedback("");
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function synchronizeCycles() {
      const result = await fetchCycles();

      if (active && result) {
        applyCycleLoadResult(result);
      }
    }

    void synchronizeCycles();

    return () => {
      active = false;
    };
  }, [applyCycleLoadResult, fetchCycles]);

  async function refreshCycles() {
    const result = await fetchCycles();

    if (result) {
      applyCycleLoadResult(result);
    }
  }

  function updateForm<K extends keyof CycleForm>(field: K, value: CycleForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(cycle: CycleRow) {
    setEditingCycleId(cycle.id);
    setForm({
      startsOn: cycle.starts_on,
      endsOn: cycle.ends_on,
      objective: cycle.objective,
      status: cycle.status,
      review: cycle.review ?? "",
      nextStep: cycle.next_step ?? "",
    });
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingCycleId(null);
    setForm(makeInitialCycleForm());
    setFeedback("");
  }

  async function handleCycleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para registrar um ciclo.");
      return;
    }

    if (form.status === "completed" && (!form.review.trim() || !form.nextStep.trim())) {
      setFeedback("Ao concluir um ciclo, registre a revisão e o próximo passo.");
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const existingCycle = cycles.find((item) => item.cycle.id === editingCycleId)?.cycle;
      const completedAt = form.status === "completed"
        ? existingCycle?.completed_at ?? new Date().toISOString()
        : null;
      const reviewedAt = form.status === "completed"
        ? existingCycle?.reviewed_at ?? new Date().toISOString()
        : null;

      if (editingCycleId) {
        const payload = buildStudyCycleUpdate({
          startsOn: form.startsOn,
          endsOn: form.endsOn,
          objective: form.objective,
          status: form.status,
          review: form.review,
          nextStep: form.nextStep,
          reviewedAt,
          completedAt,
        });
        const { error } = await supabase
          .from("study_cycles")
          .update(payload)
          .eq("id", editingCycleId)
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        setFeedback("Ciclo atualizado.");
      } else {
        const payload = buildStudyCycleInsert({
          userId: user.id,
          startsOn: form.startsOn,
          endsOn: form.endsOn,
          objective: form.objective,
          status: form.status,
        });
        const { error } = await supabase
          .from("study_cycles")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        setFeedback("Ciclo criado.");
      }

      await refreshCycles();
      if (!editingCycleId) {
        resetForm();
      }
    } catch (error) {
      setState("error");
      setFeedback(getDatabaseErrorMessage(error, "Não foi possível salvar o ciclo."));
    } finally {
      setIsSaving(false);
    }
  }

  function updateTaskDraft(cycleId: string, field: keyof TaskDraft, value: string) {
    setTaskDrafts((current) => ({
      ...current,
      [cycleId]: {
        contentId: current[cycleId]?.contentId ?? "",
        plannedNote: current[cycleId]?.plannedNote ?? "",
        [field]: value,
      },
    }));
  }

  async function handleTaskSubmit(event: FormEvent<HTMLFormElement>, cycle: CycleView) {
    event.preventDefault();

    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para associar uma tarefa.");
      return;
    }

    const draft = taskDrafts[cycle.cycle.id] ?? { contentId: "", plannedNote: "" };
    const selectedContentIds = new Set(cycle.tasks.map((task) => task.content_id));

    if (selectedContentIds.has(draft.contentId)) {
      setFeedback("Essa tarefa já está associada a este ciclo.");
      return;
    }

    setIsSaving(true);
    setFeedback("");

    try {
      const payload = buildStudyCycleTaskInsert({
        userId: user.id,
        cycleId: cycle.cycle.id,
        contentId: draft.contentId,
        position: cycle.tasks.length + 1,
        plannedNote: draft.plannedNote,
      });
      const { error } = await supabase.from("study_cycle_tasks").insert(payload);

      if (error) {
        throw error;
      }

      setTaskDrafts((current) => ({ ...current, [cycle.cycle.id]: { contentId: "", plannedNote: "" } }));
      setFeedback("Tarefa associada ao ciclo.");
      await refreshCycles();
    } catch (error) {
      setState("error");
      setFeedback(getDatabaseErrorMessage(error, "Não foi possível associar a tarefa."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>, cycle: CycleView) {
    event.preventDefault();
    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para associar um projeto.");
      return;
    }

    const projectId = projectDrafts[cycle.cycle.id] ?? "";
    if (!projectId || cycle.projects.some((project) => project.project_id === projectId)) {
      setFeedback("Escolha um projeto novo para este ciclo.");
      return;
    }

    setIsSaving(true);
    setFeedback("");
    try {
      const { error } = await supabase.from("study_cycle_projects").insert({
        user_id: user.id,
        cycle_id: cycle.cycle.id,
        project_id: projectId,
        position: cycle.projects.length + 1,
      });
      if (error) throw error;
      setProjectDrafts((current) => ({ ...current, [cycle.cycle.id]: "" }));
      setFeedback("Projeto associado ao ciclo.");
      await refreshCycles();
    } catch (error) {
      setState("error");
      setFeedback(getDatabaseErrorMessage(error, "Não foi possível associar o projeto."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveTask(task: CycleTaskView) {
    if (!canMutate || !supabase) return;
    setIsSaving(true);
    setFeedback("");
    try {
      const { error } = await supabase.from("study_cycle_tasks").delete().eq("id", task.id);
      if (error) throw error;
      setFeedback("Tarefa removida do ciclo.");
      await refreshCycles();
    } catch (error) {
      setState("error");
      setFeedback(getDatabaseErrorMessage(error, "Não foi possível remover a tarefa."));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMissionStatusChange(
    task: CycleTaskView,
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    if (!canMutate || !supabase || !user?.id) {
      setFeedback("Entre com Google para atualizar uma missão.");
      return;
    }

    if (!isMissionProgressStatus(event.target.value)) {
      return;
    }

    const nextStatus = event.target.value;
    setIsSaving(true);
    setFeedback("");

    try {
      const payload = buildProgressUpsert({
        userId: user.id,
        contentId: task.content_id,
        nextStatus,
        currentStartedAt: task.mission.started_at,
      });
      const { error } = await supabase
        .from("mission_progress")
        .upsert(payload, { onConflict: "user_id,content_id" });

      if (error) {
        throw error;
      }

      setFeedback("Estado da missão atualizado.");
      await refreshCycles();
    } catch (error) {
      setState("error");
      setFeedback(getDatabaseErrorMessage(error, "Não foi possível atualizar a missão."));
    } finally {
      setIsSaving(false);
    }
  }

  if (state === "unconfigured") {
    return <StatusPanel title="Supabase não configurado" message="Configure o ambiente para ativar ciclos persistidos." />;
  }

  if (state === "signed_out") {
    return (
      <StatusPanel
        title="Entre para abrir o seu ciclo"
        message="Os ciclos são privados e ficam associados à sua conta Google."
        action={<GoogleSignInButton compact />}
      />
    );
  }

  return (
    <div className={styles.workspace}>
      <section className={styles.introPanel} aria-labelledby="ciclos-titulo">
        <div>
          <p className={styles.eyebrow}>Operação semanal</p>
          <h1 id="ciclos-titulo">Ciclos de estudo</h1>
          <p>
            Planeje uma semana concreta, conecte tarefas da trilha e feche o ciclo com uma revisão
            que indique a próxima aplicação.
          </p>
        </div>
        <div className={styles.telemetry} aria-label="Telemetria dos ciclos">
          <span>Ciclos registrados</span>
          <strong>{cycles.length}</strong>
          <small>{cycles.some(({ cycle }) => cycle.status === "active") ? "Há uma operação em andamento" : "Nenhuma operação ativa"}</small>
        </div>
      </section>

      <div className={styles.layout}>
        <section className={styles.formPanel} aria-labelledby="ciclo-form-titulo">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelKicker}>Briefing</p>
              <h2 id="ciclo-form-titulo">{editingCycleId ? "Editar ciclo" : "Abrir novo ciclo"}</h2>
            </div>
            {editingCycleId ? (
              <button type="button" className={styles.quietButton} onClick={resetForm}>
                Novo ciclo
              </button>
            ) : null}
          </div>

          <form className={styles.cycleForm} onSubmit={(event) => void handleCycleSubmit(event)}>
            <div className={styles.formGrid}>
              <label>
                Início
                <input
                  type="date"
                  value={form.startsOn}
                  onChange={(event) => updateForm("startsOn", event.target.value)}
                  required
                />
              </label>
              <label>
                Fim
                <input
                  type="date"
                  value={form.endsOn}
                  onChange={(event) => updateForm("endsOn", event.target.value)}
                  required
                />
              </label>
            </div>
            <label>
              Objetivo da semana
              <textarea
                value={form.objective}
                onChange={(event) => updateForm("objective", event.target.value)}
                placeholder="Ex.: implementar e testar uma busca textual pequena"
                rows={3}
                required
              />
            </label>
            <label>
              Estado do ciclo
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as StudyCycleStatus)}
              >
                {cycleStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Revisão
              <textarea
                value={form.review}
                onChange={(event) => updateForm("review", event.target.value)}
                placeholder="O que funcionou, falhou ou ficou claro?"
                rows={3}
              />
            </label>
            <label>
              Próximo passo
              <textarea
                value={form.nextStep}
                onChange={(event) => updateForm("nextStep", event.target.value)}
                placeholder="Qual é a próxima aplicação concreta?"
                rows={3}
              />
            </label>
            <button type="submit" className={styles.primaryButton} disabled={isSaving || !canMutate}>
              {isSaving ? "Salvando..." : editingCycleId ? "Salvar ciclo" : "Criar ciclo"}
            </button>
          </form>
        </section>

        <section className={styles.cyclesPanel} aria-labelledby="ciclos-lista-titulo">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelKicker}>Inventário operacional</p>
              <h2 id="ciclos-lista-titulo">Seus ciclos</h2>
            </div>
            <span className={styles.panelMeta}>{state === "loading" ? "Sincronizando" : "Dados reais"}</span>
          </div>

          {state === "loading" ? <p className={styles.muted}>Carregando ciclos...</p> : null}
          {state === "error" ? <p className={styles.error} role="alert">{feedback}</p> : null}
          {state === "ready" && cycles.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>Nenhum ciclo registrado.</strong>
              <p>Abra o primeiro ciclo no briefing ao lado e transforme a semana em uma entrega.</p>
            </div>
          ) : null}
          <div className={styles.cycleList}>
            {cycles.map((cycle) => (
              <article className={styles.cycleCard} key={cycle.cycle.id}>
                <div className={styles.cycleCardHeader}>
                  <div>
                    <span className={styles.cardKicker}>{formatCycleDates(cycle.cycle.starts_on, cycle.cycle.ends_on)}</span>
                    <h3>{cycle.cycle.objective}</h3>
                  </div>
                  <span className={styles.statusBadge}>{getStudyCycleStatusLabel(cycle.cycle.status)}</span>
                </div>

                <div className={styles.cycleNotes}>
                  <div>
                    <span>Revisão</span>
                    <p>{cycle.cycle.review || "Ainda não registrada."}</p>
                  </div>
                  <div>
                    <span>Próximo passo</span>
                    <p>{cycle.cycle.next_step || "Será definido no fechamento."}</p>
                  </div>
                </div>

                <div className={styles.taskStack}>
                  <div className={styles.taskStackHeader}>
                    <span>Tarefas associadas</span>
                    <strong>{cycle.tasks.length}</strong>
                  </div>
                  {cycle.tasks.map((task) => (
                    <div className={styles.taskCard} key={task.id}>
                      <div>
                        <span>{task.fundamentTitle} · {task.content_id}</span>
                        <strong>{task.title}</strong>
                        {task.planned_note ? <p>{task.planned_note}</p> : null}
                      </div>
                      <label className={styles.taskStatus}>
                        <span className={styles.srOnly}>Estado de {task.title}</span>
                        <select
                          value={task.mission.status}
                          onChange={(event) => void handleMissionStatusChange(task, event)}
                          disabled={!canMutate || isSaving}
                        >
                          {task.mission.status === "not_started" ? <option value="not_started">Não iniciada</option> : null}
                          {task.mission.status === "skipped" ? <option value="skipped">Ignorada</option> : null}
                          {missionStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <small>{getTaskStatusLabel(task.mission.status)}</small>
                        <button type="button" className={styles.textButton} onClick={() => void handleRemoveTask(task)} disabled={isSaving}>Remover</button>
                      </label>
                    </div>
                  ))}
                </div>

                <form className={styles.taskForm} onSubmit={(event) => void handleTaskSubmit(event, cycle)}>
                  <label>
                    Associar tarefa da trilha
                    <select
                      value={taskDrafts[cycle.cycle.id]?.contentId ?? ""}
                      onChange={(event) => updateTaskDraft(cycle.cycle.id, "contentId", event.target.value)}
                      required
                    >
                      <option value="">Escolha uma missão</option>
                      {taskOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.id} · {option.title}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Nota de planejamento
                    <input
                      type="text"
                      value={taskDrafts[cycle.cycle.id]?.plannedNote ?? ""}
                      onChange={(event) => updateTaskDraft(cycle.cycle.id, "plannedNote", event.target.value)}
                      placeholder="O que será produzido?"
                    />
                  </label>
                  <button type="submit" className={styles.secondaryButton} disabled={isSaving || !canMutate}>
                    Associar tarefa
                  </button>
                </form>

                <div className={styles.taskStack}>
                  <div className={styles.taskStackHeader}>
                    <span>Projetos de portfolio</span>
                    <strong>{cycle.projects.length}</strong>
                  </div>
                  {cycle.projects.map((project) => (
                    <div className={styles.taskCard} key={project.id}>
                      <div><span>{project.project_id}</span><strong>{project.title}</strong></div>
                    </div>
                  ))}
                </div>

                <form className={styles.taskForm} onSubmit={(event) => void handleProjectSubmit(event, cycle)}>
                  <label>
                    Associar projeto
                    <select
                      value={projectDrafts[cycle.cycle.id] ?? ""}
                      onChange={(event) => setProjectDrafts((current) => ({ ...current, [cycle.cycle.id]: event.target.value }))}
                      required
                    >
                      <option value="">Escolha um projeto</option>
                      {projectOptions.map((project) => <option key={project.id} value={project.id}>{project.id} · {project.title}</option>)}
                    </select>
                  </label>
                  <button type="submit" className={styles.secondaryButton} disabled={isSaving || !canMutate}>Associar projeto</button>
                </form>

                <div className={styles.cardFooter}>
                  <span>{cycle.tasks.filter((task) => task.mission.status === "completed").length} missões concluídas</span>
                  <button type="button" className={styles.textButton} onClick={() => startEditing(cycle.cycle)}>
                    Editar ciclo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {feedback ? <p className={styles.feedback} role="status">{feedback}</p> : null}
    </div>
  );
}

function StatusPanel({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <section className={styles.statusPanel} aria-labelledby="ciclos-status-titulo">
      <p className={styles.eyebrow}>Ciclos de estudo</p>
      <h1 id="ciclos-status-titulo">{title}</h1>
      <p>{message}</p>
      {action ? <div className={styles.statusAction}>{action}</div> : null}
    </section>
  );
}

function getTaskStatusLabel(status: StudyCycleTaskStatus): string {
  if (status === "not_started") {
    return getMissionProgressStatusLabel(null);
  }

  if (status === "skipped") {
    return "Ignorada";
  }

  return getMissionProgressStatusLabel(status as MissionProgressStatus);
}

function makeInitialCycleForm(): CycleForm {
  const start = new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startsOn: toDateInputValue(start),
    endsOn: toDateInputValue(end),
    objective: "",
    status: "planned",
    review: "",
    nextStep: "",
  };
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCycleDates(startsOn: string, endsOn: string): string {
  const start = new Date(`${startsOn}T00:00:00`);
  const end = new Date(`${endsOn}T00:00:00`);
  return `${start.toLocaleDateString("pt-BR")} → ${end.toLocaleDateString("pt-BR")}`;
}

function getDatabaseErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "code" in error && error.code === "23505") {
    return "Este ciclo já entra em conflito com um registro existente.";
  }

  if (error && typeof error === "object" && "code" in error && error.code === "42501") {
    return "A sessão não tem permissão para alterar este registro.";
  }

  return fallback;
}
