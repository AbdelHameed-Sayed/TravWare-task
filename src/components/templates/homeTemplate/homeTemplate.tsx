'use client';

import React, {FC, useCallback, useMemo, useState} from 'react';

import Link from 'next/link';

import AppButton from '@/components/atoms/appButton/appButton';
import AppInput from '@/components/atoms/appInput/appInput';
import AppSelect from '@/components/atoms/appSelect/appSelect';
import Card from '@/components/organisms/card/card';
import Range from '@/components/organisms/range/range';
import Cart from 'public/svgs/cart.svg';

type TItem = {
  id: number;
  name: string;
  price: number;
  description: string;
};
type TCartState = {
  [key: number]: TItem & {count: number};
};
interface IProps {
  items: TItem[];
}

const sortOptionsCases = {
  'a-z': 'a-z',
  'z-a': 'z-a',
  priceHighToLow: 'priceHighToLow',
  priceLowToHigh: 'priceLowToHigh',
};
const sortOptions = [
  {id: 1, title: 'Name: A-Z', value: sortOptionsCases['a-z']},
  {id: 2, title: 'Name: Z-A', value: sortOptionsCases['z-a']},
  {id: 3, title: 'Price: High to Low', value: sortOptionsCases.priceHighToLow},
  {id: 4, title: 'Price: Low to High', value: sortOptionsCases.priceLowToHigh},
];

const HomeTemplate: FC<IProps> = ({items}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState(sortOptions[0]['value']);
  const [priceRange, setPriceRange] = useState([0, 99999999]);
  const [cart, setCart] = useState<TCartState>({});
  const [showCart, setShowCart] = useState(false);

  const filteredItems = useMemo(
    () =>
      items
        .filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .filter(
          item => item.price >= priceRange[0] && item.price <= priceRange[1],
        )
        .sort((a, b) => {
          switch (sortOption) {
            case sortOptionsCases['a-z']:
              return a.name.localeCompare(b.name);
            case sortOptionsCases['z-a']:
              return b.name.localeCompare(a.name);
            case sortOptionsCases.priceHighToLow:
              return b.price - a.price;
            case sortOptionsCases.priceLowToHigh:
              return a.price - b.price;
            default:
              return 0;
          }
        }),
    [items, priceRange, searchQuery, sortOption],
  );

  const addToCartHandler = useCallback((item: TItem) => {
    setCart(prev => {
      return {
        ...prev,
        [item.id]: {
          ...item,
          count: (prev[item.id] ? prev[item.id].count : 0) + 1,
        },
      };
    });
  }, []);

  const removeFromCartHandler = useCallback((item: TItem) => {
    setCart(prev => {
      const currentItem = prev[item.id];
      if (!currentItem) {
        return prev;
      }

      const updatedCart = {...prev};

      if (currentItem.count <= 1) {
        delete updatedCart[item.id];
      } else {
        updatedCart[item.id] = {
          ...currentItem,
          count: currentItem.count - 1,
        };
      }

      return updatedCart;
    });
  }, []);

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Item List</h1>

      <section className="mb-6 flex flex-1 flex-col md:flex-row justify-between gap-6 p-3">
        <AppInput
          className="flex-1"
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <AppSelect
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          options={sortOptions}
        />
        <Range priceRange={priceRange} setPriceRange={setPriceRange} />

        <div className="relative">
          <AppButton
            className="flex items-center text-center bg-transparent text-black text-lg font-bold"
            onClick={() => {
              setShowCart(prev => !prev);
            }}>
            <div className="relative">
              <Cart />
              <p className="absolute end-0 -top-5 w-7 h-7 p-1 text-sm rounded-full bg-blue-300">
                {Object.values(cart).reduce((acc, item) => acc + item.count, 0)}
              </p>
            </div>
            Cart
          </AppButton>

          {showCart ? (
            <div className="absolute w-56 bg-stone-100 -ms-2.5 max-h-64 overflow-scroll">
              {Object.values(cart).length > 0 ? (
                <div className="grid grid-cols-1 gap-6 text-center">
                  {Object.values(cart).map(item => (
                    <Card
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      price={`${item.price.toFixed(2)} EGP`}
                      count={item.count}
                      addToCardHandler={() => addToCartHandler(item)}
                      removeCardHandler={() => removeFromCartHandler(item)}
                    />
                  ))}
                  <Link
                    className="bg-blue-500 text-white text-sm px-1 py-2 rounded active:opacity-50 mx-5 mb-5 text-center"
                    href={'/payment'}>
                    Checkout (EGP{' '}
                    {Object.values(cart)
                      .reduce((acc, item) => acc + item.price * item.count, 0)
                      .toFixed(2)}
                    )
                  </Link>
                </div>
              ) : (
                <p className="text-sm p-3">
                  It seems there is no item in the cart
                </p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Card
              key={item.id}
              name={item.name}
              description={item.description}
              price={`${item.price.toFixed(2)} EGP`}
              buttonTitle="Add to Cart"
              addToCardHandler={() => addToCartHandler(item)}
            />
          ))
        ) : (
          <p className="text-xl p-10 text-neutral-700">
            It seems that no Item found
          </p>
        )}
      </section>
    </section>
  );
};

export default HomeTemplate;
