import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onSelect?: (productId: string) => void;
  isSelected?: boolean;
}

export default function ProductCard({ product, onSelect, isSelected }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);


  return (
    <div 
      className={`group relative bg-white rounded-lg shadow-md overflow-hidden transition-all
        ${isSelected ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.02]'}`}
    >
      <Link href={`/product/${product.id}`} className="block cursor-pointer">
        <div className="aspect-square w-full overflow-hidden relative bg-gray-100">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">{product.brand}</span>
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              fill
              quality={75}
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
          </div>
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      
      {/* View Deal button outside the Link to prevent navigation conflict */}
      <div className="p-4 pt-0">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          View Deal
        </a>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
          Selected
        </div>
      )}
    </div>
  );
} 