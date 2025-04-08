import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './navigation/TabNavigation';

import LandingScreen from './screen/LandingScreen/LandingScreen';
import RegisterScreen from './screen/RegisterScreen/RegisterScreen';

const Stack = createStackNavigator();

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
            component={TabNavigation}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
