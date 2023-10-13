import {downloadTranslatedJSON} from '@/helpers/downloadJson';
import {translateJSON} from '@/helpers/translateJson';
import {ChunkToTranslate} from '@/types/ChunkToTranslate';
import {LanguagesAvailable} from '@/types/LanguagesAvailable';
import {Translation} from '@/types/Translation';
import {TranslationStatus} from '@/types/TranslationStatus';
import {Mode} from 'fs';
import {SetStateAction, useState} from 'react';
import Button from '../Button';
import {ChunkVerticalStepper} from '../ChunkVerticalStepper';
import {ProgressBar} from '../ProgressBar';

export const FormSide = ({
  translation,
  setTranslation,
}: {
  translation: Translation;
  setTranslation: React.Dispatch<SetStateAction<Translation>>;
}) => {
  const [translationStatus, setTranslationStatus] =
    useState<TranslationStatus>('default');
  const [mode, setMode] = useState<Mode>('translate');
  const [inputLanguage, setInputLanguage] = useState<LanguagesAvailable>('es');
  const [outputLanguage, setOutputLanguage] =
    useState<LanguagesAvailable>('de');
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState<Translation | null>(null);
  const [translationChunks, setChunkToTranslates] = useState<
    ChunkToTranslate[]
  >([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setJsonFile(file);
  };

  const handleTranslateJson = () =>
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

  const progressPercentage =
    (translationChunks.filter((chunk) => chunk.status === 'completed').length /
      translationChunks.length) *
    100;
  const handleDownloadTranslatedJSON = () => {
    if (!translation) {
      alert('No hay contenido traducido para descargar.');
      return;
    }
    downloadTranslatedJSON(translation);
  };
  return (
    <>
      <div className='m-10'>
        <h1 className='text-[20px] font-bold'>Translate your JSON</h1>
      </div>
      <div className='m-10 flex'>
        <input type='file' onChange={handleFileChange} accept='.json' />
        <Button onClick={handleTranslateJson}>Translate</Button>
      </div>
      <div className='m-10 w-[400px]'>
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

              {translationStatus === 'finished' && (
                <div className='mt-4'>
                  <Button onClick={handleDownloadTranslatedJSON}>
                    Download JSON
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
