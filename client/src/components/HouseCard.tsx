import React from 'react';
import { Link } from 'react-router-dom';
import { House } from '../types';

interface HouseCardProps {
  house: House;
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  return (
    <Link to={`/houses/${house._id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-56">
          <img
            src={house.images[0]}
            alt={house.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            ${house.price}/night
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {house.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2">
            {house.location.city}, {house.location.state}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-3">{house.bedrooms} beds</span>
            <span className="mr-3">•</span>
            <span>{house.bathrooms} baths</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HouseCard;