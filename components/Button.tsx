import React, {FC, PropsWithChildren} from 'react';
import Loader from './Loader';

interface Props {
  size?: 'small' | 'medium' | 'large';
}
const Button: FC<PropsWithChildren<Props>> = ({
  isLoading,
  icon,
  disabled,
  children,
  size = 'medium',
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`rounded-lg ${
        disabled
          ? 'bg-gray-300 opacity-60 cursor-not-allowed'
          : 'border border-grey-200 cursor-pointer'
      } flex ${
        size === 'small' ? 'py-1 px-2' : 'py-2 px-3'
      } transition-all hover:bg-grey-100 ${props?.className}`}
    >
      {isLoading ? <Loader /> : children}

      {icon && <span className='ml-2'>{icon}</span>}
    </button>
  );
};

export default Button;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}
