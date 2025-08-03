export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  affiliateUrl: string;
  brand: string;
}

export interface ProductFilters {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface ProductsData {
  products: Product[];
  categories: string[];
} 