import React, {ChangeEvent, FC, InputHTMLAttributes} from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string | number;
}

const AppInput: FC<IProps> = ({
  placeholder,
  value,
  className,
  onChange,
  ...props
}) => {
  return (
    <input
      className={`border rounded px-4 py-2 w-full md:w-1/3 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default AppInput;
