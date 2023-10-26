import {FileType} from '@/types/FormTranslation';
import {Translation} from '@/types/Translation';

export const downloadTranslatedFile = (
  translation: Translation,
  fileType: FileType
) => {
  const translatedBlob =
    fileType === 'json'
      ? new Blob([JSON.stringify(translation)], {
          type: 'application/json',
        })
      : new Blob([JSON.stringify(translation)], {
          type: 'application/csv',
        });

  const url = URL.createObjectURL(translatedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `translated.${fileType}`;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
};
