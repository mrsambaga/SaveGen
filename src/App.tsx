import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './navigation/StackNavigation';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <UserProvider>
        <TransactionProvider>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </TransactionProvider>
      </UserProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
