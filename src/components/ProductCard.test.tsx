import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 999,
  category: 'Test Category',
  image: '/test-image.jpg',
  affiliateUrl: 'https://example.com',
  brand: 'Test Brand',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('View Deal')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<ProductCard product={mockProduct} onSelect={mockOnSelect} />);

    const card = screen.getByText(mockProduct.name).closest('div');
    fireEvent.click(card!);

    expect(mockOnSelect).toHaveBeenCalledWith(mockProduct.id);
  });

  it('shows selected state when isSelected is true', () => {
    render(<ProductCard product={mockProduct} isSelected={true} />);
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('opens affiliate link in new tab', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByText('View Deal');
    
    expect(link).toHaveAttribute('href', mockProduct.affiliateUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 