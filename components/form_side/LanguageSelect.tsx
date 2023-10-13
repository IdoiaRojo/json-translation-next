import {
  LANGUAGES_AVAILABLE,
  LanguagesAvailable,
  languageNames,
} from '@/types/LanguagesAvailable';
import React from 'react';

export const LanguageSelect = ({
  selectedLanguage,
  onLanguageChange,
}: {
  selectedLanguage: LanguagesAvailable | '';
  onLanguageChange: (language: LanguagesAvailable | '') => void;
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value as LanguagesAvailable);
  };

  return (
    <div className='border border-grey-200 rounded-md px-1 py-2'>
      <select value={selectedLanguage} onChange={handleLanguageChange}>
        {LANGUAGES_AVAILABLE.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};
