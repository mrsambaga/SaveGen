import {StackNavigationProp} from '@react-navigation/stack';
import {CashFlowStackParamList, RootStackParamList} from './navigation';
import {RouteProp} from '@react-navigation/native';
import {Transaction} from './types';

export type CashflowProps = {
  navigation: StackNavigationProp<CashFlowStackParamList, 'Transactions'>;
};

export type SpendingChartProps = {
  navigation: StackNavigationProp<CashFlowStackParamList, 'Transactions'>;
  transactions: Transaction[];
};

type OverviewRouteParams = {
  transactions: Transaction[];
};

export type OverviewProps = {
  route: RouteProp<{Overview: OverviewRouteParams}, 'Overview'>;
};

export type HomeProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export type RegisterProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export type LandingProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Landing'>;
};

export type CategoryIconsProps = {
  iconName: string;
  size?: number;
  color?: string;
};
