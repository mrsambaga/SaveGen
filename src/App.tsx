import React from 'react';
import LandingScreen from './screen/LandingScreen/LandingScreen';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen/LoginScreen';

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
            name="Login"
            component={LoginScreen}
            options={{title: 'Login', headerShown: false}}
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
