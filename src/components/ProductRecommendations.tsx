'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { getRecommendations } from '@/utils/api';
import ProductCard from './ProductCard';

interface ProductRecommendationsProps {
  productId: string;
}

export default function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log('ProductRecommendations mounted with productId:', productId);

    async function fetchRecommendations() {
      if (!productId) {
        console.log('No product ID provided');
        return;
      }

      try {
        console.log('Fetching recommendations for product:', productId);
        setLoading(true);
        setError(null);
        
        const response = await getRecommendations(productId);
        console.log('Raw API response:', response);
        
        if (!response || !response.recommendations) {
          console.warn('Invalid response format:', response);
          if (mounted) {
            setError('Invalid response format');
            setRecommendations([]);
          }
          return;
        }
        
        const recommendedProducts = response.recommendations;
        console.log('Processed recommendations:', recommendedProducts);
        
        if (!Array.isArray(recommendedProducts)) {
          console.warn('Recommendations is not an array:', recommendedProducts);
          if (mounted) {
            setError('Invalid recommendations format');
            setRecommendations([]);
          }
          return;
        }

        if (mounted) {
          console.log('Setting recommendations:', recommendedProducts);
          setRecommendations(recommendedProducts);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        if (mounted) {
          setError('Failed to load recommendations');
          setRecommendations([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();

    return () => {
      mounted = false;
    };
  }, [productId]);

  // Debug render state
  console.log('Current render state:', {
    loading,
    error,
    recommendationsCount: recommendations.length,
    recommendations
  });

  // Always render a container to ensure the component is visible
  return (
    <section className="w-full py-8 border-t border-gray-200 mt-8" style={{ minHeight: '200px' }}>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => {
              console.log('Rendering product card:', product);
              return (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          No recommendations available
        </div>
      )}
    </section>
  );
} 