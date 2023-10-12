import {downloadTranslatedJSON} from '@/helpers/downloadJson';
import {translateJSON} from '@/helpers/translateJson';
import {TranslationChunk} from '@/types/TranslationChunk';
import {TranslationData} from '@/types/TranslationData';
import {SetStateAction, useState} from 'react';
import Button from '../Button';
import {ChunkVerticalStepper} from '../ChunkVerticalStepper';
import {ProgressBar} from '../ProgressBar';

export const FormSide = ({
  translations,
  setTranslations,
}: {
  translations: TranslationData;
  setTranslations: React.Dispatch<SetStateAction<TranslationData>>;
}) => {
  const [statusTranslation, setStatusTranslation] = useState<
    'default' | 'loading' | 'finished'
  >('default');
  const [mode, setMode] = useState<'translate' | 'fillEmpty'>('translate');
  const [inputLanguage, setInputLanguage] = useState('es');
  const [outputLanguage, setOutputLanguage] = useState('de');
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState<TranslationData | null>(null);
  const [chunksStatus, setChunksStatus] = useState<TranslationChunk[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setJsonFile(file);
  };

  const handleTranslateJson = () =>
    translateJSON({
      jsonFile,
      setJsonData,
      setTranslations,
      setChunksStatus,
      setStatusTranslation,
      inputLanguage,
      outputLanguage,
      mode,
    });

  const progressPercentage =
    (chunksStatus.filter((chunk) => chunk.status === 'completed').length /
      chunksStatus.length) *
    100;
  const handleDownloadTranslatedJSON = () => {
    if (!translations) {
      alert('No hay contenido traducido para descargar.');
      return;
    }
    downloadTranslatedJSON(translations);
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
        {statusTranslation === 'loading' && (
          <p className=''>
            This process could take some minutes, please wait patiently
          </p>
        )}
        <div className='my-4'>
          {chunksStatus.length > 0 && (
            <>
              <ProgressBar progressPercentage={progressPercentage} />
              <ChunkVerticalStepper
                chunksStatus={chunksStatus}
                jsonData={jsonData}
                inputLanguage={inputLanguage}
                outputLanguage={outputLanguage}
                mode={mode}
                setTranslations={setTranslations}
                setChunksStatus={setChunksStatus}
              />

              {statusTranslation === 'finished' && (
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
