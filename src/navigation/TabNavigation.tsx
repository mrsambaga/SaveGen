import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  faHouse,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import HomeScreen from '../screen/HomeScreen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen/ProfileScreen';
import CashFlowNavigation from './CashFlowNavigation';

const Tab = createBottomTabNavigator();

const getColor = (focused: boolean) => {
  return focused ? '#201c5c' : '#8E8E93';
};

const renderTabIcon = (focused: boolean, name: IconProp) => {
  return <FontAwesomeIcon icon={name} size={20} color={getColor(focused)} />;
};

const renderTabLabel = (focused: boolean, label: string) => {
  return <Text style={{color: getColor(focused)}}>{label}</Text>;
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

const TabNavigation = () => {
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
        component={CashFlowNavigation}
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

export default TabNavigation;
