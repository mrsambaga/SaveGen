import { Transaction } from './types';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  MainTabs: undefined;
  Home: undefined;
  NewTransaction: undefined;
  CashFlow: { shouldRefresh?: boolean } | undefined;
  Account: undefined;
  Terms: undefined;
};

export type CashFlowStackParamList = {
  Transactions: { shouldRefresh?: boolean } | undefined;
  Overview: {
    transactions: Transaction[];
  };
};
