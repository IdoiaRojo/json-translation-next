import {CheckCircle, WarningCircle} from '@phosphor-icons/react';
import {TranslationChunk} from '../../types/TranslationChunk';
import {StepLoading} from './StepLoading';

export const StepIcon = ({chunkStatus}: {chunkStatus: TranslationChunk}) => {
  return (
    <span
      className={`mr-2 ${
        chunkStatus.status === 'pending'
          ? 'text-pending'
          : chunkStatus.status === 'error'
          ? 'text-error'
          : 'text-success'
      }`}
    >
      {chunkStatus.status === 'pending' ? (
        <StepLoading />
      ) : chunkStatus.status === 'error' ? (
        <WarningCircle weight='fill' size={16} />
      ) : (
        <CheckCircle weight='fill' size={16} />
      )}
    </span>
  );
};
