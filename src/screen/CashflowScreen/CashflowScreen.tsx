import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, SectionList} from 'react-native';
import {Dimensions} from 'react-native';
import {Transaction} from '../../constants/types';
import {CashflowProps} from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import axios, { AxiosError } from 'axios';
import { TransactionDto } from '../../constants/dto';
import { formatCurrency, shortenText } from '../../utils/Formatter';
import { path } from '../../constants/path';
import SpendingChart from './SpendingChart';
const screenWidth = Dimensions.get('window').width;

const categoryIconLabelMap: Record<string, string> = {
  'foodanddrink': 'Food & Drink',
  'groceries': 'Groceries',
  'salary': 'Salary',
  'bills': 'Bills',
  'rent': 'Rent',
  'travel': 'Travel',
  'transportation': 'Transportation',
  'shopping': 'Shopping',
  'education': 'Education',
  'family': 'Family',
  'entertainment': 'Entertainment',
  'health': 'Health',
  'other': 'Other',
};

const getTransactions = async (userId: number = 1): Promise<Transaction[]> => {
  try {
    const response = await axios.get<TransactionDto>(path.GET_TRANSACTIONS, {
      params: {
        user_id: userId
      }
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    throw error;
  }
};

const CashflowScreen: React.FC<CashflowProps> = ({navigation}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions(1);
        setTransactions(fetchedTransactions);
      } catch (error) {
        setTransactions([]);
      }
    };
    
    fetchTransactions();
  }, []);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }).reverse();

    const incomeData = Array(6).fill(0);
    const spendingData = Array(6).fill(0);

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = months.indexOf(date.toLocaleDateString('en-US', { month: 'short' }));
      
      if (monthIndex !== -1) {
        if (transaction.transaction_type === 'credit') {
          incomeData[monthIndex] += transaction.amount;
        } 
        if (transaction.transaction_type === 'debit') {
          spendingData[monthIndex] += transaction.amount;
        }
      }
    });

    return {
      labels: months,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: spendingData,
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Income', 'Spending'],
    };
  }, [transactions]);

  const groupedTransactions = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }
    
    const grouped = transactions.reverse().reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));
  }, [transactions]);

  const renderSectionHeader = ({section: {title}}: {section: {title: string}}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderTransactionItem = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View>
        <CategoryIcons iconName={item.transaction_category} />
      </View>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionDescription}>{categoryIconLabelMap[item.transaction_category]}</Text>
        {item.detail && (
          <Text style={styles.transactionDate}>{shortenText(item.detail, 20)}</Text>
        )}
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.transaction_type === 'debit' ? styles.expenseText : styles.incomeText,
        ]}>
        {item.transaction_type === 'debit' ? '-' : '+'}
        {formatCurrency(item.amount)} 
      </Text>
    </View>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(32, 28, 92, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.4,
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
    formatYLabel: (value: string) => formatCurrency(Number(value)),
  };

  return (
    <View style={styles.container}>
      <SpendingChart navigation={navigation} transactions={transactions} />

      <View style={styles.transactionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <SectionList
          sections={groupedTransactions}
          renderItem={renderTransactionItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.transactionList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
  },
  incomeText: {
    color: '#2ecc71',
    fontFamily: 'Montserrat-SemiBold',
  },
  expenseText: {
    color: '#e74c3c',
    fontFamily: 'Montserrat-SemiBold',
  },
  timeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  timeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeTimeButton: {
    backgroundColor: '#007AFF',
  },
  timeButtonText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTimeButtonText: {
    color: '#fff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    margin: 15,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#201c5c',
    fontFamily: 'Montserrat-Bold',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 15,
  },
  transactionLeft: {
    flex: 1,
    marginLeft: 20,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CashflowScreen;
