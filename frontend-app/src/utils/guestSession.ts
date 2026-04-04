import type { ChatSession } from '@/interface';
import { GUEST_SESSION_KEY } from '@/constants/strings';

export const GUEST_SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export type GuestSessionState = {
  guestSessionId: string;
  expiresAt: number;
  sessions: ChatSession[];
};

export function createGuestSessionState(sessions: ChatSession[] = []): GuestSessionState {
  return {
    guestSessionId:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `guest-${Date.now()}`,
    expiresAt: Date.now() + GUEST_SESSION_DURATION_MS,
    sessions,
  };
}

export function getGuestSessionRemainingMs(state?: GuestSessionState | null) {
  const source = state ?? getGuestSessionState();
  if (!source) return 0;
  return Math.max(source.expiresAt - Date.now(), 0);
}

export function getGuestSessionState(): GuestSessionState | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(GUEST_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GuestSessionState;
    if (parsed.expiresAt <= Date.now()) {
      clearGuestSessionState();
      return null;
    }
    if (!parsed.guestSessionId) {
      parsed.guestSessionId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `guest-${Date.now()}`;
    }
    return parsed;
  } catch {
    clearGuestSessionState();
    return null;
  }
}

function stripMediaDataUrls(sessions: ChatSession[]): ChatSession[] {
  return sessions.map((session) => ({
    ...session,
    messages: session.messages.map((msg) => ({
      ...msg,
      attachments: msg.attachments?.map((a) =>
        a.url?.startsWith('data:') ? { ...a, url: undefined } : a
      ),
    })),
  }));
}

export function saveGuestSessionState(state: GuestSessionState) {
  if (typeof window === 'undefined') return;
  const serializable: GuestSessionState = {
    ...state,
    sessions: stripMediaDataUrls(state.sessions),
  };
  try {
    window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(serializable));
  } catch {
    // quota exceeded — save without message history to preserve session identity
    window.localStorage.setItem(
      GUEST_SESSION_KEY,
      JSON.stringify({ ...serializable, sessions: [] }),
    );
  }
  const expires = new Date(state.expiresAt).toUTCString();
  document.cookie = `nexusai_guest_expires=${state.expiresAt}; expires=${expires}; max-age=${GUEST_SESSION_DURATION_MS / 1000}; path=/`;
}

export function clearGuestSessionState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(GUEST_SESSION_KEY);
  document.cookie = 'nexusai_guest_expires=; max-age=0; path=/';
}
