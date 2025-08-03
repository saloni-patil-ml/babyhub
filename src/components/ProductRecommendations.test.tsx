import { render, screen, waitFor } from '@testing-library/react';
import ProductRecommendations from './ProductRecommendations';
import { getRecommendations } from '@/utils/api';

// Mock the API module
jest.mock('@/utils/api', () => ({
  getRecommendations: jest.fn(),
}));

const mockRecommendations = [
  {
    id: '2',
    name: 'Recommended Product 1',
    description: 'Test Description 1',
    price: 1999,
    category: 'Test Category',
    image: '/test-image-1.jpg',
    affiliateUrl: 'https://example.com/1',
    brand: 'Test Brand',
  },
  {
    id: '3',
    name: 'Recommended Product 2',
    description: 'Test Description 2',
    price: 2999,
    category: 'Test Category',
    image: '/test-image-2.jpg',
    affiliateUrl: 'https://example.com/2',
    brand: 'Test Brand',
  },
];

describe('ProductRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<ProductRecommendations productId="1" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays recommendations when loaded successfully', async () => {
    (getRecommendations as jest.Mock).mockResolvedValueOnce(mockRecommendations);

    render(<ProductRecommendations productId="1" />);

    await waitFor(() => {
      expect(screen.getByText('You may also like')).toBeInTheDocument();
    });

    mockRecommendations.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('shows error message when loading fails', async () => {
    (getRecommendations as jest.Mock).mockRejectedValueOnce(new Error('Failed to load'));

    render(<ProductRecommendations productId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load recommendations/i)).toBeInTheDocument();
    });
  });

  it('shows nothing when no recommendations are available', async () => {
    (getRecommendations as jest.Mock).mockResolvedValueOnce([]);

    render(<ProductRecommendations productId="1" />);

    await waitFor(() => {
      expect(screen.queryByText('You may also like')).not.toBeInTheDocument();
    });
  });

  it('calls getRecommendations with correct product ID', () => {
    render(<ProductRecommendations productId="1" />);
    expect(getRecommendations).toHaveBeenCalledWith('1');
  });
}); 