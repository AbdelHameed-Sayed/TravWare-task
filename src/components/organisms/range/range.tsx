import React, {Dispatch, FC, SetStateAction} from 'react';

import AppInput from '@/components/atoms/appInput/appInput';

interface IProps {
  priceRange: number[];
  setPriceRange: Dispatch<SetStateAction<number[]>>;
}

const Range: FC<IProps> = ({priceRange, setPriceRange}) => {
  const minPercent = (priceRange[0] / 1000) * 100;
  const maxPercent = (priceRange[1] / 99999) * 100;
  const sliderStyle1 = {
    background: `linear-gradient(to right, transparent ${minPercent}%, blue ${minPercent}%)`,
  };
  const sliderStyle2 = {
    background: `linear-gradient(to right, blue ${maxPercent}%, transparent ${maxPercent}%`,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1">
        <AppInput
          className="flex-1 h-1 !p-0 cursor-pointer appearance-none -me-[1px] border-e-0 rounded-e-none rotate-0"
          type="range"
          placeholder="Min Price"
          min={0}
          max={1000}
          step={1}
          value={priceRange[0]}
          onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
          style={sliderStyle1}
        />
        <AppInput
          className="flex-1 h-1 !p-0 cursor-pointer appearance-none border-s-0 rounded-s-none"
          type="range"
          placeholder="Max Price"
          min={1000}
          max={99999}
          step={1}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], +e.target.value])}
          style={sliderStyle2}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <AppInput
          type="number"
          placeholder="Min Price"
          min={0}
          max={1000}
          value={priceRange[0]}
          onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
          className="!w-fit"
        />
        <p>-</p>
        <AppInput
          type="number"
          placeholder="Max Price"
          min={1000}
          max={99999}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], +e.target.value])}
          className="!w-fit"
        />
      </div>
    </div>
  );
};

export default Range;
