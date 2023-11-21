import {FormTranslation} from '@/types/FormTranslation';
import {LanguageChunk} from '@/types/LanguageChunk';
import {LanguageObject} from '@/types/LanguageObject';

export const createChunks = (
  translations: string[],
  setFileChunks: FormTranslation['setFileChunks']
) => {
  const chunkSize = 10;
  const chunks: LanguageChunk[] = [];
  for (let i = 0; i < translations.length; i += chunkSize) {
    const chunk = translations.slice(i, i + chunkSize);
    chunks.push({data: chunk, position: i / chunkSize});
  }
  setFileChunks(chunks);
  return chunks;
};

export const initializeLanguageObjects = (
  outputLanguages: string[],
  chunks: LanguageChunk[],
  setLanguagesObjects: FormTranslation['setLanguagesObjects']
) => {
  const initialChunks = outputLanguages.map((key) => ({
    key,
    status: 'pending' as LanguageObject['status'],
    chunksCount: chunks.length,
  }));
  setLanguagesObjects(initialChunks);
  return initialChunks;
};
