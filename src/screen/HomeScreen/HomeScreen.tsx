import { Image, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import Button from '../../components/Button';
import { HomeProps, TopSpendingProps } from '../../constants/props';
import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/Formatter';
import { Transaction } from '../../constants/types';
import { useTransactions } from '../../context/TransactionContext';
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CategoryIcons from '../../components/CategoryIcons';
import { categoryIconLabelMap } from '../../constants/const';

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const { transactions } = useTransactions();
  const [showBalance, setShowBalance] = useState(false);

  const thisMonthSpending = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter((transaction: Transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.transaction_type === 'debit' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum: number, transaction: Transaction) => sum + Math.abs(transaction.amount), 0);
  }, [transactions]);

  const getCurrentBalance = useMemo(() => {
    return transactions.reduce((sum: number, transaction: Transaction) => {
      if (transaction.transaction_type === 'debit') {
        return sum - transaction.amount;
      }
      return sum + transaction.amount;
    }, 0);
  }, [transactions]);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const topThreeSpending = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyDebitTransaction: Transaction[] = transactions.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.transaction_type === 'debit' &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })

    const spendingByCategory: { [categoryName: string]: number } = {};
    monthlyDebitTransaction.forEach((transaction) => {
      const amount = Math.abs(transaction.amount);
      spendingByCategory[transaction.transaction_category!] = (spendingByCategory[transaction.transaction_category!] || 0) + amount;
    })

    const categoriesArray = Object.keys(spendingByCategory).map(categoryName => ({
      categoryName: categoryName,
      totalAmount: spendingByCategory[categoryName],
    }));

    return categoriesArray.sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 3);
  }, [transactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const TopSpending: React.FC<TopSpendingProps> = ({ item }) => {
    return (
      <View style={styles.topSpendingItem}>
        <View>
          <CategoryIcons iconName={item.categoryName} />
        </View>
        <View style={styles.spendingSectionLeft}>
          <Text style={styles.spendingLabel}>{categoryIconLabelMap[item.categoryName]}</Text>
        </View>
        <Text
          style={styles.spendingAmount}>
          {formatCurrency(item.totalAmount)}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
          <Text style={styles.spendingText}>{formatCurrency(thisMonthSpending)}</Text>
        </View>
        <View style={styles.ratioBar}>
          <View style={[styles.spendingBar, { flex: 1 }]} />
        </View>
      </View>
      <View style={styles.wallet}>
        <Image
          source={require('../../../assets/icons/wallet.png')}
          style={styles.walletIcon}
        />
        <View style={styles.walletRight}>
          <Text style={styles.heading2}>Current Balance</Text>
          <Text style={styles.heading}>
            {showBalance ? formatCurrency(getCurrentBalance) : '************'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={toggleBalanceVisibility}
        >
          {showBalance ?
            <FontAwesomeIcon icon={faEye} size={35} color={'#201c5c'} />
            :
            <FontAwesomeIcon icon={faEyeSlash} size={35} color={'#201c5c'} />
          }
        </TouchableOpacity>
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
      <View style={styles.topSpendingContainer}>
        <Text style={styles.heading}>Top Spending This Month</Text>
        {topThreeSpending && topThreeSpending.length > 0 ? (
          topThreeSpending.map((spendingItem) => (
            <TopSpending
              key={spendingItem.categoryName}
              item={spendingItem}
            />
          ))
        ) : (
          <Text style={styles.heading}>No spending data for this month yet.</Text>
        )}
      </View>
    </ScrollView>
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
    marginTop: 5,
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
    marginTop: 20,
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
    shadowOffset: { width: 0, height: 2 },
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
    flex: 1,
  },
  eyeIconContainer: {
    padding: 10,
  },
  eyeIcon: {
    width: 35,
    height: 20,
  },
  topSpendingContainer: {
    marginTop: 60,
    marginBottom: 50,
    height: '21%',
  },
  topSpendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  spendingSectionLeft: {
    flex: 1,
    marginLeft: 20,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  spendingLabel: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
  spendingAmount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
});

export default HomeScreen;