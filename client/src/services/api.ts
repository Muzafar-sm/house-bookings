import axios from 'axios';
import { ApiResponse, AuthResponse, House, Booking, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
  
  updateDetails: (data: { name?: string; email?: string }) =>
    api.put<ApiResponse<User>>('/auth/updatedetails', data),
  
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<AuthResponse>('/auth/updatepassword', data)
};

// Houses API
export const houses = {
  getAll: (params?: any) =>
    api.get<ApiResponse<House[]>>('/houses', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<House>>(`/houses/${id}`),
  
  create: (data: Partial<House>) =>
    api.post<ApiResponse<House>>('/houses', data),
  
  update: (id: string, data: Partial<House>) =>
    api.put<ApiResponse<House>>(`/houses/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<{}>>(`/houses/${id}`),
  
  getInRadius: (zipcode: string, distance: number) =>
    api.get<ApiResponse<House[]>>(`/houses/radius/${zipcode}/${distance}`),
  
  uploadPhoto: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.put<ApiResponse<string>>(`/houses/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Bookings API
export const bookings = {
  getAll: (params?: any) =>
    api.get<ApiResponse<Booking[]>>('/bookings', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  
  create: (houseId: string, data: { checkIn: string; checkOut: string }) =>
    api.post<ApiResponse<Booking>>(`/houses/${houseId}/bookings`, data),
  
  update: (id: string, data: Partial<Booking>) =>
    api.put<ApiResponse<Booking>>(`/bookings/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<{}>>(`/bookings/${id}`)
};

export default api; 