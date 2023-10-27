import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {FormTranslation} from '@/types/FormTranslation';
import {apiCall} from './apiCall';

export const translateCSV = async ({
  file,
  setJsonData,
  setTranslation,
  setChunkToTranslates,
  setTranslationStatus,
  inputLanguage,
  outputLanguages,
  mode,
}) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    if (event.target) {
      const csvContent = event.target.result as string;
      try {
        const lines = csvContent.split('\n');
        const translations = lines.map((line) => line.trim());
        setTranslation({[inputLanguage]: translations});

        const chunkSize = 10; // Tamaño máximo del chunk
        const chunks = [];
        for (let i = 0; i < translations.length; i += chunkSize) {
          const chunk = translations.slice(i, i + chunkSize);
          chunks.push(chunk);
        }

        const initialChunks: ChunkToTranslate[] = outputLanguages.map(
          (key) => ({
            key,
            status: 'pending',
          })
        );
        setChunkToTranslates(initialChunks);
        setTranslationStatus('loading');

        for (const lang of outputLanguages) {
          for (const chunk of chunks) {
            await translateChunk({
              chunk: lang,
              data: chunk,
              inputLanguage,
              outputLanguage: lang,
              mode,
              setTranslation,
              setChunkToTranslates,
            });
          }
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
        const newTranslation = {...prevTranslations};
        console.log('translation.data', translation);
        console.log('newTranslation', newTranslation);

        if ((prevTranslations as object)[key]) {
          newTranslation[key] = [
            ...(prevTranslations as object)[key],
            ...translation.data,
          ];
        } else {
          newTranslation[key] = [...translation.data];
        }

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
