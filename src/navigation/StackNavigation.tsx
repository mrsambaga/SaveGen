import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './TabNavigation';

import LandingScreen from '../screen/LandingScreen/LandingScreen';
import RegisterScreen from '../screen/RegisterScreen/RegisterScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{title: 'Landing', headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{title: 'Register', headerShown: false}}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
