import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@types/index';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T,>(url: string, config?: any) => axiosInstance.get<ApiResponse<T>>(url, config),
  post: <T,>(url: string, data?: any, config?: any) =>
    axiosInstance.post<ApiResponse<T>>(url, data, config),
  put: <T,>(url: string, data?: any, config?: any) =>
    axiosInstance.put<ApiResponse<T>>(url, data, config),
  delete: <T,>(url: string, config?: any) => axiosInstance.delete<ApiResponse<T>>(url, config),
};

export default apiClient;
