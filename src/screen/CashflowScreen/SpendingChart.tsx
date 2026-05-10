import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryGroup,
} from 'victory-native';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';
import { SpendingChartProps } from '../../constants/props';
import { formatCurrency, formatCurrencyLabel } from '../../utils/Formatter';
import { useUser } from '../../context/UserContext';

const VISIBLE_MONTHS = 5;
const MAX_MONTHS = 12;
const CARD_MARGIN_HORIZONTAL = 15;
const CARD_PADDING_HORIZONTAL = 15;
const CONTAINER_HORIZONTAL_PADDING = (CARD_MARGIN_HORIZONTAL + CARD_PADDING_HORIZONTAL) * 2;
const Y_AXIS_WIDTH = 50;
const CHART_HEIGHT = 200;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 35;
const BUDGET_COLOR = '#7C5DFC';
const INCOME_COLOR = '#13b062';
const EXPENSE_COLOR = '#e74c3c';

const SpendingChart: React.FC<SpendingChartProps> = ({ navigation, transactions }) => {
  const screenWidth = Dimensions.get('window').width;
  const { user } = useUser();
  const monthlyBudget = user?.monthly_budget ?? null;
  const hasBudget = typeof monthlyBudget === 'number' && monthlyBudget > 0;
  const scrollRef = useRef<ScrollView>(null);

  const chartData = useMemo(() => {
    const validDates = transactions
      .map(t => new Date(t.date))
      .filter(d => !isNaN(d.getTime()));

    const now = new Date();
    const currentYear = now.getFullYear();

    let endAnchor: Date;
    let start: Date;

    if (validDates.length === 0) {
      endAnchor = now;
      start = new Date(endAnchor);
      start.setMonth(start.getMonth() - (VISIBLE_MONTHS - 1));
    } else {
      const earliest = new Date(Math.min(...validDates.map(d => d.getTime())));
      const latest = new Date(Math.max(...validDates.map(d => d.getTime())));
      endAnchor = latest > now ? latest : now;

      const cap = new Date(endAnchor);
      cap.setMonth(cap.getMonth() - (MAX_MONTHS - 1));
      start = earliest > cap ? earliest : cap;

      const minStart = new Date(endAnchor);
      minStart.setMonth(minStart.getMonth() - (VISIBLE_MONTHS - 1));
      if (start > minStart) start = minStart;
    }

    const months: Array<{ key: string; label: string; year: number; month: number }> = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(endAnchor.getFullYear(), endAnchor.getMonth(), 1);
    while (cursor <= endMonth) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const monthShort = cursor.toLocaleDateString('en-US', { month: 'short' });
      const yearSuffix = year !== currentYear ? ` ${String(year).slice(-2)}` : '';
      months.push({
        key: `${year}-${month}`,
        label: `${monthShort}${yearSuffix}`,
        year,
        month,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const incomeData = months.map(m => ({ x: m.key, y: 0 }));
    const expensesData = months.map(m => ({ x: m.key, y: 0 }));
    const indexByKey = new Map(months.map((m, i) => [m.key, i]));

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) return;
      const idx = indexByKey.get(`${date.getFullYear()}-${date.getMonth()}`);
      if (idx == null) return;
      if (transaction.transaction_type === 'credit') {
        incomeData[idx].y += transaction.amount;
      } else if (transaction.transaction_type === 'debit') {
        expensesData[idx].y += transaction.amount;
      }
    });

    return { months, incomeData, expensesData };
  }, [transactions]);

  const containerInnerWidth = screenWidth - CONTAINER_HORIZONTAL_PADDING;
  const scrollableInnerWidth = containerInnerWidth - Y_AXIS_WIDTH;
  const slotWidth = scrollableInnerWidth / VISIBLE_MONTHS;
  const chartWidth = chartData.months.length * slotWidth;
  const xTickValues = chartData.months.map(m => m.key);
  const xTickLabels = new Map(chartData.months.map(m => [m.key, m.label]));

  const yMax = useMemo(() => {
    const incomeMax = Math.max(0, ...chartData.incomeData.map(d => d.y));
    const expenseMax = Math.max(0, ...chartData.expensesData.map(d => d.y));
    const budgetMax = hasBudget && monthlyBudget != null ? monthlyBudget : 0;
    const dataMax = Math.max(incomeMax, expenseMax, budgetMax);
    return dataMax === 0 ? 1 : dataMax * 1.1;
  }, [chartData, hasBudget, monthlyBudget]);

  useEffect(() => {
    if (chartData.months.length <= VISIBLE_MONTHS) return;
    const id = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
    return () => clearTimeout(id);
  }, [chartData.months.length]);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Income vs Spending</Text>
      </View>
      <View style={styles.chartRow}>
        <View style={styles.yAxisColumn} pointerEvents="none">
          <VictoryChart
            padding={{ top: CHART_PADDING_TOP, bottom: CHART_PADDING_BOTTOM, left: 45, right: 0 }}
            width={Y_AXIS_WIDTH}
            height={CHART_HEIGHT}
            domain={{ y: [0, yMax] }}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => formatCurrencyLabel(tick)}
              style={{ tickLabels: styles.label }}
            />
          </VictoryChart>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollableChart}>
          <VictoryChart
            padding={{ top: CHART_PADDING_TOP, bottom: CHART_PADDING_BOTTOM, left: 0, right: 0 }}
            width={chartWidth}
            height={CHART_HEIGHT}
            domain={{ y: [0, yMax] }}
            domainPadding={{ x: slotWidth / 2 }}>
            <VictoryAxis
              tickValues={xTickValues}
              tickFormat={(tick: string) => xTickLabels.get(tick) ?? tick}
              style={{ tickLabels: styles.label }}
            />
            {hasBudget && monthlyBudget != null && (
              <VictoryAxis
                dependentAxis
                tickValues={[monthlyBudget]}
                tickFormat={() => ''}
                style={{
                  axis: { stroke: 'transparent' },
                  ticks: { stroke: 'transparent' },
                  grid: {
                    stroke: BUDGET_COLOR,
                    strokeDasharray: '6,4',
                    strokeWidth: 2,
                  },
                }}
              />
            )}
            <VictoryGroup offset={20} colorScale={[INCOME_COLOR, EXPENSE_COLOR]}>
              <VictoryBar
                data={chartData.incomeData}
                barWidth={15}
                style={{ data: { fill: INCOME_COLOR } }}
              />
              <VictoryBar
                data={chartData.expensesData}
                barWidth={15}
                style={{ data: { fill: EXPENSE_COLOR } }}
              />
            </VictoryGroup>
          </VictoryChart>
        </ScrollView>
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: INCOME_COLOR }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: EXPENSE_COLOR }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        {hasBudget && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDash, { backgroundColor: BUDGET_COLOR }]} />
            <Text style={styles.legendText}>Budget</Text>
          </View>
        )}
      </View>
      {hasBudget && monthlyBudget != null && (
        <Text style={styles.budgetCaption}>
          Monthly budget: {formatCurrency(monthlyBudget)}
        </Text>
      )}
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisColumn: {
    width: Y_AXIS_WIDTH,
  },
  scrollableChart: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendDash: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    lineHeight: 18,
  },
  budgetCaption: {
    marginTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 12,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#7C5DFC',
    textAlign: 'center',
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