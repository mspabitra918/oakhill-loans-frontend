// Client-side session storage for the JWT returned by the auth endpoints.
// Tokens live in localStorage; PII is never stored here.
//
// Admin/staff and customer sessions are kept under SEPARATE keys so the two
// portals don't clobber each other: signing into /admin (email + password)
// must not overwrite a customer's /dashboard session (phone OTP), and vice
// versa. A single browser can therefore hold both at once.
import type { AuthResult } from "./api";

export type Session = AuthResult;

// One localStorage key per portal scope.
export type SessionScope = "admin" | "user";

const KEYS: Record<SessionScope, string> = {
  admin: "oakhill_admin_session",
  user: "oakhill_user_session",
};

export function saveSession(scope: SessionScope, session: Session): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS[scope], JSON.stringify(session));
}

export function getSession(scope: SessionScope): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS[scope]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession(scope: SessionScope): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS[scope]);
}
