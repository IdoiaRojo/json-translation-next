import {translateJSON} from '@/helpers/translateJson';
import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {FileType, FormTranslation} from '@/types/FormTranslation';
import {
  LANGUAGES_AVAILABLE,
  LanguagesAvailable,
  languageNames,
} from '@/types/LanguagesAvailable';
import {Translation} from '@/types/Translation';
import {Mode} from 'fs';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {translateCSV} from '../../helpers/translateCSV';
import Button from '../Button';
import {ChunkVerticalStepper} from '../ChunkVerticalStepper';
import {Header} from '../Header';
import {ProgressBar} from '../ProgressBar';
import {ChipCustom} from './Chip';
import {LanguageSelect} from './LanguageSelect';

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

  const [inputLanguage, setInputLanguage] = useState<LanguagesAvailable>('en');
  const [outputLanguages, setOutputLanguages] = useState<string[]>(['fr']);
  const [jsonFile, setJsonFile] = useState<FileUploaded | null>(null);
  const [jsonData, setJsonData] = useState<Translation | null>(null);
  const [translationChunks, setChunkToTranslates] = useState<
    ChunkToTranslate[]
  >([]);

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
      setJsonFile({
        file,
        extension: fileExtension,
      });
    } else {
      toast.error('Unsupported file format. Please upload a JSON or CSV file.');
    }
  };

  const handleTranslateJson = () => {
    if (
      !jsonFile
      // || inputLanguage === outputLanguage
    ) {
      toast.error(
        !jsonFile
          ? 'You must upload a file to translate'
          : 'Input and output language cannot be the same'
      );
      return null;
    }
    if (jsonFile.extension === 'csv') {
      translateCSV({
        file: jsonFile,
        setJsonData,
        setTranslation,
        setChunkToTranslates,
        setTranslationStatus,
        inputLanguage,
        outputLanguages,
        mode,
      });
    } else {
      translateJSON({
        jsonFile,
        setJsonData,
        setTranslation,
        setChunkToTranslates,
        setTranslationStatus,
        inputLanguage,
        outputLanguage: outputLanguages[0],
        mode,
      });
    }
  };

  const progressPercentage =
    (translationChunks.filter((chunk) => chunk.status === 'completed').length /
      translationChunks.length) *
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
          <div className='my-10 flex items-center'>
            <input
              type='file'
              onChange={handleFileChange}
              accept='.json, .csv'
            />
          </div>
          <div className='my-10'>
            <div className=''>
              <label>From</label>
              <LanguageSelect
                selectedLanguage={inputLanguage}
                onLanguageChange={setInputLanguage}
              />
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
            </div>
            <Button
              onClick={handleTranslateJson}
              className={`${fileType === 'csv' ? 'mt-4' : ''}`}
            >
              Translate
            </Button>
          </div>
        </div>
        <div className={`${fileType === 'csv' ? 'mx-10' : 'my-10'} flex-1`}>
          {translationStatus === 'loading' && (
            <p className=''>
              This process could take some minutes, please wait patiently
            </p>
          )}
          <div className='my-4'>
            {translationChunks.length > 0 && (
              <>
                <ProgressBar progressPercentage={progressPercentage} />
                <ChunkVerticalStepper
                  translationChunks={translationChunks}
                  jsonData={jsonData}
                  inputLanguage={inputLanguage}
                  outputLanguage={outputLanguages[0]}
                  mode={mode}
                  setTranslation={setTranslation}
                  setChunkToTranslates={setChunkToTranslates}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
