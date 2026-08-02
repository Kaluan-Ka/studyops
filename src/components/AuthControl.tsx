"use client";

import { getAuthControlView } from "@/lib/authControl";

import { useAuth } from "./AuthProvider";

import styles from "./AuthControl.module.css";

export { getAuthControlView } from "@/lib/authControl";

export function GoogleSignInButton({ compact = false }: { compact?: boolean }) {
  const { status, signInWithGoogle } = useAuth();

  return (
    <button
      type="button"
      className={compact ? styles.googleButtonCompact : styles.googleButton}
      onClick={() => void signInWithGoogle()}
      disabled={status === "loading" || status === "unconfigured"}
    >
      Entrar com Google
    </button>
  );
}

export function AuthControl() {
  const { status, user, errorMessage, signOut } = useAuth();
  const view = getAuthControlView({ status, email: user?.email ?? null });

  if (view.action === "none") {
    return <span className={styles.authStatus}>{view.message}</span>;
  }

  return (
    <div className={styles.authDock} aria-label="Autenticação do StudyOps">
      {status === "error" ? (
        <span className={styles.authError}>{errorMessage ?? view.message}</span>
      ) : null}
      {view.action === "sign_out" ? (
        <>
          <span className={styles.authUser}>{view.message}</span>
          <button type="button" className={styles.signOutButton} onClick={() => void signOut()}>
            Sair
          </button>
        </>
      ) : (
        <GoogleSignInButton />
      )}
    </div>
  );
}
