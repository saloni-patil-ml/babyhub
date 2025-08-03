import { render, screen } from '@testing-library/react';
import ProductPage from './page';
import { getProducts } from '@/utils/products';
import { notFound } from 'next/navigation';

// Mock the products utility
jest.mock('@/utils/products', () => ({
  getProducts: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock the ProductRecommendations component
jest.mock('@/components/ProductRecommendations', () => {
  return function MockProductRecommendations({ productId }: { productId: string }) {
    return <div data-testid="product-recommendations">Recommendations for {productId}</div>;
  };
});

describe('ProductPage', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    (getProducts as jest.Mock).mockReturnValue({
      products: [mockProduct],
      categories: ['Test Category'],
    });
  });

  it('renders product details correctly', async () => {
    render(await ProductPage({ params: { id: '1' } }));

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('View Deal')).toBeInTheDocument();
  });

  it('calls notFound when product is not found', async () => {
    await ProductPage({ params: { id: '999' } });
    expect(notFound).toHaveBeenCalled();
  });

  it('includes product recommendations section', async () => {
    render(await ProductPage({ params: { id: '1' } }));
    expect(screen.getByTestId('product-recommendations')).toBeInTheDocument();
  });

  it('has correct link to home page', async () => {
    render(await ProductPage({ params: { id: '1' } }));
    const homeLink = screen.getByText('← Back to Products');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has correct affiliate link', async () => {
    render(await ProductPage({ params: { id: '1' } }));
    const affiliateLink = screen.getByText('View Deal');
    expect(affiliateLink).toHaveAttribute('href', mockProduct.affiliateUrl);
    expect(affiliateLink).toHaveAttribute('target', '_blank');
    expect(affiliateLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 