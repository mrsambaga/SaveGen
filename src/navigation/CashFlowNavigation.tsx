import {createStackNavigator} from '@react-navigation/stack';

import CashflowScreen from '../screen/CashflowScreen/CashflowScreen';
import OverviewSection from '../screen/CashflowScreen/OverviewSection';

type RootStackParamList = {
  CashFlow: undefined;
  Overview: {
    transactions: Transaction[];
  };
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
};

const Stack = createStackNavigator<RootStackParamList>();

const CashFlowNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CashFlow">
      <Stack.Screen
        name="CashFlow"
        component={CashflowScreen}
        options={{title: 'Cashflow', headerShown: false}}
      />
      <Stack.Screen
        name="Overview"
        component={OverviewSection}
        options={{title: 'Overview'}}
      />
    </Stack.Navigator>
  );
};

export default CashFlowNavigation;
