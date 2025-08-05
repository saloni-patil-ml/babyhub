import { getProducts } from '@/utils/products';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';
import ProductRecommendations from '@/components/ProductRecommendations';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { products } = getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
        </nav>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                priority
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="mb-6">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Deal
              </a>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="bg-white rounded-lg shadow-lg mt-8">
          <ProductRecommendations productId={id} />
        </div>
      </main>
    </div>
  );
}

// Generate static params for all products
export async function generateStaticParams() {
  const { products } = getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}