import {Transaction} from './types';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  Login: undefined;
};

export type CashFlowStackParamList = {
  Transactions: undefined;
  Overview: {
    transactions: Transaction[];
  };
};
