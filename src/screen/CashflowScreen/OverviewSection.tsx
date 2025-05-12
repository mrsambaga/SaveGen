import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ChartDataItem } from '../../constants/types';
import { OverviewProps } from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import { formatCurrency } from '../../utils/Formatter';

const screenWidth = Dimensions.get('window').width;

const OverviewScreen: React.FC<OverviewProps> = ({ route }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1m' | '3m' | '6m' | '12m'>('1m');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const transactions = useMemo(() => {
    return route.params?.transactions || [];
  }, [route.params?.transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    if (selectedTimeRange === '1m') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (selectedTimeRange === '3m') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (selectedTimeRange === '6m') {
      startDate.setMonth(now.getMonth() - 6);
    } else if (selectedTimeRange === '12m') {
      startDate.setMonth(now.getMonth() - 12);
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }, [transactions, selectedTimeRange]);

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
    const endDate = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const startDate = new Date(selectedMonth);

    if (selectedTimeRange === '3m') {
      startDate.setMonth(startDate.getMonth() - 3);
      return startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) + ' - ' + endDate;
    }
    if (selectedTimeRange === '6m') {
      startDate.setMonth(startDate.getMonth() - 6);
      return startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) + ' - ' + endDate;
    }
    if (selectedTimeRange === '12m') {
      startDate.setMonth(startDate.getMonth() - 12);
      return startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) + ' - ' + endDate;
    }

    return endDate
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
            style={[styles.timeRangeButton, selectedTimeRange === '1m' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('1m')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === '1m' && styles.selectedTimeRangeText]}>1M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === '3m' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('3m')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === '3m' && styles.selectedTimeRangeText]}>3M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === '6m' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('6m')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === '6m' && styles.selectedTimeRangeText]}>6M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, selectedTimeRange === '12m' && styles.selectedTimeRange]}
            onPress={() => setSelectedTimeRange('12m')}
          >
            <Text style={[styles.timeRangeText, selectedTimeRange === '12m' && styles.selectedTimeRangeText]}>12M</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => {
            // TODO: Implement month picker
            // This would typically open a date picker modal
          }}
        >
          <Text style={styles.monthButtonText}>
            {getTimeRangeText()}
          </Text>
        </TouchableOpacity>
      </View>

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
});

export default OverviewScreen;
