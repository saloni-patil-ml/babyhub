import { ProductFilters } from '@/types';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface FiltersProps {
  categories: string[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  minPrice: number;
  maxPrice: number;
}

export default function Filters({
  categories,
  filters,
  onFilterChange,
  minPrice,
  maxPrice,
}: FiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue,
      },
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
        <Listbox value={filters.category} onChange={handleCategoryChange}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border text-gray-900 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
              <span className="block truncate">{filters.category || 'All Categories'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value=""
                >
                  All Categories
                </Listbox.Option>
                {categories.map((category) => (
                  <Listbox.Option
                    key={category}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={category}
                  >
                    {category}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={filters.priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="Min"
              className="w-full rounded-md border-gray-300 shadow-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={filters.priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="Max"
              className="w-full rounded-md border-gray-300 shadow-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 