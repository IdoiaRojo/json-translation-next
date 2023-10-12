import Button from '@/components/Button';
import {ChunkVerticalStepper} from '@/components/ChunkVerticalStepper';
import {ProgressBar} from '@/components/ProgressBar';
import {downloadTranslatedJSON} from '@/helpers/downloadJson';
import {translateJSON} from '@/helpers/translateJson';
import {TranslationChunk} from '@/types/TranslationChunk';
import {TranslationData} from '@/types/TranslationData';
import {NextPage} from 'next';
import {useState} from 'react';
import {Toaster} from 'react-hot-toast';

interface Props {}

const Home: NextPage<Props> = () => {
  const [statusTranslation, setStatusTranslation] = useState<
    'default' | 'loading' | 'finished'
  >('default');
  const [mode, setMode] = useState<'translate' | 'fillEmpty'>('translate');
  const [inputLanguage, setInputLanguage] = useState('es');
  const [outputLanguage, setOutputLanguage] = useState('de');
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState<TranslationData | null>(null);
  const [chunksStatus, setChunksStatus] = useState<TranslationChunk[]>([]);
  const [translations, setTranslations] = useState<TranslationData>({});
  const [showModal, setShowModal] = useState(false);

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
    <div className='w-full min-h-screen'>
      <Toaster />
      <div className='flex items-center justify-center flex-col mb-12 h-full'>
        <div className='m-10'>
          <h1 className='text-xl'>Translate your JSON</h1>
        </div>
        <div className='m-10 flex'>
          <input type='file' onChange={handleFileChange} accept='.json' />
          <Button onClick={handleTranslateJson}>Translate</Button>
          {/* <button
            className='rounded-md border border-white px-4 py-2'
            onClick={handleTranslateJson}
          >
            Translate
          </button> */}
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
                />

                {statusTranslation === 'finished' && (
                  <div className='flex'>
                    <Button onClick={() => setShowModal(true)}>
                      Preview translation
                    </Button>
                    <Button onClick={handleDownloadTranslatedJSON}>
                      Download JSON
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {showModal && (
          <div className='absolute'>
            <p>Traducciones:</p>
            <pre className='whitespace-pre-wrap' style={{}}>
              {JSON.stringify(translations, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
