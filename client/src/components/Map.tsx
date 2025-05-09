import React, { useCallback, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { House } from '../types';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const containerStyle = {
  width: '100%',
  height: '500px'
};

interface MapProps {
  houses: House[];
  onMarkerClick?: (house: House) => void;
  center?: [number, number];
  zoom?: number;
}

// Add this new component for handling map view updates
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({
  houses,
  onMarkerClick,
  center = [-74.0060, 40.7128],
  zoom = 12
}) => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const handleMarkerClick = useCallback((house: House) => {
    setSelectedHouse(house);
    if (onMarkerClick) {
      onMarkerClick(house);
    }
  }, [onMarkerClick]);

  return (
    <MapContainer
      center={[center[1], center[0]]}
      zoom={zoom}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      <MapUpdater center={[center[1], center[0]]} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {houses.map((house) => (
        <Marker
          key={house._id}
          position={[house.location.coordinates[1], house.location.coordinates[0]]}
          eventHandlers={{
            click: () => handleMarkerClick(house),
          }}
        >
          <Popup>
            <div className="p-2 max-w-xs">
              <img 
                src={house.images[0]} 
                alt={house.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-lg">{house.title}</h3>
              <p className="text-gray-600">${house.price}/night</p>
              <p className="text-sm text-gray-500">
                {house.bedrooms} beds • {house.bathrooms} baths
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;