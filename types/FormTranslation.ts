import {SetStateAction} from 'react';
import {LanguageChunk} from './LanguageChunk';
import {LanguageObject} from './LanguageObject';
import {LanguagesAvailable} from './LanguagesAvailable';
import {Translation} from './Translation';
import {TranslationStatus} from './TranslationStatus';

export type FileType = 'json' | 'csv';
export interface FormTranslation {
  languagesObject: LanguageObject[];
  outputLanguages: string[];
  inputLanguage: LanguagesAvailable;
  fileChunks: LanguageChunk[] | null;
  file;
  mode;
  fileType: FileType;
  setFileType: React.Dispatch<SetStateAction<FileType>>;
  outputLanguage: LanguagesAvailable;
  setLanguagesObjects: React.Dispatch<SetStateAction<LanguageObject[]>>;
  setJsonData: React.Dispatch<SetStateAction<Translation>>;
  setTranslation: React.Dispatch<SetStateAction<Translation>>;
  setTranslationStatus: React.Dispatch<SetStateAction<TranslationStatus>>;
  translationStatus: TranslationStatus;
  translation: Translation | null;
  openAIKey: string;
  setFileChunks: React.Dispatch<SetStateAction<LanguageChunk[]>>;
}
