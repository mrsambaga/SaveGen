import { Transaction } from "./types";

export type GetTransactionDto = {
  code: string;
  message: string;
  data: Transaction[];
};

export type CreateTransactionResponseDto = {
  code: string;
  message: string;
  data: Transaction;
};

