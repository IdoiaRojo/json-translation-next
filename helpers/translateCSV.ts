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
          const startTime = Date.now();
          let stopLoop = false;
          updateChunkStatus({
            key: lang,
            status: 'loading',
            setChunkToTranslates,
          });
          for (const chunk of chunks) {
            const result = await translateChunk({
              lang,
              data: chunk,
              inputLanguage,
              mode,
              setTranslation,
            });

            if (!result) {
              updateChunkStatus({
                key: lang,
                status: 'error',
                setChunkToTranslates,
                time: Date.now() - startTime,
              });
              stopLoop = true; // Establece la variable de control para detener el bucle
              break; // Sale del bucle
            }
          }

          if (stopLoop) {
            break; // Sale del bucle externo si la variable de control está establecida
          }
          updateChunkStatus({
            key: lang,
            status: 'completed',
            setChunkToTranslates,
            time: Date.now() - startTime,
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
  lang,
  data,
  inputLanguage,
  mode,
  setTranslation,
}: {
  lang: string;
  data: string[];
  inputLanguage: FormTranslation['inputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
}) => {
  try {
    const translation = await apiCall({
      text: JSON.stringify(data),
      inputLanguage,
      outputLanguage: lang,
      mode,
    });

    if (translation) {
      setTranslation((prevTranslations) => {
        const newTranslation = {...prevTranslations};
        if ((prevTranslations as object)[lang]) {
          newTranslation[lang] = [
            ...(prevTranslations as object)[lang],
            ...translation.data,
          ];
        } else {
          newTranslation[lang] = [...translation.data];
        }

        return newTranslation;
      });
      return 'epaaa';
    } else {
      return null;
      // updateChunkStatus({key, status: 'error', setChunkToTranslates, time});
    }
  } catch (error) {
    // const time = Date.now() - startTime;
    console.error('Error al traducir el chunk:', error);
    return null;
    // updateChunkStatus({key, status: 'error', setChunkToTranslates, time});
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
