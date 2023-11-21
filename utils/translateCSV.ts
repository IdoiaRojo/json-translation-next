import {createChunks, initializeLanguageObjects} from '@/helpers/createChunks';
import {processTranslations} from '@/helpers/processTranslations';
import {FormTranslation} from '@/types/FormTranslation';
import {parseCSVContent, readCSVFile} from './fileReader';

export const translateCSV = async ({
  file,
  setFileChunks,
  setTranslation,
  setLanguagesObjects,
  setTranslationStatus,
  inputLanguage,
  outputLanguages,
  mode,
  openAIKey,
}: {
  file: FormTranslation['file'];
  setFileChunks: FormTranslation['setFileChunks'];
  setTranslation: FormTranslation['setTranslation'];
  setLanguagesObjects: FormTranslation['setLanguagesObjects'];
  setTranslationStatus: FormTranslation['setTranslationStatus'];
  inputLanguage: FormTranslation['inputLanguage'];
  outputLanguages: FormTranslation['outputLanguages'];
  mode: FormTranslation['mode'];
  openAIKey: FormTranslation['openAIKey'];
}) => {
  const csvContent = await readCSVFile(file);
  if (!csvContent) return;

  try {
    const translations = parseCSVContent(
      csvContent,
      inputLanguage,
      setTranslation
    );
    const chunks = createChunks(translations, setFileChunks);
    initializeLanguageObjects(outputLanguages, chunks, setLanguagesObjects);
    setTranslationStatus('loading');
    await processTranslations(
      chunks,
      outputLanguages,
      setTranslation,
      setLanguagesObjects,
      inputLanguage,
      mode,
      openAIKey
    );
    setTranslationStatus('finished');
  } catch (error) {
    console.error('Error en el proceso de traducción:', error);
  }
};
