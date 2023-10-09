import {TranslationChunk} from '@/pages';
import {StepCompleted} from './status/StepCompleted';
import {StepLoading} from './status/StepLoading';

export const ChunkVerticalStepper = ({
  chunksStatus,
  jsonData,
}: {
  chunksStatus: TranslationChunk[];
  jsonData: any;
}) => {
  return (
    <div className='vertical-stepper'>
      {chunksStatus.map((chunkStatus, index) => (
        <div
          key={index}
          className={`step ${
            chunkStatus.status === 'completed' ? 'completed' : ''
          }`}
          style={{
            color:
              chunkStatus.status === 'completed'
                ? 'green'
                : chunkStatus.status === 'error'
                ? 'red'
                : 'orange',
          }}
        >
          {index !== chunksStatus.length - 1 && (
            <div className='stepper-line'></div>
          )}

          <div className='flex'>
            {chunkStatus.status === 'pending' ? (
              <StepLoading />
            ) : (
              <StepCompleted />
            )}
            {chunkStatus.key}
            {chunkStatus.status === 'error' && (
              <>
                <span>- Error</span>
                <button
                  className='rounded-md border border-white px-4 py-2'
                  onClick={() =>
                    // translateChunk({
                    //   chunkStatus,
                    //   jsonData,
                    //   setTranslations,
                    //   inputLanguage,
                    //   outputLanguage,
                    //   mode,
                    // })
                    console.log('translateChunk')
                  }
                >
                  Reintentar
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
