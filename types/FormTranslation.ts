import {SetStateAction} from 'react';
import {ChunkToTranslate} from './ChunkToTranslate';
import {LanguagesAvailable} from './LanguagesAvailable';
import {Translation} from './Translation';
import {TranslationStatus} from './TranslationStatus';

export interface FormTranslation {
  chunksToTranslate: ChunkToTranslate[];
  jsonData: Translation | null;
  jsonFile;
  setJsonData: React.Dispatch<SetStateAction<Translation>>;
  setTranslation: React.Dispatch<SetStateAction<Translation>>;
  setChunkToTranslates: React.Dispatch<SetStateAction<ChunkToTranslate[]>>;
  setTranslationStatus: React.Dispatch<SetStateAction<TranslationStatus>>;
  inputLanguage: LanguagesAvailable;
  outputLanguage: LanguagesAvailable;
  mode;
}
