'use client';

import { useEffect, useState } from 'react';
import { Product, ProductFilters } from '@/types';
import {
  getProducts,
  filterProducts,
  paginateProducts,
  getMaxPrice,
  getMinPrice,
  ITEMS_PER_PAGE,
} from '@/utils/products';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import Pagination from '@/components/Pagination';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    priceRange: { min: 0, max: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const data = getProducts();
    setProducts(data.products);
    setCategories(data.categories);
    
    const maxPrice = getMaxPrice(data.products);
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, max: maxPrice },
    }));
  }, []);

  useEffect(() => {
    const filtered = filterProducts(products, filters);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = paginateProducts(filteredProducts, currentPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">BabyHub</h1>
          <p className="mt-2 text-gray-600">Find the best baby products at great prices</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Filters
                categories={categories}
                filters={filters}
                onFilterChange={setFilters}
                minPrice={getMinPrice(products)}
                maxPrice={getMaxPrice(products)}
              />
              
              {/* FAQ Section */}
              <div className="mt-8">
                <FAQSection />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
