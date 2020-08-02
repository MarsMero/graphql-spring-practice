import React from 'react';
import { render } from '@testing-library/react';
import Pages from './pages/main';

test('renders hello pages', () => {
  const { getByText } = render(<Pages />);
  const linkElement = getByText(/Hello Pages/i);
  expect(linkElement).toBeInTheDocument();
});