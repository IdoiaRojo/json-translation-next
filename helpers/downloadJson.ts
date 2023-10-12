import {TranslationData} from '@/types/TranslationData';

export const downloadTranslatedJSON = (translations: TranslationData) => {
  const translatedBlob = new Blob([JSON.stringify(translations)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(translatedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'translated.json';
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
};
