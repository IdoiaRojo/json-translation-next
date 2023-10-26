import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {FormTranslation} from '@/types/FormTranslation';
import {apiCall} from './apiCall';
const LANGUAGES_AVAILABLE = ['es', 'fr', 'it'];
export const translateCSV = async ({
  file,
  setJsonData,
  setTranslation,
  setChunkToTranslates,
  setTranslationStatus,
  inputLanguage,
  outputLanguage,
  mode,
}) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    if (event.target) {
      const csvContent = event.target.result as string;
      try {
        const lines = csvContent.split('\n');
        const translations = lines.map((line) => line.trim());

        setTranslation(null);
        const initialChunks: ChunkToTranslate[] = LANGUAGES_AVAILABLE.map(
          (key) => ({
            key,
            status: 'pending',
          })
        );
        setChunkToTranslates(initialChunks);
        setTranslationStatus('loading');
        for (const chunk of LANGUAGES_AVAILABLE) {
          await translateChunk({
            chunk,
            data: translations,
            inputLanguage,
            outputLanguage,
            mode,
            setTranslation,
            setChunkToTranslates,
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

export const translateChunk = async ({
  chunk,
  data,
  inputLanguage,
  outputLanguage,
  mode,
  setTranslation,
  setChunkToTranslates,
}: {
  chunk: string;
  data: string[];
  inputLanguage: FormTranslation['inputLanguage'];
  outputLanguage: FormTranslation['outputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
  setChunkToTranslates: FormTranslation['setChunkToTranslates'];
}) => {
  const key = chunk;
  const startTime = Date.now();
  updateChunkStatus({key, status: 'loading', setChunkToTranslates});
  try {
    const translation = await apiCall({
      text: JSON.stringify(data),
      inputLanguage,
      outputLanguage: chunk,
      mode,
    });

    const time = Date.now() - startTime;
    if (translation) {
      setTranslation((prevTranslations) => {
        const newTranslation = prevTranslations
          ? {
              ...(prevTranslations as object),
              [key]: translation.data,
            }
          : {[key]: translation.data};
        return newTranslation;
      });
      updateChunkStatus({
        key,
        status: 'completed',
        setChunkToTranslates,
        time,
      });
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
