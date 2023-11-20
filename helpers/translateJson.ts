import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {FormTranslation} from '@/types/FormTranslation';
import {Translation} from '@/types/Translation';
import {apiCall} from './apiCall';

export const translateJSON = async ({
  jsonFile,
  setJsonData,
  setTranslation,
  setChunkToTranslates,
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
        const jsonData: Translation = JSON.parse(fileContent);
        setJsonData(jsonData);
        setTranslation(null);
        const initialChunks: ChunkToTranslate[] = Object.keys(jsonData).map(
          (key) => ({
            key,
            status: 'pending',
          })
        );
        setChunkToTranslates(initialChunks);
        setTranslationStatus('loading');

        for (const chunk of initialChunks) {
          await translateChunk({
            chunk,
            jsonData,
            inputLanguage,
            outputLanguage,
            mode,
            setTranslation,
            setChunkToTranslates,
            openAIKey,
          });
        }

        setTranslationStatus('finished');
      } catch (error) {
        console.error('Error al parsear el archivo JSON:', error);
      }
    }
  };

  reader.readAsText(jsonFile.file);
};

export const translateChunk = async ({
  chunk,
  jsonData,
  inputLanguage,
  outputLanguage,
  mode,
  setTranslation,
  setChunkToTranslates,
  openAIKey,
}: {
  chunk: ChunkToTranslate;
  jsonData: FormTranslation['jsonData'];
  inputLanguage: FormTranslation['inputLanguage'];
  outputLanguage: FormTranslation['outputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
  setChunkToTranslates: FormTranslation['setChunkToTranslates'];
  openAIKey: string;
}) => {
  const key = chunk.key;
  const startTime = Date.now();
  updateChunkStatus({key, status: 'loading', setChunkToTranslates});
  try {
    const translation = await apiCall({
      text: JSON.stringify(jsonData[key]),
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

      updateChunkStatus({key, status: 'completed', setChunkToTranslates, time});
    } else {
      updateChunkStatus({key, status: 'error', setChunkToTranslates, time});
    }
  } catch (error) {
    const time = Date.now() - startTime;
    console.error('Error al traducir el chunk:', error);
    updateChunkStatus({key, status: 'error', setChunkToTranslates, time});
  }
};

const updateChunkStatus = ({
  key,
  status,
  translation,
  setChunkToTranslates,
  time,
}: {
  key: string;
  status: ChunkToTranslate['status'];
  translation?: ChunkToTranslate['translation'];
  time?: ChunkToTranslate['time'];
  setChunkToTranslates;
}) => {
  setChunkToTranslates((prevChunksStatus) =>
    prevChunksStatus.map((chunk) =>
      chunk.key === key ? {...chunk, status, translation, time} : chunk
    )
  );
};
