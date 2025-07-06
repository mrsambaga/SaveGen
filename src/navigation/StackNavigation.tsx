import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';

import LandingScreen from '../screen/LandingScreen/LandingScreen';
import RegisterScreen from '../screen/RegisterScreen/RegisterScreen';
import AccountSection from '../screen/ProfileScreen/AccountSection';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ title: 'Landing', headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Register', headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountSection}
        options={{
          title: 'Account',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#201c5c',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
