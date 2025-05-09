import React, { useState, useEffect } from 'react';
import { houses, bookings } from '../services/api';
import { House, Booking } from '../types';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'houses' | 'bookings'>('houses');
  const [housesList, setHousesList] = useState<House[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'houses') {
          const response = await houses.getAll();
          setHousesList(response.data.data);
        } else {
          const response = await bookings.getAll();
          setBookingsList(response.data.data);
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const handleHouseStatusChange = async (houseId: string, isAvailable: boolean) => {
    try {
      await houses.update(houseId, { isAvailable });
      setHousesList((prev) =>
        prev.map((house) =>
          house._id === houseId ? { ...house, isAvailable } : house
        )
      );
    } catch (err) {
      setError('Failed to update house status');
    }
  };

  const handleBookingStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      await bookings.update(bookingId, { status });
      setBookingsList((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('houses')}
                    className={`${
                      activeTab === 'houses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Houses
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`${
                      activeTab === 'bookings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Bookings
                  </button>
                </nav>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {activeTab === 'houses' ? (
              <div className="space-y-4">
                {housesList.map((house) => (
                  <div
                    key={house._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{house.title}</h3>
                        <p className="text-gray-600 mb-2">{house.description}</p>
                        <div className="space-y-1">
                          <p className="text-gray-600">
                            Price: ${house.price} per night
                          </p>
                          <p className="text-gray-600">
                            Location: {house.location.address}, {house.location.city},{' '}
                            {house.location.state}
                          </p>
                          <p className="text-gray-600">
                            Bedrooms: {house.bedrooms} | Bathrooms: {house.bathrooms}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            house.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {house.isAvailable ? 'Available' : 'Not Available'}
                        </span>
                        <button
                          onClick={() => handleHouseStatusChange(house._id, !house.isAvailable)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {house.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {bookingsList.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {typeof booking.house === 'string' ? 'House' : booking.house.title}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-gray-600">
                            Check-in: {formatDate(booking.checkIn)}
                          </p>
                          <p className="text-gray-600">
                            Check-out: {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-gray-600">Total: ${booking.totalPrice}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <select
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking._id, e.target.value as BookingStatus)}
                          className="border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 