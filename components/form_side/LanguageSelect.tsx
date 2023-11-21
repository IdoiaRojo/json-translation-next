import {
  LANGUAGES_AVAILABLE,
  LanguagesAvailable,
  languageNames,
} from '@/types/LanguagesAvailable';
import React from 'react';

export const LanguageSelect = ({
  selectedLanguage,
  onLanguageChange,
  label,
}: {
  selectedLanguage: LanguagesAvailable | '';
  onLanguageChange: (language: LanguagesAvailable | '') => void;
  label?;
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange(e.target.value as LanguagesAvailable);
  };

  return (
    <div className='border border-grey-200 rounded-md px-1 py-2'>
      <label>{label}</label>
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className='w-full cursor-pointer'
      >
        {LANGUAGES_AVAILABLE.map((lang) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};
