import {Translation} from './Translation';

export interface LanguageObject {
  key: string;
  chunksCount: number;
  chunkPosition: number;
  status: 'pending' | 'loading' | 'completed' | 'error';
  translation?: Translation;
  time?: number;
}
