import type { AuthUser, Session } from "@/types/auth";

const STORAGE_KEY = "procureflow_session";
const CHANGE_EVENT = "procureflow:session-change";

let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;

function decodeTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function parseSession(raw: string | null): Session | null {
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Session;
    if (!session.token || !session.user) return null;
    if (session.expiresAt && session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function readRaw() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Store externo compatível com `useSyncExternalStore`. O snapshot é memorizado
 * pela string bruta do storage para manter a referência estável entre renders.
 */
export const sessionStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },

  getSnapshot(): Session | null {
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSession = parseSession(raw);
    }
    return cachedSession;
  },

  getServerSnapshot(): Session | null {
    return null;
  },

  save(token: string, user: AuthUser) {
    const session: Session = { token, user, expiresAt: decodeTokenExpiry(token) };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } finally {
      notify();
    }
  },

  clear() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      notify();
    }
  },
};
