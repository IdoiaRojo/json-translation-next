import {FormTranslation} from '@/types/FormTranslation';
import {downloadTranslatedFile} from '../../helpers/downloadJson';
import Button from '../Button';
import {Header} from '../Header';
import {RenderCSVTable} from './RenderCSVTable';

export const PreviewSide = ({
  translation,
  translationStatus,
  fileType,
}: {
  translation: FormTranslation['translation'];
  translationStatus: FormTranslation['translationStatus'];
  fileType: FormTranslation['fileType'];
}) => {
  const handleDownloadTranslatedFile = () => {
    if (!translation) {
      alert('No hay contenido traducido para descargar.');
      return;
    }
    downloadTranslatedFile(translation, fileType);
  };
  return (
    <>
      <Header>
        <h1 className='text-[20px] font-bold'>Preview</h1>
        {translationStatus === 'finished' && (
          <div className='mt-4'>
            <Button onClick={handleDownloadTranslatedFile}>
              Download {fileType}
            </Button>
          </div>
        )}
      </Header>

      {translation && fileType === 'json' ? (
        <div className='max-h-screen overflow-y-auto'>
          <pre className='whitespace-pre-wrap' style={{}}>
            {JSON.stringify(translation, null, 2)}
          </pre>
        </div>
      ) : (
        <RenderCSVTable translationsData={translation} />
      )}
    </>
  );
};
