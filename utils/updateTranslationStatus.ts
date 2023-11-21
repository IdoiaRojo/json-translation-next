import {LanguageObject} from '@/types/LanguageObject';

export const updateTranslationStatus = (
  lang: string,
  status: LanguageObject['status'],
  setLanguagesObjects: (
    updateFunc: (prev: LanguageObject[]) => LanguageObject[]
  ) => void,
  position: number,
  startTime?: number
) => {
  const time = startTime !== undefined ? Date.now() - startTime : undefined;

  setLanguagesObjects((prevChunksStatus: LanguageObject[]) =>
    prevChunksStatus.map((chunk) =>
      chunk.key === lang
        ? {
            ...chunk,
            status,
            ...(time !== undefined && {time}),
            chunkPosition:
              status === 'completed' ? chunk.chunksCount : position,
          }
        : chunk
    )
  );
};
