import {FormSide} from '@/components/form_side/FormSide';
import {PreviewSide} from '@/components/preview_side/PreviewSide';
import {Translation} from '@/types/Translation';
import {TranslationStatus} from '@/types/TranslationStatus';
import {NextPage} from 'next';
import {useState} from 'react';
import {Toaster} from 'react-hot-toast';

interface Props {}

const Home: NextPage<Props> = () => {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [translationStatus, setTranslationStatus] =
    useState<TranslationStatus>('default');
  return (
    <div className='min-h-screen flex flex-row items-start justify-between'>
      <div className='w-1/2 h-screen overflow-y-auto p-10'>
        <FormSide
          setTranslation={setTranslation}
          translationStatus={translationStatus}
          setTranslationStatus={setTranslationStatus}
        />
      </div>
      <div className='w-1/2 h-screen bg-gray-100 p-10 flex flex-col'>
        <PreviewSide
          translation={translation}
          translationStatus={translationStatus}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
