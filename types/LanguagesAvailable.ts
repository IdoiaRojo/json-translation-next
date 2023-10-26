export const LANGUAGES_AVAILABLE = ['es', 'en', 'fr', 'de', 'it', 'he', 'pt'];
export type LanguagesAvailable = (typeof LANGUAGES_AVAILABLE)[number];

export const languageNames: Record<LanguagesAvailable, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  he: 'Hebrew',
  pt: 'Português',
};
