import {Translation} from '@/types/Translation';

export const PreviewSide = ({translation}: {translation: Translation}) => {
  return (
    <>
      <div className='p-10'>
        <h1 className='text-[20px] font-bold'>Preview</h1>
      </div>
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
