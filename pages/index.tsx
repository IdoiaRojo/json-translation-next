import {FormSide} from '@/components/form_side/FormSide';
import {PreviewSide} from '@/components/preview_side/PreviewSide';
import {FileType, FormTranslation} from '@/types/FormTranslation';
import {TranslationStatus} from '@/types/TranslationStatus';
import {NextPage} from 'next';
import {useState} from 'react';
import {Toaster} from 'react-hot-toast';

interface Props {}

const Home: NextPage<Props> = () => {
  const [fileType, setFileType] = useState<FileType>('csv');
  const [translation, setTranslation] =
    useState<FormTranslation['translation']>(null);
  const [translationStatus, setTranslationStatus] =
    useState<TranslationStatus>('default');

  return (
    <div
      className={`${
        fileType === 'csv' ? 'flex-col' : 'flex-row'
      } min-h-screen flex  items-start justify-between`}
    >
      <div
        className={`${
          fileType === 'csv' ? 'w-full h-1/2 flex-1' : 'w-1/2 h-screen'
        } overflow-y-auto p-10`}
      >
        <FormSide
          setTranslation={setTranslation}
          translationStatus={translationStatus}
          setTranslationStatus={setTranslationStatus}
          fileType={fileType}
          setFileType={setFileType}
        />
      </div>
      <div
        className={`${
          fileType === 'csv' ? 'w-full h-1/2 flex-1' : 'w-1/2 h-screen'
        } bg-gray-100 p-10 flex flex-col`}
      >
        <PreviewSide
          translation={translation}
          translationStatus={translationStatus}
          fileType={fileType}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
