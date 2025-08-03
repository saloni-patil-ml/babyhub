import { NextResponse } from 'next/server';
import { getProducts } from '@/utils/products';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { products } = getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse(null, { status: 500 });
  }
} 