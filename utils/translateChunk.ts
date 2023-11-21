import {apiCall} from '@/api/apiCall';
import {FormTranslation} from '@/types/FormTranslation';
import {updateTranslationStatus} from './updateTranslationStatus';

export const translateChunk = async ({
  lang,
  data,
  inputLanguage,
  mode,
  setTranslation,
  openAIKey,
  setLanguagesObjects,
  chunkPosition,
  startTime,
}: {
  lang: string;
  data: string[];
  inputLanguage: FormTranslation['inputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
  openAIKey: string;
  setLanguagesObjects: FormTranslation['setLanguagesObjects'];
  chunkPosition: number;
  startTime?;
}) => {
  try {
    const translationResult = await apiCall({
      text: JSON.stringify(data),
      inputLanguage,
      outputLanguage: lang,
      mode,
      openAIKey,
    });
    console.log(translationResult);
    if (translationResult) {
      updateTranslations(setTranslation, lang, translationResult);
      return true;
    } else {
      throw new Error('No translation returned from apiCall');
    }
  } catch (error) {
    console.error(
      `Error al traducir el chunk en la posición ${chunkPosition}:`,
      error
    );

    updateTranslationStatus(
      lang,
      'error',
      setLanguagesObjects,
      chunkPosition,
      startTime
    );
    return false;
  }
};

const updateTranslations = (
  setTranslation: Function,
  lang: string,
  translationResult: any
) => {
  setTranslation((prevTranslations) => {
    const newTranslation = {...prevTranslations};
    newTranslation[lang] = [
      ...(prevTranslations[lang] || []),
      ...translationResult.data,
    ];
    return newTranslation;
  });
};
