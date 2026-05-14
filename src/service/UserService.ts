import { AxiosError } from 'axios';
import { User } from '../constants/types';
import { path } from '../constants/path';
import { apiClient } from './apiClient';

export const fetchUser = async (email: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(
      path.GET_USER.replace('{email}', email),
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw error;
  }
};

export const updateUser = async (
  email: string,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const response = await apiClient.put<User>(
      path.UPDATE_USER.replace('{email}', email),
      userData,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw error;
  }
};
