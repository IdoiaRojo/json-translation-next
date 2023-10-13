import {Translation} from './Translation';

export interface ChunkToTranslate {
  key: string;
  status: 'pending' | 'completed' | 'error';
  translation?: Translation;
  time?: number;
}
