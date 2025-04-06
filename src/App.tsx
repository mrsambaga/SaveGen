import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import LandingScreen from './screen/LandingScreen/LandingScreen';
import RegisterScreen from './screen/RegisterScreen/RegisterScreen';
import HomeScreen from './screen/HomeScreen/HomeScreen';
import CashflowScreen from './screen/CashflowScreen/CashflowScreen';
import ProfileScreen from './screen/ProfileScreen/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
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
            component={TabNavigator}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const getIconColor = (focused: boolean) => {
  return focused ? '#201c5c' : '#8E8E93';
};

const getLabelColor = (focused: boolean) => {
  return focused ? '#201c5c' : '#8E8E93';
};

const renderTabIcon = (focused: boolean, name: IconProp) => {
  return (
    <FontAwesomeIcon icon={name} size={20} color={getIconColor(focused)} />
  );
};

const renderTabLabel = (focused: boolean, label: string) => {
  return <Text style={{color: getLabelColor(focused)}}>{label}</Text>;
};

const tabScreenOptions = {
  homeScreen: {
    tabBarLabel: ({focused}: {focused: boolean}) =>
      renderTabLabel(focused, 'Home'),
    tabBarIcon: ({focused}: {focused: boolean}) =>
      renderTabIcon(focused, faHouse),
    tabBarAccessibilityLabel: 'Home Tab Button',
  },
  cashFlowScreen: {
    tabBarLabel: ({focused}: {focused: boolean}) =>
      renderTabLabel(focused, 'Cash Flow'),
    tabBarIcon: ({focused}: {focused: boolean}) =>
      renderTabIcon(focused, faMoneyBillTransfer),
    tabBarAccessibilityLabel: 'Cash Flow Tab Button',
  },
  profileScreen: {
    tabBarLabel: ({focused}: {focused: boolean}) =>
      renderTabLabel(focused, 'Profile'),
    tabBarIcon: ({focused}: {focused: boolean}) =>
      renderTabIcon(focused, faUser),
    tabBarAccessibilityLabel: 'Profile Tab Button',
  },
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={tabScreenOptions.homeScreen}
      />
      <Tab.Screen
        name="CashFlow"
        component={CashflowScreen}
        options={tabScreenOptions.cashFlowScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabScreenOptions.profileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
