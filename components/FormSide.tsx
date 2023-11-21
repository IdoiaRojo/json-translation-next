import Button from '@/components/Button';
import {Header} from '@/components/Header';
import {ProgressBar} from '@/components/ProgressBar';
import {ChipCustom} from '@/components/form_side/Chip';
import {InputContainer} from '@/components/form_side/InputContainer';
import {LanguageSelect} from '@/components/form_side/LanguageSelect';
import {translateJSON} from '@/helpers/translateJson';
import {FileType, FormTranslation} from '@/types/FormTranslation';
import {LanguageChunk} from '@/types/LanguageChunk';
import {LanguageObject} from '@/types/LanguageObject';
import {
  LANGUAGES_AVAILABLE,
  LanguagesAvailable,
  languageNames,
} from '@/types/LanguagesAvailable';
import {translateCSV} from '@/utils/translateCSV';
import {Mode} from 'fs';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {LanguagesVerticalStepper} from './LanguagesVerticalStepper';

interface FileUploaded {
  file: File;
  extension: 'json' | 'csv';
}
export const FormSide = ({
  translationStatus,
  setTranslation,
  setTranslationStatus,
  fileType,
  setFileType,
}: {
  translationStatus: FormTranslation['translationStatus'];
  setTranslation: FormTranslation['setTranslation'];
  setTranslationStatus: FormTranslation['setTranslationStatus'];
  fileType: FormTranslation['fileType'];
  setFileType: FormTranslation['setFileType'];
}) => {
  const [mode, setMode] = useState<Mode>('translate');

  const [openAIKey, setOpenAIKey] = useState<string | null>(null);
  const [inputLanguage, setInputLanguage] = useState<LanguagesAvailable>('en');
  const [outputLanguages, setOutputLanguages] = useState<string[]>(['fr']);
  const [file, setFile] = useState<FileUploaded | null>(null);
  const [fileChunks, setFileChunks] = useState<LanguageChunk[] | null>(null);
  const [languagesObject, setLanguagesObjects] = useState<LanguageObject[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files[0];
    const fileName = file.name.split('.')[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'json' || fileExtension === 'csv') {
      if (fileExtension === 'json') {
        setInputLanguage(fileName);
        toast.success(
          `${languageNames[fileName]} automatically detected as file language`
        );
      }
      setFile({
        file,
        extension: fileExtension,
      });
    } else {
      toast.error('Unsupported file format. Please upload a JSON or CSV file.');
    }
  };

  const handleTranslateJson = () => {
    if (!file || !openAIKey) {
      toast.error(
        !file
          ? 'You must upload a file to translate'
          : 'You must upload a file to translate'
      );
      return null;
    }
    if (file.extension === 'csv') {
      translateCSV({
        file,
        setFileChunks,
        setTranslation,
        setLanguagesObjects,
        setTranslationStatus,
        inputLanguage,
        outputLanguages,
        mode,
        openAIKey,
      });
    } else {
      translateJSON({
        file,
        setFileChunks,
        setTranslation,
        setLanguagesObjects,
        setTranslationStatus,
        inputLanguage,
        outputLanguage: outputLanguages[0],
        mode,
        openAIKey,
      });
    }
  };

  const progressPercentage =
    (languagesObject.filter((chunk) => chunk.status === 'completed').length /
      languagesObject.length) *
    100;

  const handleChange = ({target}: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(target.value as FileType);
  };

  useEffect(() => {
    const updatedOutputLanguages = outputLanguages.filter(
      (lang) => lang !== inputLanguage
    );
    if (updatedOutputLanguages.length === 0)
      updatedOutputLanguages.push(availableLanguagesForTranslation[0]);

    setOutputLanguages(updatedOutputLanguages);
  }, [inputLanguage]);

  const handleSelectChange = (field: string, value: unknown) => {
    setOutputLanguages(value as string[]);
  };

  const availableLanguagesForTranslation = LANGUAGES_AVAILABLE.filter(
    (language) => language !== inputLanguage
  );
  return (
    <>
      <Header>
        <div>
          <h1 className='text-[20px] font-bold'>Translate your {fileType}</h1>
        </div>
        <div className='border border-grey-200 rounded-md px-1 py-2'>
          <select onChange={handleChange}>
            <option value='csv'>csv</option>
            <option value='json'>json</option>
          </select>
        </div>
      </Header>
      <div className='flex flex-row'>
        <div>
          <InputContainer>
            <div className='flex items-center'>
              <input
                type='file'
                onChange={handleFileChange}
                accept='.json, .csv'
              />
            </div>
          </InputContainer>
          <InputContainer>
            <label>From</label>
            <LanguageSelect
              selectedLanguage={inputLanguage}
              onLanguageChange={setInputLanguage}
            />
          </InputContainer>
          <InputContainer>
            <label>To</label>
            {fileType === 'csv' ? (
              <ChipCustom
                valueAct={outputLanguages}
                values={availableLanguagesForTranslation}
                handleFieldChange={handleSelectChange}
              />
            ) : (
              <div></div>
              // <LanguageSelect
              //   selectedLanguage={outputLanguage}
              //   onLanguageChange={setOutputLanguage}
              // />
            )}
          </InputContainer>
          <InputContainer>
            <label>Enter OpenAI Key</label>
            <input
              type='text'
              name='key'
              required={true}
              className='border border-grey-400 rounded-md px-1 py-2 outline-none block w-full'
              value={openAIKey || ''}
              onChange={(event) => setOpenAIKey(event.target.value)}
            />
          </InputContainer>
          <Button
            onClick={handleTranslateJson}
            className={`${fileType === 'csv' ? 'mt-4' : ''}`}
          >
            Translate
          </Button>
        </div>
        <div className={`${fileType === 'csv' ? 'mx-10' : 'my-10'} flex-1`}>
          {translationStatus === 'loading' && (
            <p className=''>
              This process could take some minutes, please wait patiently
            </p>
          )}
          <div className='my-4'>
            {languagesObject.length > 0 && (
              <>
                <ProgressBar progressPercentage={progressPercentage} />
                <LanguagesVerticalStepper
                  languagesObject={languagesObject}
                  fileChunks={fileChunks}
                  inputLanguage={inputLanguage}
                  mode={mode}
                  setTranslation={setTranslation}
                  openAIKey={openAIKey}
                  setLanguagesObjects={setLanguagesObjects}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
