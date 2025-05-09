export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface House {
  _id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  owner: string;
  isAvailable: boolean;
  location: {
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
  };
  createdAt: string;
}

export interface Booking {
  _id: string;
  house: string | House;
  user: string | User;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  pagination?: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
}