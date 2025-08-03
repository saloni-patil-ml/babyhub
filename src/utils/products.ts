import productsData from '@/data/products.json';
import { Product, ProductFilters, ProductsData } from '@/types';

export const ITEMS_PER_PAGE = 20;

export function getProducts(): ProductsData {
  return productsData;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    const categoryMatch = !filters.category || product.category === filters.category;
    const priceMatch =
      (!filters.priceRange.min || product.price >= filters.priceRange.min) &&
      (!filters.priceRange.max || product.price <= filters.priceRange.max);
    return categoryMatch && priceMatch;
  });
}

export function paginateProducts(products: Product[], page: number): Product[] {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return products.slice(start, end);
}

export function getMaxPrice(products: Product[]): number {
  return Math.max(...products.map((product) => product.price));
}

export function getMinPrice(products: Product[]): number {
  return Math.min(...products.map((product) => product.price));
} 