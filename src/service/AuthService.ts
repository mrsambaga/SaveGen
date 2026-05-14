import axios, { AxiosError } from 'axios';
import { apiClient } from './apiClient';
import { path } from '../constants/path';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  is_guest: boolean;
  monthly_budget?: number | null;
  created_at: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const extractMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    return error.message || fallback;
  }
  return fallback;
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(path.REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Failed to register'));
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(path.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Failed to log in'));
  }
};

export const loginAsGuest = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(path.GUEST, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Failed to start guest session'));
  }
};

export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(path.GOOGLE_LOGIN, {
      id_token: idToken,
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Failed to sign in with Google'));
  }
};

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  try {
    const response = await apiClient.get<AuthUser>(path.ME);
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Failed to load current user'));
  }
};
