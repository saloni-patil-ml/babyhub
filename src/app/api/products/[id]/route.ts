import { NextResponse } from 'next/server';
import { getProducts } from '@/utils/products';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params to get the id
  const { id } = await params;

  try {
    const { products } = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse(null, { status: 500 });
  }
}