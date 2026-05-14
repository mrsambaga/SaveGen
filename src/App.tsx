import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './navigation/StackNavigation';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <UserProvider>
            <TransactionProvider>
              <NavigationContainer>
                <StackNavigation />
              </NavigationContainer>
            </TransactionProvider>
          </UserProvider>
        </AuthProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
