import {FormTranslation} from '@/types/FormTranslation';
import {LanguageChunk} from '@/types/LanguageChunk';
import {translateChunk} from '@/utils/translateChunk';
import {updateTranslationStatus} from '@/utils/updateTranslationStatus';

export const processTranslations = async (
  chunks: LanguageChunk[],
  outputLanguages: string[],
  setTranslation: FormTranslation['setTranslation'],
  setLanguagesObjects: FormTranslation['setLanguagesObjects'],
  inputLanguage: FormTranslation['inputLanguage'],
  mode: FormTranslation['mode'],
  openAIKey: FormTranslation['openAIKey'],
  setLastProcessed: FormTranslation['setLastProcessed']
) => {
  let isCompletedSuccessfully = false;
  for (const lang of outputLanguages) {
    updateTranslationStatus(lang, 'loading', setLanguagesObjects, 0);
    const startTime = Date.now();

    for (const chunk of chunks) {
      setLastProcessed({lang, chunkPosition: chunk.position});
      console.log('--------------------------------------------------------');
      console.log('chunk', chunk);
      updateTranslationStatus(
        lang,
        'loading',
        setLanguagesObjects,
        chunk.position
      );
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
        isCompletedSuccessfully = false;
        break;
      }
      isCompletedSuccessfully = true;
    }

    if (isCompletedSuccessfully) {
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
  return isCompletedSuccessfully;
};

export const retakeProcessingTranslation = async (
  chunks: LanguageChunk[],
  outputLanguages: string[],
  setTranslation: FormTranslation['setTranslation'],
  setLanguagesObjects: FormTranslation['setLanguagesObjects'],
  inputLanguage: FormTranslation['inputLanguage'],
  mode: FormTranslation['mode'],
  openAIKey: FormTranslation['openAIKey'],
  lastProcessed: FormTranslation['lastProcessed'],
  setLastProcessed: FormTranslation['setLastProcessed']
) => {
  const {lang, chunkPosition} = lastProcessed;
  const startIndex = outputLanguages.indexOf(lang);
  if (startIndex === -1) return;
  const languagesRemaining = outputLanguages.slice(startIndex + 1);

  const chunksRemaining = chunks.slice(chunkPosition);
  const processRemainingChunks = await processTranslations(
    chunksRemaining,
    [lang],
    setTranslation,
    setLanguagesObjects,
    inputLanguage,
    mode,
    openAIKey,
    setLastProcessed
  );
  if (processRemainingChunks) {
    // process remaining languages
    await processTranslations(
      chunks,
      languagesRemaining,
      setTranslation,
      setLanguagesObjects,
      inputLanguage,
      mode,
      openAIKey,
      setLastProcessed
    );
  }
};
