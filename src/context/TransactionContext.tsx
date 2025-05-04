import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../constants/types';
import { fetchTransactions } from '../service/transactionService';

type TransactionContextType = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  refreshTransactions: () => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshTransactions = async () => {
    const fetched = await fetchTransactions(1);
    setTransactions(fetched);
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within a TransactionProvider');
  return context;
};