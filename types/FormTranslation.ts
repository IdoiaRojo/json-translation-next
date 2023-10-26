import {SetStateAction} from 'react';
import {ChunkToTranslate} from './ChunkToTranslate';
import {LanguagesAvailable} from './LanguagesAvailable';
import {Translation} from './Translation';
import {TranslationStatus} from './TranslationStatus';

export type FileType = 'json' | 'csv';
export interface FormTranslation {
  chunksToTranslate: ChunkToTranslate[];
  inputLanguage: LanguagesAvailable;
  jsonData: Translation | null;
  jsonFile;
  mode;
  fileType: FileType;
  setFileType: React.Dispatch<SetStateAction<FileType>>;
  outputLanguage: LanguagesAvailable;
  setChunkToTranslates: React.Dispatch<SetStateAction<ChunkToTranslate[]>>;
  setJsonData: React.Dispatch<SetStateAction<Translation>>;
  setTranslation: React.Dispatch<SetStateAction<Translation>>;
  setTranslationStatus: React.Dispatch<SetStateAction<TranslationStatus>>;
  translationStatus: TranslationStatus;
  translation: Translation | null;
}
