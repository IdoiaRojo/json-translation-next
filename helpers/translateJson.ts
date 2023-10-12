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

export const translateChunk = async ({
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
  const startTime = Date.now();
  console.log(chunk, key);
  updateChunkStatus({key, status: 'pending', setChunksStatus});
  try {
    const translation = await apiCall({
      text: JSON.stringify(jsonData[key]),
      inputLanguage,
      outputLanguage,
      mode,
    });
    const time = Date.now() - startTime;
    if (translation) {
      setTranslations((prevTranslations) => ({
        ...prevTranslations,
        [key]: translation,
      }));

      updateChunkStatus({key, status: 'completed', setChunksStatus, time});
    } else {
      updateChunkStatus({key, status: 'error', setChunksStatus, time});
    }
  } catch (error) {
    const time = Date.now() - startTime;
    console.error('Error al traducir el chunk:', error);
    updateChunkStatus({key, status: 'error', setChunksStatus, time});
  }
};

const updateChunkStatus = ({
  key,
  status,
  translation,
  setChunksStatus,
  time,
}: {
  key: string;
  status: TranslationChunk['status'];
  translation?: TranslationChunk['translation'];
  time?: TranslationChunk['time'];
  setChunksStatus;
}) => {
  setChunksStatus((prevChunksStatus) =>
    prevChunksStatus.map((chunk) =>
      chunk.key === key ? {...chunk, status, translation, time} : chunk
    )
  );
};
