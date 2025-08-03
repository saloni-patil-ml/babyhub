import { GET } from './route';
import { getProducts } from '@/utils/products';

// Mock the products utility
jest.mock('@/utils/products', () => ({
  getProducts: jest.fn(),
}));

describe('Products API', () => {
  const mockProducts = {
    products: [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 999,
        category: 'Test Category',
        image: '/test-image.jpg',
        affiliateUrl: 'https://example.com',
        brand: 'Test Brand',
      },
    ],
    categories: ['Test Category'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getProducts as jest.Mock).mockReturnValue(mockProducts);
  });

  it('returns product when found', async () => {
    const request = new Request('http://localhost:3000/api/products/1');
    const response = await GET(request, { params: { id: '1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockProducts.products[0]);
  });

  it('returns 404 when product not found', async () => {
    const request = new Request('http://localhost:3000/api/products/999');
    const response = await GET(request, { params: { id: '999' } });

    expect(response.status).toBe(404);
  });

  it('returns 500 when error occurs', async () => {
    (getProducts as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const request = new Request('http://localhost:3000/api/products/1');
    const response = await GET(request, { params: { id: '1' } });

    expect(response.status).toBe(500);
  });
}); 