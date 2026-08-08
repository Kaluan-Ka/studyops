"use client";

import { useEffect, useState } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import {
  parseStoredNotes,
  readNote,
  serializeStoredNotes,
  type NoteTarget,
} from "@/lib/notes";
import {
  buildStudyNoteUpsert,
  getLegacyNoteKey,
  removeLegacyNote,
  type StableStudyNoteTarget,
} from "@/lib/studyNotes";
import { deleteStudyNote, getStudyNote, saveStudyNote } from "@/lib/supabase/repositories/studyNotes";
import { getStudyNoteAuthView } from "@/lib/studyNoteAccess";

import styles from "@/app/content.module.css";

const STORAGE_KEY = "studyops:notes:v1";

type StudyNoteProps = {
  noteKey: string;
  label: string;
  target: StableStudyNoteTarget;
  legacyTarget?: NoteTarget;
};

type NoteState = "loading" | "empty" | "saved" | "dirty" | "error";

export function StudyNote({ noteKey, label, target, legacyTarget }: StudyNoteProps) {
  const { status: authStatus, user, supabase } = useAuth();
  const authView = getStudyNoteAuthView(authStatus, user?.id);
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [legacyText, setLegacyText] = useState("");
  const [state, setState] = useState<NoteState>("loading");
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!authView.canMutate || !supabase || !user?.id) {
        setText("");
        setSavedText("");
        setLegacyText("");
        setState("loading");
        return;
      }

      try {
        const remoteNote = await getStudyNote(supabase, user.id, target);
        if (!active) return;

        const remoteText = remoteNote?.body ?? "";
        setText(remoteText);
        setSavedText(remoteText);
        setState(remoteText ? "saved" : "empty");

        if (!remoteNote && legacyTarget) {
          const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
          setLegacyText(readNote(stored, getLegacyNoteKey(legacyTarget))?.text ?? "");
        } else {
          setLegacyText("");
        }
      } catch {
        if (active) setState("error");
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [authView.canMutate, legacyTarget, supabase, target, user?.id]);

  function handleChange(value: string) {
    setText(value);
    setState(value === savedText ? (value ? "saved" : "empty") : "dirty");
  }

  async function handleSave() {
    if (!authView.canMutate || !supabase || !user?.id || state === "loading") return;

    try {
      if (!text.trim()) {
        await deleteStudyNote(supabase, user.id, target);
        setSavedText("");
        setState("empty");
        return;
      }

      const saved = await saveStudyNote(
        supabase,
        buildStudyNoteUpsert({ userId: user.id, target, body: text }),
      );
      setText(saved.body);
      setSavedText(saved.body);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  async function handleClear() {
    if (!authView.canMutate || !supabase || !user?.id) return;
    if (!window.confirm("Limpar esta anotação?")) return;

    try {
      await deleteStudyNote(supabase, user.id, target);
      setText("");
      setSavedText("");
      setState("empty");
    } catch {
      setState("error");
    }
  }

  async function handleImportLegacy() {
    if (!authView.canMutate || !supabase || !user?.id || !legacyTarget || !legacyText) return;

    setIsImporting(true);
    try {
      await saveStudyNote(
        supabase,
        buildStudyNoteUpsert({ userId: user.id, target, body: legacyText }),
      );
      const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
      window.localStorage.setItem(
        STORAGE_KEY,
        serializeStoredNotes(removeLegacyNote(stored, legacyTarget)),
      );
      setText(legacyText);
      setSavedText(legacyText);
      setLegacyText("");
      setState("saved");
    } catch {
      setState("error");
    } finally {
      setIsImporting(false);
    }
  }

  const statusMessage = {
    loading: "Carregando anotação...",
    empty: "Nenhuma anotação salva.",
    saved: "Anotação salva no Supabase.",
    dirty: "Alterações ainda não salvas.",
    error: "Não foi possível carregar ou salvar esta anotação.",
  }[state];

  const editorIsVisible = authView.mode === "ready";

  return (
    <section className={styles.studyNote} aria-labelledby={`${noteKey}-label`}>
      <div className={styles.studyNoteRail} aria-hidden="true" />
      <div className={styles.studyNoteBody}>
        <div className={styles.studyNoteHeader}>
          <div>
            <p className={styles.studyNoteKicker}>Logbook técnico</p>
            <h2 id={`${noteKey}-label`}>{label}</h2>
          </div>
          <span className={styles.studyNoteStatus} aria-live="polite">
            {editorIsVisible ? statusMessage : authView.message}
          </span>
        </div>
        {editorIsVisible ? (
          <>
            <label className={styles.studyNoteLabel} htmlFor={`${noteKey}-input`}>
              Evidencia, dúvida, resultado ou próximo passo
            </label>
            <textarea
              id={`${noteKey}-input`}
              className={styles.studyNoteTextarea}
              value={text}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="Registre uma observação técnica, decisão, teste, falha ou próxima aplicação..."
              rows={7}
              disabled={state === "loading" || isImporting}
            />
            {legacyText ? (
              <div className={styles.studyNoteMigration}>
                <p>Encontramos uma anotação antiga salva neste navegador. Confirme que ela pertence a esta conta antes de importar.</p>
                <button type="button" className={styles.studyNoteSave} onClick={handleImportLegacy} disabled={isImporting}>
                  {isImporting ? "Importando..." : "Importar registro local"}
                </button>
              </div>
            ) : null}
            <div className={styles.studyNoteActions}>
              <button type="button" className={styles.studyNoteSave} onClick={() => void handleSave()} disabled={state === "loading" || state === "error" || isImporting}>
                Salvar registro
              </button>
              <button type="button" className={styles.studyNoteClear} onClick={() => void handleClear()} disabled={state === "loading" || (!text && !savedText) || isImporting}>
                Limpar
              </button>
            </div>
          </>
        ) : (
          <div className={styles.studyNoteGate}>
            <p>O conteúdo continua público. O registro técnico fica disponível após autenticação.</p>
            {authView.showSignIn ? <GoogleSignInButton compact /> : null}
          </div>
        )}
      </div>
    </section>
  );
}
