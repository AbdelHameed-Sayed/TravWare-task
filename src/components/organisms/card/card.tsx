import React, {FC} from 'react';

import AppButton from '@/components/atoms/appButton/appButton';

interface IProps {
  name: string;
  description: string;
  price: string;
  buttonTitle?: string;
  addToCardHandler: () => void;
  removeCardHandler?: () => void;
  count?: number;
}

const Card: FC<IProps> = ({
  name,
  description,
  price,
  buttonTitle,
  addToCardHandler,
  removeCardHandler,
  count,
}) => {
  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="mb-2">{description}</p>
      <p className="mb-4 font-semibold">{price}</p>

      {count && count > 0 ? (
        <div className="flex items-center justify-center gap-6">
          <AppButton onClick={() => removeCardHandler?.()}>-</AppButton>
          <p>{count}</p>
          <AppButton onClick={addToCardHandler}>+</AppButton>
        </div>
      ) : (
        <AppButton onClick={addToCardHandler}>{buttonTitle}</AppButton>
      )}
    </div>
  );
};

export default Card;
