import {FileType} from '@/types/FormTranslation';
import {Translation} from '@/types/Translation';

export const downloadTranslatedFile = (
  translation: Translation,
  fileType: FileType
) => {
  if (fileType === 'json') {
    const translatedBlob = new Blob([JSON.stringify(translation)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(translatedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated.${fileType}`;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
  } else {
    console.log('translation', translation);
    const csvContent = [];
    const languages = Object.keys(translation);
    const keys = Object.keys(translation[languages[0]]);

    // Agregar las cabeceras de idioma al archivo CSV
    csvContent.push(['Key', ...languages]);

    // Agregar las filas de traducción al archivo CSV
    keys.forEach((key) => {
      const row = [key];
      languages.forEach((language) => {
        // Escapar las comas en las traducciones con comillas dobles
        const data = translation[language][key].replace(/"/g, '""');
        row.push(`"${data}"`);
      });
      csvContent.push(row);
    });

    // Crear un enlace temporal para descargar el archivo CSV
    const csv = csvContent.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'translations.csv';
    document.body.appendChild(a);
    a.click();

    // Liberar recursos
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
