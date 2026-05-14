import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import TabNavigation from './TabNavigation';

import LandingScreen from '../screen/LandingScreen/LandingScreen';
import RegisterScreen from '../screen/RegisterScreen/RegisterScreen';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import AccountSection from '../screen/ProfileScreen/AccountSection';
import TermsScreen from '../screen/ProfileScreen/TermsScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const StackNavigation = () => {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#201c5c" />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ title: 'Landing', headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register', headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="MainTabs">
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
          headerStyle: { backgroundColor: '#201c5c' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Montserrat-Bold' },
        }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: 'Terms & Policies',
          headerShown: true,
          headerStyle: { backgroundColor: '#201c5c' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontFamily: 'Montserrat-Bold' },
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});

export default StackNavigation;
