import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { houses, bookings } from '../services/api';
import { House } from '../types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const HouseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const loadHouse = async () => {
      try {
        if (!id) return;
        const response = await houses.getById(id);
        setHouse(response.data.data);
      } catch (err) {
        setError('Failed to load house details');
      } finally {
        setLoading(false);
      }
    };

    loadHouse();
  }, [id]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDates((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (house && bookingDates.checkIn && bookingDates.checkOut) {
      const checkIn = new Date(bookingDates.checkIn);
      const checkOut = new Date(bookingDates.checkOut);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(days * house.price);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (!house || !id) return;
      await bookings.create(id, {
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
      });
      navigate('/profile');
    } catch (err) {
      setError('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'House not found'}</p>
        </div>
      </div>
    );
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: house.location.coordinates[1],
    lng: house.location.coordinates[0],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-full object-cover"
            />
            {!house.isAvailable && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md">
                Not Available
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{house.title}</h1>
            <p className="text-gray-600 mb-6">{house.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Price per night:</span>
                    <span className="font-semibold">${house.price}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Bedrooms:</span>
                    <span className="font-semibold">{house.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Bathrooms:</span>
                    <span className="font-semibold">{house.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Location:</span>
                    <span className="font-semibold">
                      {house.location.address}, {house.location.city}, {house.location.state}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {house.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Book this house</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                      Check-in date
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={bookingDates.checkIn}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                      Check-out date
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={bookingDates.checkOut}
                      onChange={handleDateChange}
                      min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  {totalPrice > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-lg font-semibold">
                        Total: ${totalPrice} for{' '}
                        {Math.ceil(
                          (new Date(bookingDates.checkOut).getTime() -
                            new Date(bookingDates.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        nights
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleBooking}
                    disabled={!house.isAvailable || !bookingDates.checkIn || !bookingDates.checkOut}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetail; 