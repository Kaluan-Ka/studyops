"use client";

import { useEffect, useState } from "react";

import { GoogleSignInButton } from "@/components/AuthControl";
import { useAuth } from "@/components/AuthProvider";
import {
  parseStoredNotes,
  readNote,
  removeNote,
  serializeStoredNotes,
  writeNote,
} from "@/lib/notes";
import { getStudyNoteAuthView } from "@/lib/studyNoteAccess";

import styles from "@/app/content.module.css";

const STORAGE_KEY = "studyops:notes:v1";

type StudyNoteProps = {
  noteKey: string;
  label: string;
};

type NoteState = "loading" | "empty" | "saved" | "dirty" | "error";

export function StudyNote({ noteKey, label }: StudyNoteProps) {
  const { status: authStatus, user } = useAuth();
  const authView = getStudyNoteAuthView(authStatus, Boolean(user?.id));
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [state, setState] = useState<NoteState>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!authView.canMutate) {
        setText("");
        setSavedText("");
        setState("loading");
        return;
      }

      try {
        const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
        const note = readNote(stored, noteKey);
        const restoredText = note?.text ?? "";

        setText(restoredText);
        setSavedText(restoredText);
        setState(restoredText ? "saved" : "empty");
      } catch {
        setState("error");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [authView.canMutate, noteKey]);

  function handleChange(value: string) {
    setText(value);
    setState(value === savedText ? (value ? "saved" : "empty") : "dirty");
  }

  function handleSave() {
    if (!authView.canMutate) {
      return;
    }

    try {
      const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
      const next = writeNote(stored, noteKey, text);

      window.localStorage.setItem(STORAGE_KEY, serializeStoredNotes(next));
      setSavedText(text);
      setState(text ? "saved" : "empty");
    } catch {
      setState("error");
    }
  }

  function handleClear() {
    if (!authView.canMutate) {
      return;
    }

    if (!window.confirm("Limpar esta anotação?")) {
      return;
    }

    try {
      const stored = parseStoredNotes(window.localStorage.getItem(STORAGE_KEY));
      const next = removeNote(stored, noteKey);

      window.localStorage.setItem(STORAGE_KEY, serializeStoredNotes(next));
      setText("");
      setSavedText("");
      setState("empty");
    } catch {
      setState("error");
    }
  }

  const statusMessage = {
    loading: "Carregando anotação...",
    empty: "Nenhuma anotação salva.",
    saved: "Anotação salva neste navegador.",
    dirty: "Alterações ainda não salvas.",
    error: "Não foi possível acessar as anotações neste navegador.",
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
              Evidencia, duvida, resultado ou proximo passo
            </label>
            <textarea
              id={`${noteKey}-input`}
              className={styles.studyNoteTextarea}
              value={text}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="Registre uma observação técnica, decisão, teste, falha ou próxima aplicação..."
              rows={7}
              disabled={state === "loading"}
            />
            <div className={styles.studyNoteActions}>
              <button type="button" className={styles.studyNoteSave} onClick={handleSave} disabled={state === "loading" || state === "error"}>
                Salvar registro
              </button>
              <button type="button" className={styles.studyNoteClear} onClick={handleClear} disabled={state === "loading" || (!text && !savedText)}>
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
