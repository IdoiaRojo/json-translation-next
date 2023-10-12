export interface TranslationChunk {
  key: string;
  status: 'pending' | 'completed' | 'error';
  translation?: any;
}
