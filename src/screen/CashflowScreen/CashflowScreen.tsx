import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, SectionList} from 'react-native';
import {faPieChart} from '@fortawesome/free-solid-svg-icons';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Button from '../../components/Button';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Transaction} from '../../constants/types';
import {CashflowProps} from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import axios, { AxiosError } from 'axios';
import { TransactionDto } from '../../constants/dto';
const screenWidth = Dimensions.get('window').width;

const API_BASE_URL = 'http://192.168.18.6:8080';

const getTransactions = async (userId: number = 1): Promise<Transaction[]> => {
  try {
    const response = await axios.get<TransactionDto>(`${API_BASE_URL}/transactions`, {
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

  const [chartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2500, 2800, 3000, 3000, 3500, 3800],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [1800, 2200, 2400, 2100, 2600, 2900],
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Spending'],
  });

  const groupedTransactions = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }
    
    const grouped = transactions.reduce((acc, transaction) => {
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
        <Text style={styles.transactionDescription}>{item.detail}</Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.transaction_type === 'debit' ? styles.expenseText : styles.incomeText,
        ]}>
        {item.transaction_type === 'debit' ? '-' : '+'}
        {item.amount.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })} 
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
    color: (opacity = 1) => `rgba(19, 13, 91, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(32, 28, 92, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Income vs Spending</Text>
        </View>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
        <View style={styles.overviewSection}>
          <Button
            title="Overview"
            onPress={() => navigation.navigate('Overview', {transactions})}
            buttonStyle={styles.buttonOverviewContainer}>
            <View style={styles.overviewIconContainer}>
              <FontAwesomeIcon icon={faPieChart} size={20} color={'#ffffff'} />
            </View>
            <View style={styles.overviewTextContainer}>
              <Text style={styles.overviewText}>Overview</Text>
            </View>
          </Button>
        </View>
      </View>

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
    paddingTop: 15,
  },
  incomeText: {
    color: '#2ecc71',
    fontFamily: 'Montserrat-SemiBold',
  },
  expenseText: {
    color: '#e74c3c',
    fontFamily: 'Montserrat-SemiBold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
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
  overviewSection: {
    alignItems: 'center',
  },
  buttonOverviewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#201c5c',
    paddingVertical: 10,
    borderRadius: 15,
    width: '50%',
  },
  overviewIconContainer: {
    padding: 2,
    borderRadius: 40,
    marginRight: 10,
  },
  overviewTextContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  overviewText: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
  },
});

export default CashflowScreen;
