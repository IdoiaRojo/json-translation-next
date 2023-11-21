import {CheckCircle, VinylRecord, WarningCircle} from '@phosphor-icons/react';
import {LanguageObject} from '../../types/LanguageObject';

export const StepIcon = ({chunkStatus}: {chunkStatus: LanguageObject}) => {
  return (
    <div
      className={`mr-2 w-[18px] flex items-center justify-center ${
        chunkStatus.status === 'loading'
          ? 'text-loading'
          : chunkStatus.status === 'error'
          ? 'text-error'
          : 'text-success'
      }`}
    >
      {chunkStatus.status === 'loading' ? (
        <div className='animate-spin'>
          <VinylRecord />
        </div>
      ) : chunkStatus.status === 'pending' ? (
        <span className='w-3 h-3 bg-grey-300 rounded-full block'></span>
      ) : chunkStatus.status === 'error' ? (
        <WarningCircle weight='fill' size={16} />
      ) : (
        <CheckCircle weight='fill' size={16} />
      )}
    </div>
  );
};
