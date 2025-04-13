import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {ChartDataItem} from '../../constants/types';
import {OverviewProps} from '../../constants/props';

const screenWidth = Dimensions.get('window').width;

const OverviewScreen: React.FC<OverviewProps> = ({route}) => {
  const transactions = useMemo(() => {
    return route.params?.transactions || [];
  }, [route.params?.transactions]);

  const spendingByCategory = useMemo<ChartDataItem[]>(() => {
    const expenseTransactions = transactions.filter(
      transaction => transaction.type === 'expense',
    );

    const categoryTotals = expenseTransactions.reduce<Record<string, number>>(
      (acc, transaction) => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount); // Make the amount positive

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
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    });
  }, [transactions]);

  const totalSpending = useMemo<number>(() => {
    return spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
  }, [spendingByCategory]);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Overview</Text>
        <Text style={styles.subtitle}>
          Total Spending: ${totalSpending.toFixed(2)}
        </Text>
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
            paddingLeft="15"
            absolute
          />
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
            <View style={[styles.categoryDot, {backgroundColor: item.color}]} />
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.categoryPercentage}>
              {((item.amount / totalSpending) * 100).toFixed(1)}%
            </Text>
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
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#999',
  },
  categoriesList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
    width: 80,
    textAlign: 'right',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#666',
    width: 45,
    textAlign: 'right',
  },
});

export default OverviewScreen;
