export type AuthAccessStatus =
  | "unconfigured"
  | "loading"
  | "signed_out"
  | "authenticated"
  | "error";

export function canMutateWithAuth(status: AuthAccessStatus, userId?: string | null): boolean {
  return status === "authenticated" && Boolean(userId?.trim());
}
