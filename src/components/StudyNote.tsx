"use client";

import { useEffect, useState } from "react";

import {
  parseStoredNotes,
  readNote,
  removeNote,
  serializeStoredNotes,
  writeNote,
} from "@/lib/notes";

import styles from "@/app/content.module.css";

const STORAGE_KEY = "studyops:notes:v1";

type StudyNoteProps = {
  noteKey: string;
  label: string;
};

type NoteState = "loading" | "empty" | "saved" | "dirty" | "error";

export function StudyNote({ noteKey, label }: StudyNoteProps) {
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [state, setState] = useState<NoteState>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
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
  }, [noteKey]);

  function handleChange(value: string) {
    setText(value);
    setState(value === savedText ? (value ? "saved" : "empty") : "dirty");
  }

  function handleSave() {
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
    if (!window.confirm("Limpar esta anotacao?")) {
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
    loading: "Carregando anotacao...",
    empty: "Nenhuma anotacao salva.",
    saved: "Anotacao salva neste navegador.",
    dirty: "Alteracoes ainda nao salvas.",
    error: "Nao foi possivel acessar as anotacoes neste navegador.",
  }[state];

  return (
    <section className={styles.studyNote} aria-labelledby={`${noteKey}-label`}>
      <div className={styles.studyNoteRail} aria-hidden="true" />
      <div className={styles.studyNoteBody}>
        <div className={styles.studyNoteHeader}>
          <div>
            <p className={styles.studyNoteKicker}>Logbook tecnico</p>
            <h2 id={`${noteKey}-label`}>{label}</h2>
          </div>
          <span className={styles.studyNoteStatus} aria-live="polite">{statusMessage}</span>
        </div>
        <label className={styles.studyNoteLabel} htmlFor={`${noteKey}-input`}>
          Evidencia, duvida, resultado ou proximo passo
        </label>
        <textarea
          id={`${noteKey}-input`}
          className={styles.studyNoteTextarea}
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Registre uma observacao tecnica, decisao, teste, falha ou proxima aplicacao..."
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
      </div>
    </section>
  );
}
