import { AxiosError } from 'axios';
import { Transaction } from '../constants/types';
import {
  CreateTransactionRequestDTO,
  CreateTransactionResponseDTO,
  GetTransactionDTO,
} from '../constants/dto';
import { path } from '../constants/path';
import { apiClient } from './apiClient';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<GetTransactionDTO>(path.GET_TRANSACTIONS);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    throw error;
  }
};

export const createTransaction = async (
  requestDTO: CreateTransactionRequestDTO,
): Promise<Transaction> => {
  try {
    const response = await apiClient.post<CreateTransactionResponseDTO>(
      path.CREATE_TRANSACTION,
      requestDTO,
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    throw error;
  }
};

export const deleteTransaction = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`${path.DELETE_TRANSACTION}/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
    throw error;
  }
};
