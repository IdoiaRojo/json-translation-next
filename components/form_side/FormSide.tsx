import {checkFileName} from '@/helpers/checkFileName';
import {translateJSON} from '@/helpers/translateJson';
import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {FormTranslation} from '@/types/FormTranslation';
import {LanguagesAvailable, languageNames} from '@/types/LanguagesAvailable';
import {Translation} from '@/types/Translation';
import {ArrowRight} from '@phosphor-icons/react';
import {Mode} from 'fs';
import {useState} from 'react';
import toast from 'react-hot-toast';
import Button from '../Button';
import {ChunkVerticalStepper} from '../ChunkVerticalStepper';
import {Header} from '../Header';
import {ProgressBar} from '../ProgressBar';
import {LanguageSelect} from './LanguageSelect';

export const FormSide = ({
  translationStatus,
  setTranslation,
  setTranslationStatus,
}: {
  translationStatus: FormTranslation['translationStatus'];
  setTranslation: FormTranslation['setTranslation'];
  setTranslationStatus: FormTranslation['setTranslationStatus'];
}) => {
  const [mode, setMode] = useState<Mode>('translate');
  const [inputLanguage, setInputLanguage] = useState<LanguagesAvailable>('es');
  const [outputLanguage, setOutputLanguage] =
    useState<LanguagesAvailable>('en');
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState<Translation | null>(null);
  const [translationChunks, setChunkToTranslates] = useState<
    ChunkToTranslate[]
  >([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files[0];
    const fileName = file.name.split('.')[0];
    if (checkFileName(fileName)) {
      setInputLanguage(fileName);
      toast.success(
        `${languageNames[fileName]} automatically detected as file language`
      );
    }

    setJsonFile(file);
  };

  const handleTranslateJson = () => {
    if (!jsonFile || inputLanguage === outputLanguage) {
      toast.error(
        !jsonFile
          ? 'You must upload a file to translate'
          : 'Input and output language cannot be the same'
      );
      return null;
    }
    translateJSON({
      jsonFile,
      setJsonData,
      setTranslation,
      setChunkToTranslates,
      setTranslationStatus,
      inputLanguage,
      outputLanguage,
      mode,
    });
  };

  const progressPercentage =
    (translationChunks.filter((chunk) => chunk.status === 'completed').length /
      translationChunks.length) *
    100;

  return (
    <>
      <Header>
        <div>
          <h1 className='text-[20px] font-bold'>Translate your JSON</h1>
        </div>
      </Header>
      <div className='my-10 flex items-center'>
        <input type='file' onChange={handleFileChange} accept='.json' />
      </div>
      <div className='my-10 flex items-center justify-between'>
        <div className='flex items-center'>
          <LanguageSelect
            selectedLanguage={inputLanguage}
            onLanguageChange={setInputLanguage}
          />
          <span className='mx-2'>
            <ArrowRight />
          </span>
          <LanguageSelect
            selectedLanguage={outputLanguage}
            onLanguageChange={setOutputLanguage}
          />
        </div>
        <Button onClick={handleTranslateJson}>Translate</Button>
      </div>
      <div className='my-10'>
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
                outputLanguage={outputLanguage}
                mode={mode}
                setTranslation={setTranslation}
                setChunkToTranslates={setChunkToTranslates}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
