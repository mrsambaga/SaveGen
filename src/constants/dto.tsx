import { Transaction } from "./types";

export type GetTransactionDTO = {
  code: string;
  message: string;
  data: Transaction[];
};

export type CreateTransactionResponseDTO = {
  code: string;
  message: string;
  data: Transaction;
};

export type CreateTransactionRequestDTO = {
  user_id: number;
  amount: number;
  date: string;
  detail: string;
  transaction_type: string;
  transaction_category: string;
};

