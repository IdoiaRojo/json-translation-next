import {formatTime} from '@/helpers/formatTime';
import {translateChunk} from '@/helpers/translateJson';
import {TranslationChunk} from '@/types/TranslationChunk';
import Button from './Button';
import {StepIcon} from './status/StepIcon';

export const ChunkVerticalStepper = ({
  chunksStatus,
  jsonData,
  inputLanguage,
  outputLanguage,
  mode,
  setTranslations,
  setChunksStatus,
}: {
  chunksStatus: TranslationChunk[];
  jsonData: any;
  inputLanguage: any;
  outputLanguage: any;
  mode: any;
  setTranslations: any;
  setChunksStatus: any;
}) => {
  return (
    <div className='vertical-stepper relative bg-grey-100 p-2'>
      {chunksStatus.map((chunkStatus, index) => (
        <div
          key={index}
          className={`step h-16 bg-white border-b border-b-grey-200 flex items-center justify-start rounded-sm p-2 transition-all hover:bg-grey-100 ${
            chunkStatus.status === 'completed' ? 'completed' : ''
          }`}
        >
          <StepIcon chunkStatus={chunkStatus} />

          <div className='flex flex-col pl-2 mr-4'>
            <p className='font-bold text-[13px] leading-[13px]'>
              {chunkStatus.key}
            </p>
            <span className='text-[12px] leading-tight'>
              {chunkStatus.time ? formatTime(chunkStatus.time) : ''}
            </span>
          </div>
          {chunkStatus.status === 'error' && (
            <>
              <Button
                size='small'
                onClick={() =>
                  translateChunk({
                    chunk: chunkStatus,
                    jsonData,
                    inputLanguage,
                    outputLanguage,
                    mode,
                    setTranslations,
                    setChunksStatus,
                  })
                }
              >
                Retry
              </Button>
            </>
          )}
        </div>
      ))}
      <div className='absolute top-0 left-[11px] h-full py-6'>
        <svg
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          width='28px'
          height='100%'
          viewBox='0 0 28 100%'
          className='border border-grey-200 rounded-full'
        ></svg>
      </div>
    </div>
  );
};
