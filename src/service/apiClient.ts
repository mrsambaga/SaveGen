import axios from 'axios';
import { SAVEGEN_API } from '@env';
import { tokenStorage } from './tokenStorage';

export const apiClient = axios.create({
  baseURL: SAVEGEN_API,
});

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.request.use(async config => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      await tokenStorage.clearToken();
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    return Promise.reject(error);
  },
);
