import {formatTime} from '@/helpers/formatTime';
import {
  translateChunk,
  updateLanguageObjectStatus,
} from '@/helpers/translateCSV';
import {FormTranslation} from '@/types/FormTranslation';
import Button from './Button';
import {ProgressBar} from './ProgressBar';
import {StepIcon} from './status/StepIcon';

export const LanguagesVerticalStepper = ({
  languagesObject,
  fileChunks,
  inputLanguage,
  mode,
  setTranslation,
  openAIKey,
  setLanguagesObjects,
}: {
  languagesObject: FormTranslation['languagesObject'];
  fileChunks: FormTranslation['fileChunks'];
  inputLanguage: FormTranslation['inputLanguage'];
  mode: FormTranslation['mode'];
  setTranslation: FormTranslation['setTranslation'];
  openAIKey: string;
  setLanguagesObjects: FormTranslation['setLanguagesObjects'];
}) => {
  console.log('fileChunks', fileChunks);
  return (
    <div className='vertical-stepper relative bg-grey-100 p-2'>
      {languagesObject.map((languageObject, index) => (
        <div
          key={index}
          className={`step h-16 bg-white border-b border-b-grey-200 flex items-center justify-start rounded-sm p-2 transition-all hover:bg-grey-100 ${
            languageObject.status === 'completed' ? 'completed' : ''
          }`}
        >
          <StepIcon chunkStatus={languageObject} />

          <div className='flex flex-col pl-2'>
            <p className='font-bold text-[13px] leading-[13px]'>
              {languageObject.key}
            </p>
            <span className='text-[12px] leading-tight'>
              {languageObject.time
                ? formatTime(languageObject.time)
                : languageObject.status === 'loading'
                ? 'Translating...'
                : ''}
            </span>
          </div>
          <div className='w-[50%] mx-4'>
            <ProgressBar
              progressPercentage={
                (languageObject.chunkPosition * 100) /
                languageObject.chunksCount
              }
            />
          </div>
          {languageObject.status === 'error' && (
            <>
              <Button
                size='small'
                onClick={() => {
                  updateLanguageObjectStatus({
                    key: languageObject.key,
                    status: 'loading',
                    setLanguagesObjects,
                    position: 0,
                  });
                  translateChunk({
                    lang: languageObject.key,
                    data: fileChunks[languageObject.chunkPosition].data,
                    inputLanguage,
                    mode,
                    setTranslation,
                    openAIKey,
                    setLanguagesObjects,
                    chunkPosition: languageObject.chunkPosition,
                  });
                }}
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
