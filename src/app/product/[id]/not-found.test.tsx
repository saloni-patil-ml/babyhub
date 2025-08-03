import { render, screen } from '@testing-library/react';
import ProductNotFound from './not-found';

describe('ProductNotFound', () => {
  it('renders not found message', () => {
    render(<ProductNotFound />);
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    expect(
      screen.getByText("Sorry, we couldn't find the product you're looking for.")
    ).toBeInTheDocument();
  });

  it('has link to home page', () => {
    render(<ProductNotFound />);
    const homeLink = screen.getByText('Return to Home');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has correct styling classes', () => {
    render(<ProductNotFound />);
    expect(screen.getByRole('heading')).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
    expect(screen.getByText('Return to Home')).toHaveClass(
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700'
    );
  });
}); 