import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ChartDataItem } from '../../constants/types';
import { OverviewProps } from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import { formatCurrency } from '../../utils/Formatter';
import DateTimePicker from '@react-native-community/datetimepicker';

const screenWidth = Dimensions.get('window').width;

type TimeRangeType = 'monthly' | 'yearly' | 'custom';

const OverviewScreen: React.FC<OverviewProps> = ({ route }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());

  const transactions = useMemo(() => {
    return route.params?.transactions || [];
  }, [route.params?.transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    if (selectedTimeRange === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (selectedTimeRange === 'yearly') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (selectedTimeRange === 'custom') {
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= customStartDate && transactionDate <= customEndDate;
      });
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }, [transactions, selectedTimeRange, customStartDate, customEndDate]);

  const spendingByCategory = useMemo<ChartDataItem[]>(() => {
    const expenseTransactions = filteredTransactions.filter(
      transaction => transaction.transaction_type === 'debit',
    );

    const categoryTotals = expenseTransactions.reduce<Record<string, number>>(
      (acc, transaction) => {
        const category = transaction.transaction_category;
        const amount = Math.abs(transaction.amount);

        if (!acc[category]) {
          acc[category] = amount;
        } else {
          acc[category] += amount;
        }

        return acc;
      },
      {},
    );

    return Object.entries(categoryTotals).map(([name, amount], index) => {
      const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#8AC926',
      ];

      return {
        name,
        amount,
        color: colors[index % colors.length],
        legendFontColor: '#201c5c',
        legendFontSize: 12,
      };
    });
  }, [filteredTransactions]);

  const totalSpending = useMemo<number>(() => {
    return spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
  }, [spendingByCategory]);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(32, 28, 92, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(32, 28, 92, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'Montserrat-SemiBold',
    },
  };

  const getTimeRangeText = () => {
    if (selectedTimeRange === 'monthly') {
      return selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (selectedTimeRange === 'yearly') {
      return selectedMonth.toLocaleString('default', { year: 'numeric' });
    } else {
      return `${customStartDate.toLocaleString('default', { month: 'short', year: 'numeric' })} - ${customEndDate.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (isStartDate) {
        setCustomStartDate(selectedDate);
      } else {
        setCustomEndDate(selectedDate);
      }
    }
  };

  const showDatePickerModal = (isStart: boolean) => {
    setIsStartDate(isStart);
    setShowDatePicker(true);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Spending Overview</Text>
        <Text style={styles.subtitle}>
          Total Spending: {formatCurrency(totalSpending)}
        </Text>
      </View>

      <View style={styles.timeRangeContainer}>
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === 'monthly' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('monthly')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === 'monthly' && styles.selectedTimeRangeText]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === 'yearly' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('yearly')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === 'yearly' && styles.selectedTimeRangeText]}>Yearly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === 'custom' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('custom')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === 'custom' && styles.selectedTimeRangeText]}>Custom</Text>
          </TouchableOpacity>
        </View>

        {selectedTimeRange === 'custom' ? (
          <View style={styles.customDateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => showDatePickerModal(true)}
            >
              <Text style={styles.dateButtonText}>
                From: {customStartDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => showDatePickerModal(false)}
            >
              <Text style={styles.dateButtonText}>
                To: {customEndDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => {
              setIsStartDate(true);
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.monthButtonText}>
              {getTimeRangeText()}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={isStartDate ? customStartDate : customEndDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={selectedTimeRange === 'custom' && !isStartDate ? customStartDate : undefined}
        />
      )}

      {spendingByCategory.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={spendingByCategory}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={false}
            style={styles.chart}
            center={[screenWidth / 4.5, 0]}
            avoidFalseZero={true}
          />
          <View style={styles.legendContainer}>
            {spendingByCategory.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <CategoryIcons
                  iconName={item.name.toLowerCase()}
                  size={16}
                  color={item.color}
                />
                <Text style={styles.legendText}>
                  {item.name} ({((item.amount / totalSpending) * 100).toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No expense data available</Text>
        </View>
      )}

      <View style={styles.categoriesList}>
        <Text style={styles.categoriesTitle}>Expenses by Category</Text>
        {spendingByCategory.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <CategoryIcons
              iconName={item.name.toLowerCase()}
              size={20}
              color={item.color}
            />
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#201c5c',
    marginBottom: 5,
    fontFamily: 'Montserrat-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 8,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  categoriesList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 12,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'right',
  },
  timeRangeContainer: {
    marginBottom: 20,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTimeRange: {
    backgroundColor: '#201c5c',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  selectedTimeRangeText: {
    color: '#fff',
  },
  monthButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  monthButtonText: {
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  customDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default OverviewScreen;
