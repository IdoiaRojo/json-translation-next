import {LANGUAGES_AVAILABLE} from '@/types/LanguagesAvailable';

export const checkFileName = (fileName: string): boolean => {
  console.log('checkFileName', fileName);
  return LANGUAGES_AVAILABLE.includes(fileName);
};
