import {Image, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import Button from '../../components/Button';
import {HomeProps} from '../../constants/props';
import { useMemo } from 'react';
import { formatCurrency } from '../../utils/Formatter';
import { Transaction } from '../../constants/types';
import { useTransactions } from '../../context/TransactionContext';

const HomeScreen: React.FC<HomeProps> = ({navigation}) => {
  const {transactions} = useTransactions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, Sam!</Text>
      <View style={styles.card}>
        <View style={styles.topCard}>
          <Text style={styles.cardText}>This Month Spending</Text>
          <Image
            source={require('../../../assets/icons/coin.png')}
            style={styles.icon}
          />
        </View>
        <View>
          <Text style={styles.spendingText}>{'Rp 10.000.000'}</Text>
        </View>
        <View style={styles.ratioBar}>
          <View style={[styles.spendingBar, {flex: 1}]} />
        </View>
      </View>
      <View style={styles.wallet}>
        <Image
          source={require('../../../assets/icons/wallet.png')}
          style={styles.walletIcon}
        />
        <View style={styles.walletRight}>
          <Text style={styles.heading2}>Cash Wallet</Text>
          <Text style={styles.heading}>IDR 30.000.000</Text>
        </View>
        <Image
          source={require('../../../assets/icons/eye.png')}
          style={styles.eyeIcon}
        />
      </View>
      <View style={styles.budgetingContainer}>
        <Text style={styles.heading}>Budgeting</Text>
        <View style={styles.budgeting}>
          <Text style={styles.heading}>Set your budget</Text>
          <Text style={styles.text}>Save more money</Text>
          <View style={styles.budgetingBottom}>
            <Button
              title="Setup now"
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={() => navigation.navigate('Register')}
            />
            <Image
              source={require('../../../assets/icons/budgeting.png')}
              style={styles.budgetingIcon}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
  },
  card: {
    marginTop: 30,
    backgroundColor: '#201c5c',
    width: '100%',
    height: '20%',
    padding: 20,
    borderRadius: 20,
  },
  topCard: {
    flexDirection: 'row',
    gap: '8%',
    marginBottom: 10,
  },
  icon: {
    width: '20%',
    height: 70,
  },
  ratioBar: {
    marginTop: 5,
    flexDirection: 'row',
    height: 10,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  spendingBar: {
    backgroundColor: '#8290ed',
    borderRadius: 30,
  },
  expenseBar: {
    backgroundColor: '#f44336',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
  },
  heading2: {
    fontSize: 20,
    fontFamily: 'Montserrat-Semibold',
    color: '#201c5c',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#201c5c',
  },
  cardText: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  spendingText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  budgetingContainer: {
    marginTop: 30,
    height: '21%',
  },
  budgeting: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    height: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
  },
  budgetingBottom: {
    flexDirection: 'row',
  },
  budgetingIcon: {
    marginTop: -10,
    width: 80,
    height: 80,
    marginLeft: '15%',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
  button: {
    marginTop: '10%',
    backgroundColor: '#8290ed',
    paddingVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '50%',
  },
  wallet: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 20,
    height: '15%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  walletIcon: {
    width: '15%',
    height: '60%',
  },
  walletRight: {
    marginLeft: '5%',
    paddingTop: 10,
  },
  eyeIcon: {
    marginLeft: 30,
    width: 35,
    height: 20,
  },
});

export default HomeScreen;
