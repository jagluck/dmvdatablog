import { render, screen } from '@testing-library/react';
import App from './javascript/app';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/our title/i);
  // expect(linkElement).toBeInTheDocument();
});
