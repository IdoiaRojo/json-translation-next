import {Translation} from './Translation';

export interface LanguageObject {
  key: string;
  chunksCount: number;
  status: 'pending' | 'loading' | 'completed' | 'error';
  chunkPosition?: number;
  translation?: Translation;
  time?: number;
}
