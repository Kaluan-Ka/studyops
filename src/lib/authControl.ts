import type { AuthStatus } from "@/components/AuthProvider";

export type AuthControlView = {
  message: string | null;
  action: "none" | "sign_in" | "sign_out";
};

export function getAuthControlView(input: { status: AuthStatus; email: string | null }): AuthControlView {
  if (input.status === "unconfigured") {
    return { message: "Modo leitura", action: "none" };
  }

  if (input.status === "loading") {
    return { message: "Verificando sessão...", action: "none" };
  }

  if (input.status === "authenticated") {
    return { message: input.email ?? "Sessão ativa", action: "sign_out" };
  }

  if (input.status === "error") {
    return {
      message: "Não foi possível verificar a sessão. Tente entrar novamente.",
      action: "sign_in",
    };
  }

  return { message: null, action: "sign_in" };
}
