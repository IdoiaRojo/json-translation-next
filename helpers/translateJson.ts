import {FormTranslation} from '@/types/FormTranslation';
import {LanguageObject} from '@/types/LanguageObject';
import {Translation} from '@/types/Translation';
import {apiCall} from './apiCall';

export const translateJSON = async ({
  file,
  setFileChunks,
  setTranslation,
  setLanguagesObjects,
  setTranslationStatus,
  inputLanguage,
  outputLanguage,
  mode,
  openAIKey,
}) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    if (event.target) {
      const fileContent = event.target.result as string;
      try {
        const fileChunks: Translation = JSON.parse(fileContent);
        setFileChunks(fileChunks);
        setTranslation(null);
        const initialLanguagesObjects: LanguageObject[] = Object.keys(
          fileChunks
        ).map((key, index) => ({
          key,
          status: 'pending',
          chunkPosition: index,
          chunksCount: 0,
        }));
        setLanguagesObjects(initialLanguagesObjects);
        setTranslationStatus('loading');

        for (const languageObject of initialLanguagesObjects) {
          await translateLanguage({
            languageObject,
            fileChunks,
            inputLanguage,
            outputLanguage,
            mode,
            setTranslation,
            setLanguagesObjects,
            openAIKey,
          });
        }

        setTranslationStatus('finished');
      } catch (error) {
        console.error('Error al parsear el archivo JSON:', error);
      }
    }
  };

  reader.readAsText(file.file);
};

export const translateLanguage = async ({
  languageObject,
  fileChunks,
  inputLanguage,
  outputLanguage,
  mode,
  setTranslation,
  setLanguagesObjects,
  openAIKey,
}: {
  languageObject: LanguageObject;
  fileChunks: FormTranslation['fileChunks'];
  inputLanguage: FormTranslation['inputLanguage'];
  outputLanguage: FormTranslation['outputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
  setLanguagesObjects: FormTranslation['setLanguagesObjects'];
  openAIKey: string;
}) => {
  const key = languageObject.key;
  const startTime = Date.now();
  updateLanguageObjectStatus({
    key,
    status: 'loading',
    setLanguagesObjects,
  });
  try {
    const translation = await apiCall({
      text: JSON.stringify(fileChunks[key]),
      inputLanguage,
      outputLanguage,
      mode,
      openAIKey,
    });
    const time = Date.now() - startTime;
    if (translation) {
      setTranslation((prevTranslations) => {
        const newTranslation = {...prevTranslations, [key]: translation};
        const sortedTranslations = Object.keys(newTranslation)
          .sort()
          .reduce((acc, curr) => {
            acc[curr] = prevTranslations[curr];
            return acc;
          }, {});

        return {
          ...sortedTranslations,
          [key]: translation,
        };
      });

      updateLanguageObjectStatus({
        key,
        status: 'completed',
        setLanguagesObjects,
        time,
      });
    } else {
      updateLanguageObjectStatus({
        key,
        status: 'error',
        setLanguagesObjects,
        time,
      });
    }
  } catch (error) {
    const time = Date.now() - startTime;
    console.error('Error al traducir el chunk:', error);
    updateLanguageObjectStatus({
      key,
      status: 'error',
      setLanguagesObjects,
      time,
    });
  }
};

const updateLanguageObjectStatus = ({
  key,
  status,
  translation,
  setLanguagesObjects,
  time,
}: {
  key: string;
  status: LanguageObject['status'];
  translation?: LanguageObject['translation'];
  time?: LanguageObject['time'];
  setLanguagesObjects;
}) => {
  setLanguagesObjects((prevChunksStatus) =>
    prevChunksStatus.map((chunk) =>
      chunk.key === key ? {...chunk, status, translation, time} : chunk
    )
  );
};
