import {ComponentProps} from 'react';

export const InputContainer = ({children}: ComponentProps<'div'>) => {
  return <div className='my-2'>{children}</div>;
};
