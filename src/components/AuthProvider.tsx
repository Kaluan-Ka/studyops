"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { syncUserProfile } from "@/lib/supabase/profile";

export type AuthStatus =
  | "unconfigured"
  | "loading"
  | "signed_out"
  | "authenticated"
  | "error";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  errorMessage: string | null;
  supabase: SupabaseClient | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function isCurrentAuthTransition(currentVersion: number, transitionVersion: number): boolean {
  return currentVersion === transitionVersion;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AuthStatus>(supabase ? "loading" : "unconfigured");
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const transitionVersion = useRef(0);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let active = true;
    const timers = new Set<number>();

    async function applyUser(nextUser: User | null, version: number) {
      if (!active || !isCurrentAuthTransition(transitionVersion.current, version)) {
        return;
      }

      setUser(nextUser);
      setErrorMessage(null);

      if (!nextUser) {
        setStatus("signed_out");
        return;
      }

      setStatus("loading");

      try {
        await syncUserProfile(client, nextUser);

        if (active && isCurrentAuthTransition(transitionVersion.current, version)) {
          setStatus("authenticated");
        }
      } catch {
        if (active && isCurrentAuthTransition(transitionVersion.current, version)) {
          setStatus("error");
          setErrorMessage("Nao foi possivel sincronizar seu perfil.");
        }
      }
    }

    const initialVersion = ++transitionVersion.current;

    async function loadInitialUser() {
      try {
        const { data, error } = await client.auth.getUser();

        if (error) {
          if (active && isCurrentAuthTransition(transitionVersion.current, initialVersion)) {
            setStatus("error");
            setErrorMessage("Nao foi possivel verificar a sessao.");
          }
          return;
        }

        void applyUser(data.user, initialVersion);
      } catch {
        if (active && isCurrentAuthTransition(transitionVersion.current, initialVersion)) {
          setStatus("error");
          setErrorMessage("Nao foi possivel verificar a sessao.");
        }
      }
    }

    void loadInitialUser();

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      const version = ++transitionVersion.current;
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        void applyUser(session?.user ?? null, version);
      }, 0);

      timers.add(timer);
    });

    return () => {
      active = false;
      transitionVersion.current += 1;
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
      timers.clear();
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signInWithGoogle() {
    if (!supabase) {
      return;
    }

    try {
      setErrorMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });

      if (error) {
        setStatus("error");
        setErrorMessage("Nao foi possivel iniciar o login com Google.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Nao foi possivel iniciar o login com Google.");
    }
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setStatus("error");
        setErrorMessage("Nao foi possivel sair da sessao.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Nao foi possivel sair da sessao.");
    }
  }

  return (
    <AuthContext.Provider
      value={{ status, user, errorMessage, supabase, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
