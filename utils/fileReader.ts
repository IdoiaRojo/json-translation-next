export const readCSVFile = (fileWrapper: {
  file: File;
}): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject('No se pudo leer el archivo');
      }
    };
    reader.onerror = () => reject('Error al leer el archivo');
    reader.readAsText(fileWrapper.file);
  });
};

export const parseCSVContent = (
  csvContent: string,
  inputLanguage: string,
  setTranslation: Function
) => {
  const lines = csvContent.split('\n');
  const translations = lines.map((line) => line.trim());
  setTranslation({[inputLanguage]: translations});
  return translations;
};
