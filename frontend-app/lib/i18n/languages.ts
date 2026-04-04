export type AppLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  shortLabel: string;
};

export const appLanguages: AppLanguage[] = [
  { code: 'en-US', label: 'English', nativeLabel: 'English', shortLabel: 'US' },
  { code: 'ar-SA', label: 'Arabic', nativeLabel: 'العربية', shortLabel: 'SA' },
  { code: 'fr-FR', label: 'French', nativeLabel: 'Français', shortLabel: 'FR' },
  { code: 'de-DE', label: 'German', nativeLabel: 'Deutsch', shortLabel: 'DE' },
  { code: 'es-ES', label: 'Spanish', nativeLabel: 'Español', shortLabel: 'ES' },
  { code: 'pt-BR', label: 'Portuguese', nativeLabel: 'Português', shortLabel: 'BR' },
  { code: 'zh-CN', label: 'Chinese', nativeLabel: '中文', shortLabel: 'CN' },
  { code: 'ja-JP', label: 'Japanese', nativeLabel: '日本語', shortLabel: 'JP' },
  { code: 'ko-KR', label: 'Korean', nativeLabel: '한국어', shortLabel: 'KR' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी', shortLabel: 'IN' },
  { code: 'ur-PK', label: 'Urdu', nativeLabel: 'اردو', shortLabel: 'PK' },
  { code: 'tr-TR', label: 'Turkish', nativeLabel: 'Türkçe', shortLabel: 'TR' },
  { code: 'ru-RU', label: 'Russian', nativeLabel: 'Русский', shortLabel: 'RU' },
  { code: 'it-IT', label: 'Italian', nativeLabel: 'Italiano', shortLabel: 'IT' },
  { code: 'nl-NL', label: 'Dutch', nativeLabel: 'Nederlands', shortLabel: 'NL' },
];

export const defaultLanguage = appLanguages[0];
