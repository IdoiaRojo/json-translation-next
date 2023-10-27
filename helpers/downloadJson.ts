import {FileType} from '@/types/FormTranslation';

export const downloadTranslatedFile = (data: any, fileType: FileType) => {
  if (fileType === 'json') {
    const translatedBlob = new Blob([JSON.stringify(data)], {
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
    const languages = Object.keys(data);
    const keys = data[languages[0]].map((_, index) => index);

    const csvContent = [];
    csvContent.push(['Key', ...languages]);

    keys.forEach((key) => {
      const row = [key];
      languages.forEach((language) => {
        const text = data[language][key];
        if (text !== undefined) {
          const escapedText = text.replace(/"/g, '""');
          const cellValue = text.includes(',')
            ? `"${escapedText}"`
            : escapedText;
          row.push(cellValue);
        } else {
          row.push('');
        }
      });
      csvContent.push(row);
    });

    const csv = csvContent.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'translations.csv';
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
