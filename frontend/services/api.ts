import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// ⚠️ Change this to your computer's local IP if testing on physical device
// For Android emulator: http://10.0.2.2:8080
// For iOS simulator / Web: http://localhost:8080
// For physical device: http://<YOUR_IP>:8080
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  ios: 'http://localhost:8080/api',
  default: 'http://localhost:8080/api', // web
})!;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTH ============
export const authAPI = {
  register: (data: { username: string; password: string; firstname?: string; lastname?: string; email?: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
};

// ============ USERS ============
export const userAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`/users?page=${page}&size=${size}`),
  getById: (id: number) =>
    api.get(`/users/${id}`),
  update: (id: number, data: any) =>
    api.patch(`/users/${id}`, data),
  delete: (id: number) =>
    api.delete(`/users/${id}`),
  getItems: (id: number, page = 0, size = 20) =>
    api.get(`/users/${id}/items?page=${page}&size=${size}`),
};

// ============ ITEMS ============
export const itemAPI = {
  getAll: (page = 0, size = 20, sortBy = 'createdAt', direction = 'desc') =>
    api.get(`/items?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),
  getById: (id: string) =>
    api.get(`/items/${id}`),
  create: (data: any) =>
    api.post('/items', data),
  update: (id: string, data: any) =>
    api.patch(`/items/${id}`, data),
  delete: (id: string) =>
    api.delete(`/items/${id}`),
  search: (keyword: string, page = 0, size = 20) =>
    api.get(`/items/search?keyword=${keyword}&page=${page}&size=${size}`),
  byCategory: (categoryId: number, page = 0, size = 20) =>
    api.get(`/items/category/${categoryId}?page=${page}&size=${size}`),
  byType: (type: string, page = 0, size = 20) =>
    api.get(`/items/type/${type}?page=${page}&size=${size}`),
  filter: (params: any) =>
    api.get('/items/filter', { params }),
  nearby: (lat: number, lng: number, radius = 5, page = 0, size = 20) =>
    api.get(`/items/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&size=${size}`),
};

// ============ ORDERS ============
export const orderAPI = {
  create: (data: any) =>
    api.post('/orders', data),
  getAll: (page = 0, size = 20) =>
    api.get(`/orders?page=${page}&size=${size}`),
  getById: (id: string) =>
    api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  delete: (id: string) =>
    api.delete(`/orders/${id}`),
  buyerHistory: (buyerId: number, status?: string, page = 0, size = 20) =>
    api.get(`/orders/buyer/${buyerId}?page=${page}&size=${size}${status ? '&status=' + status : ''}`),
  sellerHistory: (sellerId: number, status?: string, page = 0, size = 20) =>
    api.get(`/orders/seller/${sellerId}?page=${page}&size=${size}${status ? '&status=' + status : ''}`),
};

// ============ CATEGORIES ============
export const categoryAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`/categories?page=${page}&size=${size}`),
  getById: (id: number) =>
    api.get(`/categories/${id}`),
  create: (data: { name: string; type: string }) =>
    api.post('/categories', data),
  delete: (id: number) =>
    api.delete(`/categories/${id}`),
};

// ============ CHAT ============
export const chatAPI = {
  getOrCreateRoom: (buyerId: number, sellerId: number, itemId: string) =>
    api.post(`/chat/rooms?buyerId=${buyerId}&sellerId=${sellerId}&itemId=${itemId}`),
  getUserRooms: (userId: number, page = 0, size = 20) =>
    api.get(`/chat/rooms/user/${userId}?page=${page}&size=${size}`),
  getRoom: (roomId: string) =>
    api.get(`/chat/rooms/${roomId}`),
  getMessages: (roomId: string, page = 0, size = 50) =>
    api.get(`/chat/rooms/${roomId}/messages?page=${page}&size=${size}`),
  sendMessage: (data: { chatRoomId: string; senderId: number; content: string }) =>
    api.post('/chat/messages', data),
  markAsRead: (roomId: string, userId: number) =>
    api.patch(`/chat/rooms/${roomId}/read?userId=${userId}`),
};

export default api;
