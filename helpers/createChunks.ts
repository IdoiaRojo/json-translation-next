export const createChunks = (
  translations: string[],
  setFileChunks: Function
) => {
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < translations.length; i += chunkSize) {
    const chunk = translations.slice(i, i + chunkSize);
    chunks.push({data: chunk, position: i / chunkSize});
  }
  setFileChunks(chunks);
  return chunks;
};

export const initializeLanguageObjects = (
  outputLanguages: string[],
  chunks: any[],
  setLanguagesObjects: Function
) => {
  const initialChunks = outputLanguages.map((key) => ({
    key,
    status: 'pending',
    chunksCount: chunks.length,
  }));
  setLanguagesObjects(initialChunks);
  return initialChunks;
};
