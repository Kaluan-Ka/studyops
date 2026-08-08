"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import type { PortfolioProjectProgressStatus } from "@/lib/projectProgress";

import styles from "@/app/progresso/page.module.css";

type TaskOption = { id: string; title: string; fundamentTitle: string };
type ProjectOption = { id: string; title: string };
type MissionRow = { content_id: string; status: string; updated_at: string };
type ProjectRow = { project_id: string; status: PortfolioProjectProgressStatus; updated_at: string };
type CycleRow = { id: string; objective: string; status: string; starts_on: string; ends_on: string };

export function ProgressDashboardWorkspace({ tasks, projects }: { tasks: TaskOption[]; projects: ProjectOption[] }) {
  const { status: authStatus, user, supabase } = useAuth();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [projectRows, setProjectRows] = useState<ProjectRow[]>([]);
  const [cycles, setCycles] = useState<CycleRow[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (authStatus === "unconfigured" || authStatus === "signed_out") {
        setState("ready"); setMissions([]); setProjectRows([]); setCycles([]); return;
      }
      if (authStatus === "error") {
        setState("error"); setFeedback("Não foi possível verificar a sessão."); return;
      }
      if (authStatus !== "authenticated" || !supabase || !user?.id) return;
      const [missionResult, projectResult, cycleResult] = await Promise.all([
        supabase.from("mission_progress").select("content_id,status,updated_at").order("updated_at", { ascending: false }),
        supabase.from("portfolio_project_progress").select("project_id,status,updated_at").order("updated_at", { ascending: false }),
        supabase.from("study_cycles").select("id,objective,status,starts_on,ends_on").order("starts_on", { ascending: false }).limit(12),
      ]);
      if (!active) return;
      const error = missionResult.error || projectResult.error || cycleResult.error;
      if (error) { setState("error"); setFeedback("Não foi possível montar o progresso consolidado."); return; }
      setMissions((missionResult.data ?? []) as MissionRow[]);
      setProjectRows((projectResult.data ?? []) as ProjectRow[]);
      setCycles((cycleResult.data ?? []) as CycleRow[]);
      setState("ready");
    }
    void load();
    return () => { active = false; };
  }, [authStatus, supabase, user?.id]);

  if (authStatus === "unconfigured") return <Status title="Supabase não configurado" message="Configure o ambiente para visualizar seu progresso consolidado." />;
  if (authStatus === "signed_out") return <Status title="Entre para ver seu progresso" message="O dashboard junta missões, ciclos e projetos da sua conta." action={<GoogleSignInButton compact />} />;
  if (state === "loading") return <Status title="Sincronizando progresso" message="Carregando o estado real da sua trilha..." />;
  if (state === "error") return <Status title="Falha na leitura" message={feedback} />;

  const latestMission = new Map(missions.map((row) => [row.content_id, row]));
  const completedMissions = tasks.filter((task) => latestMission.get(task.id)?.status === "completed").length;
  const nextTask = tasks.find((task) => latestMission.get(task.id)?.status !== "completed" && latestMission.get(task.id)?.status !== "skipped");
  const completedProjects = projects.filter((project) => projectRows.find((row) => row.project_id === project.id)?.status === "completed").length;
  const activeCycle = cycles.find((cycle) => cycle.status === "active");
  const inProgressMissions = tasks.filter((task) => latestMission.get(task.id)?.status === "in_progress").length;

  return <div className={styles.workspace}>
    <section className={styles.introPanel}><div><p className={styles.eyebrow}>Centro de comando</p><h1>Progresso consolidado</h1><p>Uma leitura única do que foi iniciado, concluído e do próximo passo operacional.</p></div><div className={styles.telemetry}><span>Missões concluídas</span><strong>{completedMissions}/{tasks.length}</strong><small>{inProgressMissions} em execução</small></div></section>
    <section className={styles.metricGrid} aria-label="Indicadores de progresso">
      <Metric label="Trilha" value={`${Math.round((completedMissions / Math.max(tasks.length, 1)) * 100)}%`} detail={`${completedMissions} de ${tasks.length} missões`} />
      <Metric label="Projetos" value={`${completedProjects}/${projects.length}`} detail="projetos concluídos" />
      <Metric label="Ciclos" value={String(cycles.length)} detail={activeCycle ? "há um ciclo ativo" : "nenhum ciclo ativo"} />
    </section>
    <div className={styles.dashboardGrid}>
      <section className={styles.panel}><p className={styles.panelKicker}>Próxima ação</p><h2>{nextTask?.title ?? "Nenhuma missão pendente"}</h2>{nextTask ? <><p>{nextTask.fundamentTitle} · {nextTask.id}</p><a href={`/fundamentos/${slugFor(nextTask.fundamentTitle)}/tarefas/${slugFor(nextTask.title)}`}>Abrir missão</a></> : null}</section>
      <section className={styles.panel}><p className={styles.panelKicker}>Ciclo em foco</p><h2>{activeCycle?.objective ?? "Abra um ciclo de estudo"}</h2><p>{activeCycle ? `${formatDate(activeCycle.starts_on)} → ${formatDate(activeCycle.ends_on)}` : "Planeje uma semana e conecte tarefas."}</p><a href="/ciclos">Ir para ciclos</a></section>
    </div>
    <section className={styles.panel}><div className={styles.panelHeader}><div><p className={styles.panelKicker}>Mapa de execução</p><h2>Missões acompanhadas</h2></div><a href="/projetos">Ver projetos</a></div><div className={styles.taskList}>{tasks.slice(0, 12).map((task) => <div className={styles.taskRow} key={task.id}><span>{task.id}</span><strong>{task.title}</strong><em>{getMissionLabel(latestMission.get(task.id)?.status)}</em></div>)}</div></section>
  </div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className={styles.metric}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function Status({ title, message, action }: { title: string; message: string; action?: ReactNode }) { return <section className={styles.statusPanel}><p className={styles.eyebrow}>Progresso</p><h1>{title}</h1><p>{message}</p>{action}</section>; }
function getMissionLabel(status?: string) { return ({ completed: "Concluída", in_progress: "Em execução", blocked: "Bloqueada", skipped: "Ignorada", not_started: "Não iniciada" } as Record<string, string>)[status ?? "not_started"] ?? "Não iniciada"; }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR"); }
function slugFor(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
