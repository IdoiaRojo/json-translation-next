import {Translation} from './Translation';

export interface ChunkToTranslate {
  key: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  translation?: Translation;
  time?: number;
}
