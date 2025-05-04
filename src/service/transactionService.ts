import axios, { AxiosError } from 'axios';
import { Transaction } from '../constants/types';
import { TransactionDto } from '../constants/dto';
import { path } from '../constants/path';

export const fetchTransactions = async (userId: number = 1): Promise<Transaction[]> => {
  try {
    const response = await axios.get<TransactionDto>(path.GET_TRANSACTIONS, {
      params: {
        user_id: userId
      }
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    throw error;
  }
}; 