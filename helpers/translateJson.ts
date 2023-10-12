import {TranslationChunk} from '@/types/TranslationChunk';
import {TranslationData} from '@/types/TranslationData';
import {apiCall} from './apiCall';

export const translateJSON = async ({
  jsonFile,
  setJsonData,
  setTranslations,
  setChunksStatus,
  setStatusTranslation,
  inputLanguage,
  outputLanguage,
  mode,
}) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    if (event.target) {
      const fileContent = event.target.result as string;
      try {
        const jsonData: TranslationData = JSON.parse(fileContent);
        setJsonData(jsonData);
        setTranslations({});
        const initialChunks: TranslationChunk[] = Object.keys(jsonData).map(
          (key) => ({
            key,
            status: 'pending',
          })
        );
        setChunksStatus(initialChunks);
        setStatusTranslation('loading');

        for (const chunk of initialChunks) {
          await translateChunk({
            chunk,
            jsonData,
            inputLanguage,
            outputLanguage,
            mode,
            setTranslations,
            setChunksStatus,
          });
        }

        setStatusTranslation('finished');
      } catch (error) {
        console.error('Error al parsear el archivo JSON:', error);
      }
    }
  };

  reader.readAsText(jsonFile);
};

const translateChunk = async ({
  chunk,
  jsonData,
  inputLanguage,
  outputLanguage,
  mode,
  setTranslations,
  setChunksStatus,
}: {
  chunk: TranslationChunk;
  jsonData;
  inputLanguage;
  outputLanguage;
  mode;
  setTranslations;
  setChunksStatus;
}) => {
  const key = chunk.key;

  try {
    const translation = await apiCall({
      text: JSON.stringify(jsonData[key]),
      inputLanguage,
      outputLanguage,
      mode,
    });

    if (translation) {
      setTranslations((prevTranslations) => ({
        ...prevTranslations,
        [key]: translation,
      }));
      updateChunkStatus({key, status: 'completed', setChunksStatus});
    } else {
      updateChunkStatus({key, status: 'error', setChunksStatus});
    }
  } catch (error) {
    console.error('Error al traducir el chunk:', error);
    updateChunkStatus({key, status: 'error', setChunksStatus});
  }
};

const updateChunkStatus = ({
  key,
  status,
  translation,
  setChunksStatus,
}: {
  key: string;
  status: 'pending' | 'completed' | 'error';
  translation?: any;
  setChunksStatus;
}) => {
  setChunksStatus((prevChunksStatus) =>
    prevChunksStatus.map((chunk) =>
      chunk.key === key ? {...chunk, status, translation} : chunk
    )
  );
};
