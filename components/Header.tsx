import {ComponentProps} from 'react';

export const Header = ({children}: ComponentProps<'div'>) => {
  return <div className='h-20 flex items-end justify-between'>{children}</div>;
};
