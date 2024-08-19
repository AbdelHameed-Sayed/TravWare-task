import React, {ChangeEvent, FC, SelectHTMLAttributes} from 'react';

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  options: {
    id: number;
    value: string;
    title: string;
    disabled?: boolean;
  }[];
}

const AppSelect: FC<IProps> = ({className, onChange, value, options}) => {
  return (
    <select
      className={`border rounded outline-none px-4 py-2 appearance-auto ${className}`}
      value={value || undefined}
      onChange={onChange}>
      {options.map(option => (
        <option key={option.id} value={option.value} disabled={option.disabled}>
          {option.title}
        </option>
      ))}
    </select>
  );
};

export default AppSelect;
