import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend } from 'victory-native';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';
import { SpendingChartProps } from '../../constants/props';
import { formatCurrencyLabel } from '../../utils/Formatter';

const SpendingChart: React.FC<SpendingChartProps> = ({ navigation, transactions }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    const months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(transactions[0] ? transactions[0].date : '');
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }).reverse();

    const incomeData = months.map(month => ({ x: month, y: 0 }));
    const expensesData = months.map(month => ({ x: month, y: 0 }));

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = months.indexOf(date.toLocaleDateString('en-US', { month: 'short' }));
      
      if (monthIndex !== -1) {
        if (transaction.transaction_type === 'credit') {
          incomeData[monthIndex].y += transaction.amount;
        } 
        if (transaction.transaction_type === 'debit') {
          expensesData[monthIndex].y += transaction.amount;
        }
      }
    });

    return { incomeData, expensesData };
  }, [transactions]);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Income vs Spending</Text>
      </View>
      <ScrollView horizontal>
        <View style={{ width: '100%' }}>
          <VictoryChart
            padding={{ top: 20, bottom: 35, left: 35, right: 10 }}
            width={screenWidth / 1.2}
            height={200}
          >
            <VictoryAxis
              tickFormat={(tick) => tick}
              style={{
                tickLabels: styles.label
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => formatCurrencyLabel(tick)}
              style={{
                tickLabels: styles.label
              }}
            />
            <VictoryGroup
              offset={20}
              colorScale={["#13b062", "#e74c3c"]}
            >
              <VictoryBar
                data={chartData.incomeData}
                barWidth={15}
                style={{ data: { fill: "#13b062" } }}
              />
              <VictoryBar
                data={chartData.expensesData}
                barWidth={15}
                style={{ data: { fill: "#e74c3c" } }}
              />
            </VictoryGroup>
          </VictoryChart>
        </View>
      </ScrollView>
      <VictoryLegend
        x={screenWidth / 5.5}
        height={20}
        orientation="horizontal"
        gutter={30}
        style={{ labels: styles.legend }}
        data={[
          { name: "Income", symbol: { fill: "#13b062" } },
          { name: "Expenses", symbol: { fill: "#e74c3c" } },
        ]}
      />
      <View style={styles.overviewSection}>
        <Button
          title="Overview"
          onPress={() => navigation.navigate('Overview', { transactions })}
          buttonStyle={styles.buttonOverviewContainer}
        >
          <View style={styles.overviewIconContainer}>
            <FontAwesomeIcon icon={faPieChart} size={20} color={'#ffffff'} />
          </View>
          <View style={styles.overviewTextContainer}>
            <Text style={styles.overviewText}>Overview</Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legend: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: '#201c5c',
    padding: 5,
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
  overviewSection: {
    marginTop: 20,
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

export default SpendingChart;