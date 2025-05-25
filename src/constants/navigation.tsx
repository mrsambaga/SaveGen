import { Transaction } from './types';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  Login: undefined;
  NewTransaction: undefined;
  CashFlow: { shouldRefresh?: boolean } | undefined;
};

export type CashFlowStackParamList = {
  Transactions: { shouldRefresh?: boolean } | undefined;
  Overview: {
    transactions: Transaction[];
  };
};
