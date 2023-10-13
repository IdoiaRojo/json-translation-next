export const LANGUAGES_AVAILABLE = ['es', 'en', 'fr', 'de', 'it', 'ja', 'pt'];
export type LanguagesAvailable = (typeof LANGUAGES_AVAILABLE)[number];

export const languageNames: Record<LanguagesAvailable, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  pt: 'Português',
};
