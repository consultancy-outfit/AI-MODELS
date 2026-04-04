export const AUTH_STORAGE_KEY = 'nexusai_auth';
export const LANGUAGE_STORAGE_KEY = 'nexusai_language';
export const GUEST_SESSION_KEY = 'nexusai_guest_session';

export const PALETTE_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type PaletteMode = (typeof PALETTE_MODE)[keyof typeof PALETTE_MODE];

export const APP_NAME = 'NexusAI';
export const APP_TAGLINE = 'AI model command center';
