import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTemplate from './homeTemplate';
import data from '@/service/data.json';

const mockItems = data.slice(0, 3);

test('renders the component with items', () => {
  render(<HomeTemplate items={mockItems} />);
  expect(screen.getByText('Item List')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Default')).toBeInTheDocument();
  expect(screen.getAllByDisplayValue('0')).toHaveLength(2);
  expect(screen.getByDisplayValue('99999')).toBeInTheDocument();
  expect(screen.getByText('Cart')).toBeInTheDocument();
  expect(screen.getAllByText(/EGP/)).toHaveLength(3);
});

test('filters items based on search query', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByPlaceholderText('Search items...'), {
    target: {value: 'Laptop'},
  });
  expect(screen.getByText('Laptop')).toBeInTheDocument();
  expect(screen.queryByText('Smartphone')).not.toBeInTheDocument();
  expect(screen.queryByText('Headphones')).not.toBeInTheDocument();
});

test('sorts items by Price: high to low', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByDisplayValue('Default'), {
    target: {value: 'priceHighToLow'},
  });
  const sortedItems = screen.getAllByText(/EGP/);
  expect(sortedItems[0]).toHaveTextContent('60000.00 EGP'); // Laptop
  expect(sortedItems[1]).toHaveTextContent('7000.00 EGP'); // Smartphone
  expect(sortedItems[2]).toHaveTextContent('700.00 EGP'); // Headphones
});

test('sorts items by Price: low to high', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByDisplayValue('Default'), {
    target: {value: 'priceLowToHigh'},
  });
  const sortedItems = screen.getAllByText(/EGP/);
  expect(sortedItems[0]).toHaveTextContent('700.00 EGP'); // Headphones
  expect(sortedItems[1]).toHaveTextContent('7000.00 EGP'); // Smartphone
  expect(sortedItems[2]).toHaveTextContent('60000.00 EGP'); // Laptop
});

test('sorts items by Name: A-Z', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByDisplayValue('Default'), {
    target: {value: 'a-z'},
  });
  const sortedItems = screen.getAllByTestId('productName');
  expect(sortedItems[0]).toHaveTextContent('Headphones');
  expect(sortedItems[1]).toHaveTextContent('Laptop');
  expect(sortedItems[2]).toHaveTextContent('Smartphone');
});

test('sorts items by Name: Z-A', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByDisplayValue('Default'), {
    target: {value: 'z-a'},
  });
  const sortedItems = screen.getAllByTestId('productName');
  expect(sortedItems[0]).toHaveTextContent('Smartphone');
  expect(sortedItems[1]).toHaveTextContent('Laptop');
  expect(sortedItems[2]).toHaveTextContent('Headphones');
});

test('sorts items by default', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getByDisplayValue('Default'), {
    target: {value: ''},
  });
  const sortedItems = screen.getAllByTestId('productName');
  expect(sortedItems[0]).toHaveTextContent('Laptop');
  expect(sortedItems[1]).toHaveTextContent('Smartphone');
  expect(sortedItems[2]).toHaveTextContent('Headphones');
});

test('Filter items by price range slider', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getAllByPlaceholderText('Min Price')[0], {
    target: {value: '700'},
  });
  fireEvent.change(screen.getAllByPlaceholderText('Max Price')[0], {
    target: {value: '700'},
  });
  const sortedItems = screen.getAllByTestId('productName');
  expect(screen.getByText('Headphones')).toBeInTheDocument();
  expect(screen.queryByText('Smartphone')).not.toBeInTheDocument();
  expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
});

test('Filter items by price range inputs', () => {
  render(<HomeTemplate items={mockItems} />);
  fireEvent.change(screen.getAllByPlaceholderText('Min Price')[1], {
    target: {value: '700'},
  });
  fireEvent.change(screen.getAllByPlaceholderText('Max Price')[1], {
    target: {value: '700'},
  });
  const sortedItems = screen.getAllByTestId('productName');
  expect(screen.getByText('Headphones')).toBeInTheDocument();
  expect(screen.queryByText('Smartphone')).not.toBeInTheDocument();
  expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
});

test('adds items to the cart and displays them', () => {
  render(<HomeTemplate items={mockItems} />);
  const addToCartButtons = screen.getAllByText('Add to Cart');
  fireEvent.click(addToCartButtons[0]); // Add Laptop to cart
  fireEvent.click(addToCartButtons[1]); // Add Smartphone to cart

  const cartButton = screen.getByText('Cart');
  fireEvent.click(cartButton);

  const cart = screen.getByTestId('cartContainer');
  const allItemsInsideCart = within(cart).getAllByTestId('productName');
  expect(allItemsInsideCart.length).toBe(2);
  expect(allItemsInsideCart[0]).toHaveTextContent('Laptop');
  expect(allItemsInsideCart[1]).toHaveTextContent('Smartphone');
  expect(within(cart).getByTestId('checkoutButton')).toBeInTheDocument();
});

test('removes items from the cart', () => {
  render(<HomeTemplate items={mockItems} />);
  const addToCartButtons = screen.getAllByText('Add to Cart');
  fireEvent.click(addToCartButtons[0]); // Add first Laptop to cart
  fireEvent.click(addToCartButtons[0]); // Add second Laptop to cart

  const cartButton = screen.getByText('Cart');
  fireEvent.click(cartButton);

  const cart = screen.getByTestId('cartContainer');
  const allItemsInsideCart = within(cart).getAllByTestId('productName');
  expect(allItemsInsideCart.length).toBe(1);
  expect(allItemsInsideCart[0]).toHaveTextContent('Laptop');

  const removeButton = within(cart).getByText('-');
  fireEvent.click(removeButton); // Remove first Laptop from cart
  expect(within(cart).queryAllByTestId('productName').length).toBe(1);

  fireEvent.click(removeButton); // Remove second Laptop from cart
  expect(within(cart).queryAllByTestId('productName').length).toBe(0);

  expect(
    within(cart).getByText('It seems there is no item in the cart'),
  ).toBeInTheDocument();
});
