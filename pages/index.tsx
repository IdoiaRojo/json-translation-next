import {FormSide} from '@/components/form_side/FormSide';
import {PreviewSide} from '@/components/preview_side/PreviewSide';
import {TranslationData} from '@/types/TranslationData';
import {NextPage} from 'next';
import {useState} from 'react';
import {Toaster} from 'react-hot-toast';

interface Props {}

const Home: NextPage<Props> = () => {
  const [translations, setTranslations] = useState<TranslationData | null>(
    null
  );
  return (
    <div className='min-h-screen flex flex-row items-start justify-between'>
      <div className='w-1/2 h-screen overflow-y-auto p-10'>
        <FormSide
          translations={translations}
          setTranslations={setTranslations}
        />
      </div>
      <div className='w-1/2 h-screen bg-gray-100 p-10 flex flex-col'>
        <PreviewSide translations={translations} />
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
