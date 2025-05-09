import React, { useState } from 'react';

interface SearchFiltersProps {
  filters: {
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
  };
  onFilterChange: (filters: any) => void;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  onFilterChange,
  onLocationSelect 
}) => {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value;
    onFilterChange({
      ...filters,
      location
    });

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for geocoding
    const timeout = setTimeout(async () => {
      if (location && onLocationSelect) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
          );
          const data = await response.json();
          if (data && data[0]) {
            onLocationSelect([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
          }
        } catch (error) {
          console.error('Error geocoding location:', error);
        }
      }
    }, 1000); // Delay of 1 second

    setSearchTimeout(timeout);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value ? Number(value) : undefined
    });
  };

  return (
    <div className="flex justify-center items-center w-full max-w-4xl mx-auto px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Search Filters</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location || ''}
              onChange={handleLocationChange}
              placeholder="Enter city or zip code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin || ''}
                onChange={handleChange}
                step="100000"
                min="0"
                placeholder="Min price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax || ''}
                onChange={handleChange}
                step="100000"
                min="0"
                placeholder="Max price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+ beds</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                name="bathrooms"
                value={filters.bathrooms || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+ baths</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;