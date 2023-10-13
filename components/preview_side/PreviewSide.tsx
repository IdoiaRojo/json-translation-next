import {downloadTranslatedJSON} from '@/helpers/downloadJson';
import {FormTranslation} from '@/types/FormTranslation';
import {Translation} from '@/types/Translation';
import Button from '../Button';
import {Header} from '../Header';

export const PreviewSide = ({
  translation,
  translationStatus,
}: {
  translation: Translation;
  translationStatus: FormTranslation['translationStatus'];
}) => {
  const handleDownloadTranslatedJSON = () => {
    if (!translation) {
      alert('No hay contenido traducido para descargar.');
      return;
    }
    downloadTranslatedJSON(translation);
  };
  return (
    <>
      <Header>
        <h1 className='text-[20px] font-bold'>Preview</h1>
        {translationStatus === 'finished' && (
          <div className='mt-4'>
            <Button onClick={handleDownloadTranslatedJSON}>
              Download JSON
            </Button>
          </div>
        )}
      </Header>

      {translation && (
        <div className='max-h-screen overflow-y-auto'>
          <pre className='whitespace-pre-wrap' style={{}}>
            {JSON.stringify(translation, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};
