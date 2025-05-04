import {createStackNavigator} from '@react-navigation/stack';

import CashflowScreen from '../screen/CashflowScreen/CashflowScreen';
import OverviewSection from '../screen/CashflowScreen/OverviewSection';
import {CashFlowStackParamList} from '../constants/navigation';

const Stack = createStackNavigator<CashFlowStackParamList>();

const CashFlowNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Transactions">
      <Stack.Screen
        name="Transactions"
        component={CashflowScreen}
        options={{title: 'Transactions', headerShown: false}}
      />
      <Stack.Screen
        name="Overview"
        component={OverviewSection}
        options={{
          title: 'Overview',
          headerStyle: {
            backgroundColor: '#201c5c',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 22,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default CashFlowNavigation;
