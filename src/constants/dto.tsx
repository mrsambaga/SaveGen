import { Transaction } from "./types";

export type TransactionDto = {
  code: string;
  message: string;
  data: Transaction[];
};

