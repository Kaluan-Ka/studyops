import { canMutateWithAuth, type AuthAccessStatus } from "./authAccess";

export type StudyNoteAuthView = {
  canMutate: boolean;
  mode: "loading" | "locked" | "ready";
  message: string;
  showSignIn: boolean;
};

export function getStudyNoteAuthView(
  status: AuthAccessStatus,
  hasUserId: boolean,
): StudyNoteAuthView {
  const canMutate = canMutateWithAuth(status, hasUserId ? "user" : null);

  if (status === "loading") {
    return {
      canMutate: false,
      mode: "loading",
      message: "Verificando sessão...",
      showSignIn: false,
    };
  }

  if (canMutate) {
    return { canMutate: true, mode: "ready", message: "", showSignIn: false };
  }

  if (status === "signed_out") {
    return {
      canMutate: false,
      mode: "locked",
      message: "Entre com Google para registrar uma nota.",
      showSignIn: true,
    };
  }

  if (status === "unconfigured") {
    return {
      canMutate: false,
      mode: "locked",
      message: "Modo leitura: autenticação não configurada neste ambiente.",
      showSignIn: false,
    };
  }

  return {
    canMutate: false,
    mode: "locked",
    message: "Não foi possível verificar a sessão. Tente entrar novamente.",
    showSignIn: false,
  };
}
