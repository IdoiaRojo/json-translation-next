import {LANGUAGES_AVAILABLE} from '@/types/LanguagesAvailable';

export const checkFileName = (fileName: string): boolean =>
  LANGUAGES_AVAILABLE.includes(fileName);
