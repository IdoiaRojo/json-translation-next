import {TranslationData} from '@/types/TranslationData';

export const PreviewSide = ({
  translations,
}: {
  translations: TranslationData;
}) => {
  return (
    <>
      <div className='p-10'>
        <h1 className='text-[20px] font-bold'>Preview</h1>
      </div>
      {translations && (
        <div className='max-h-screen overflow-y-auto'>
          <pre className='whitespace-pre-wrap' style={{}}>
            {JSON.stringify(translations, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};
