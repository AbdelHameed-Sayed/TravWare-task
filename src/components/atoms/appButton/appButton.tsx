import React, {ButtonHTMLAttributes, FC, ReactNode} from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

const AppButton: FC<IProps> = ({children, onClick, className, ...props}) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded active:opacity-50 ${className}`}
      onClick={onClick}
      {...props}>
      {children}
    </button>
  );
};

export default AppButton;
