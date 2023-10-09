import {ChunkVerticalStepper} from '@/components/ChunkVerticalStepper';
import {ProgressBar} from '@/components/ProgressBar';
import {NextPage} from 'next';
import {useState} from 'react';
import {Toaster} from 'react-hot-toast';

interface Props {}

export interface TranslationChunk {
  key: string;
  status: 'pending' | 'completed' | 'error';
  translation?: any;
}
interface TranslationData {
  [key: string]: any;
}

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setJsonFile(file);
  };

  const handleApiCall = async (text: string): Promise<any> => {
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          inputLanguage,
          outputLanguage,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.success) {
        console.error('API request was not successful:', responseData.error);
        return null;
      }

      return responseData.data.inputLanguage
        ? responseData.data.data
        : responseData.data;
    } catch (error) {
      console.error('An error occurred while making the API request:', error);
      return null;
    }
  };

  const translateChunk = async (chunk: TranslationChunk, jsonData) => {
    const key = chunk.key;

    try {
      const translation = await handleApiCall(JSON.stringify(jsonData[key]));

      if (translation) {
        setTranslations((prevTranslations) => ({
          ...prevTranslations,
          [key]: translation,
        }));
        updateChunkStatus(key, 'completed');
      } else {
        updateChunkStatus(key, 'error');
      }
    } catch (error) {
      console.error('Error al traducir el chunk:', error);
      updateChunkStatus(key, 'error');
    }
  };

  const updateChunkStatus = (
    key: string,
    status: 'pending' | 'completed' | 'error',
    translation?: any
  ) => {
    setChunksStatus((prevChunksStatus) =>
      prevChunksStatus.map((chunk) =>
        chunk.key === key ? {...chunk, status, translation} : chunk
      )
    );
  };

  const translateJSON = async () => {
    if (!jsonFile) {
      alert('Selecciona un archivo JSON');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target) {
        const fileContent = event.target.result as string;
        try {
          const jsonData: TranslationData = JSON.parse(fileContent);
          setJsonData(jsonData);
          setTranslations({});
          const initialChunks: TranslationChunk[] = Object.keys(jsonData).map(
            (key) => ({
              key,
              status: 'pending',
            })
          );
          setChunksStatus(initialChunks);
          setStatusTranslation('loading');

          for (const chunk of initialChunks) {
            await translateChunk(chunk, jsonData);
          }

          setStatusTranslation('finished');
        } catch (error) {
          console.error('Error al parsear el archivo JSON:', error);
        }
      }
    };

    reader.readAsText(jsonFile);
  };

  const progressPercentage =
    (chunksStatus.filter((chunk) => chunk.status === 'completed').length /
      chunksStatus.length) *
    100;

  const downloadTranslatedJSON = () => {
    if (!translations) {
      alert('No hay contenido traducido para descargar.');
      return;
    }

    // Crear un Blob con el contenido traducido
    const translatedBlob = new Blob([JSON.stringify(translations)], {
      type: 'application/json',
    });

    // Crear una URL para el Blob
    const url = URL.createObjectURL(translatedBlob);

    // Crear un enlace de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.json';
    a.style.display = 'none';

    // Agregar el enlace al DOM y hacer clic en él para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Limpiar la URL del Blob después de la descarga
    URL.revokeObjectURL(url);
  };

  return (
    <div className='w-full min-h-screen'>
      <Toaster />
      <div className='flex items-center justify-center flex-col mb-12 h-full'>
        <div className='m-10'>
          <h1 className='text-xl'>Translate your JSON</h1>
        </div>
        <div className='m-10'>
          <input type='file' onChange={handleFileChange} accept='.json' />
          <button
            className='rounded-md border border-white px-4 py-2'
            onClick={translateJSON}
          >
            Translate
          </button>
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
                  <>
                    <button
                      className='rounded-md border border-white px-4 py-2'
                      onClick={downloadTranslatedJSON}
                    >
                      Download Translated JSON
                    </button>
                    <p>Traducciones:</p>
                    <pre className='whitespace-pre-wrap' style={{}}>
                      {JSON.stringify(translations, null, 2)}
                    </pre>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
