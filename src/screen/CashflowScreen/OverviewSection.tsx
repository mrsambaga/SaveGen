import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ChartDataItem, TimeRangeType } from '../../constants/types';
import { OverviewProps } from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import { formatCurrency } from '../../utils/Formatter';
import { Picker } from '@react-native-picker/picker';
import { MONTHS } from '../../constants/const';
import MonthPicker from './MonthPicker';

const screenWidth = Dimensions.get('window').width;

const OverviewScreen: React.FC<OverviewProps> = ({ route }) => {
  const TODAY = new Date();
  const LAST_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1);
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<Date>(TODAY);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);
  const [customStartDate, setCustomStartDate] = useState<Date>(LAST_MONTH);
  const [customEndDate, setCustomEndDate] = useState<Date>(TODAY);


  const transactions = useMemo(() => {
    return route.params?.transactions || [];
  }, [route.params?.transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedTimeRange === 'monthly') {
      const endDate = new Date(selectedMonth);
      endDate.setMonth(endDate.getMonth() + 1);
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= selectedMonth && transactionDate < endDate;
      });
    } else if (selectedTimeRange === 'yearly') {
      customStartDate.setFullYear(selectedMonth.getFullYear());
      const endDate = new Date(customStartDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() >= customStartDate.getFullYear() && transactionDate.getFullYear() < endDate.getFullYear();
      });
    } else if (selectedTimeRange === 'custom') {
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= customStartDate && transactionDate <= customEndDate;
      });
    }

    return transactions;
  }, [transactions, selectedTimeRange, selectedMonth, customStartDate, customEndDate]);

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

  const handleYearChange = (year: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(year);
    setSelectedMonth(newDate);
  };

  const handleCustomMonthChange = (month: string) => {
    const targetDate = isStartDate ? customStartDate : customEndDate;
    const newDate = new Date(targetDate);
    newDate.setMonth(MONTHS.indexOf(month));
    if (isStartDate) {
      setCustomStartDate(newDate);
    } else {
      setCustomEndDate(newDate);
    }
  };

  const handleCustomYearChange = (year: number) => {
    const targetDate = isStartDate ? customStartDate : customEndDate;
    const newDate = new Date(targetDate);
    newDate.setFullYear(year);
    if (isStartDate) {
      setCustomStartDate(newDate);
    } else {
      setCustomEndDate(newDate);
    }
  };

  const renderYearPicker = () => (
    <Modal
      visible={showYearPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowYearPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Year</Text>
            <TouchableOpacity onPress={() => setShowYearPicker(false)}>
              <Text style={styles.pickerCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={selectedMonth.getFullYear()}
            onValueChange={handleYearChange}
          >
            {YEARS.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );

  const renderCustomPicker = () => (
    <Modal
      visible={showCustomPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCustomPicker(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>
              Select {isStartDate ? 'Start' : 'End'} Date
            </Text>
            <TouchableOpacity onPress={() => setShowCustomPicker(false)}>
              <Text style={styles.pickerCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.customPickerContent}>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker
                selectedValue={MONTHS[isStartDate ? customStartDate.getMonth() : customEndDate.getMonth()]}
                onValueChange={handleCustomMonthChange}
              >
                {MONTHS.map((month) => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Year</Text>
              <Picker
                selectedValue={isStartDate ? customStartDate.getFullYear() : customEndDate.getFullYear()}
                onValueChange={handleCustomYearChange}
              >
                {YEARS.map((year) => (
                  <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

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
              onPress={() => {
                setIsStartDate(true);
                setShowCustomPicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                From: {customStartDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setIsStartDate(false);
                setShowCustomPicker(true);
              }}
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
              if (selectedTimeRange === 'monthly') {
                setShowMonthPicker(true);
              } else {
                setShowYearPicker(true);
              }
            }}
          >
            <Text style={styles.monthButtonText}>
              {getTimeRangeText()}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {renderCustomPicker()}
      {renderYearPicker()}
      <MonthPicker
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
      />

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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  pickerCloseButton: {
    fontSize: 16,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  customPickerContent: {
    flexDirection: 'row',
    padding: 16,
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 8,
  },
});

export default OverviewScreen;
