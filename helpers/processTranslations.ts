import {FormTranslation} from '@/types/FormTranslation';
import {translateChunk} from '@/utils/translateChunk';
import {updateTranslationStatus} from '@/utils/updateTranslationStatus';

export const processTranslations = async (
  chunks: any[],
  outputLanguages: string[],
  setTranslation: FormTranslation['setTranslation'],
  setLanguagesObjects: FormTranslation['setLanguagesObjects'],
  inputLanguage: FormTranslation['inputLanguage'],
  mode: FormTranslation['mode'],
  openAIKey: FormTranslation['openAIKey']
) => {
  for (const lang of outputLanguages) {
    updateTranslationStatus(lang, 'loading', setLanguagesObjects, 0);
    const startTime = Date.now();
    let stopLoop = false;

    for (const chunk of chunks) {
      const result = await translateChunk({
        lang,
        data: chunk.data,
        inputLanguage,
        mode,
        setTranslation,
        openAIKey,
        setLanguagesObjects,
        chunkPosition: chunk.position,
        startTime,
      });
      if (!result) {
        stopLoop = true;
        break;
      }
    }

    if (!stopLoop) {
      updateTranslationStatus(
        lang,
        'completed',
        setLanguagesObjects,
        chunks.length,
        startTime
      );
    } else {
      break;
    }
  }
};
