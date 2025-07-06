import axios, { AxiosError } from "axios";
import { User } from "../constants/types";
import { path } from "../constants/path";

export const fetchUser = async (email: string): Promise<User> => {
    try {
      const response = await axios.get<User>(path.GET_USER.replace('{email}', email), {
      });
  
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
      throw error;
    }
  };

export const updateUser = async (email: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await axios.put<User>(path.UPDATE_USER.replace('{email}', email), userData, {
      });
  
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
      throw error;
    }
  };