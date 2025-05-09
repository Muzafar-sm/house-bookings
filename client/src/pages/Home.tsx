import React, { useState, useEffect } from 'react';
import MapComponent from '../components/Map';
import SearchFilters from '../components/SearchFilters';
import HouseCard from '../components/HouseCard';
import { houses } from '../services/api';
import { House } from '../types';

const Home: React.FC = () => {
  const [housesList, setHousesList] = useState<House[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-74.0060, 40.7128]);
  const [filters, setFilters] = useState({
    priceMin: undefined,
    priceMax: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    location: undefined
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await houses.getAll(filters);
      setHousesList(response.data.data);
    } catch (err) {
      setError('Failed to fetch houses');
      console.error('Error fetching houses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [filters]);

  const handleLocationSelect = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onLocationSelect={handleLocationSelect}
        />
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading houses...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: House cards */}
          <div className="lg:col-span-1 space-y-6 h-[calc(100vh-200px)] overflow-y-auto">
            {housesList.length === 0 ? (
              <p className="text-center text-gray-600">No houses found matching your criteria</p>
            ) : (
              housesList.map((house) => (
                <HouseCard key={house._id} house={house} />
              ))
            )}
          </div>
          
          {/* Right side: Map */}
          <div className="lg:col-span-2">
            <MapComponent 
              houses={housesList}
              center={mapCenter}
              zoom={12}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;