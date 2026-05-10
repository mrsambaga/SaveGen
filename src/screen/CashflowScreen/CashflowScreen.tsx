import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SectionList, Alert, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Transaction } from '../../constants/types';
import { CashflowProps } from '../../constants/props';
import CategoryIcons from '../../components/CategoryIcons';
import { formatCurrency, shortenText } from '../../utils/Formatter';
import SpendingChart from './SpendingChart';
import { deleteTransaction, fetchTransactions } from '../../service/transactionService';
import { categoryIconLabelMap } from '../../constants/const';
import { useTransactions } from '../../context/TransactionContext';

const CashflowScreen: React.FC<CashflowProps> = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const swipeableRefs = useRef<Map<string, Swipeable | null>>(new Map());
  const { refreshTransactions } = useTransactions();

  const getTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedTransactions = await fetchTransactions(1);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [getTransactions]),
  );

  const closeSwipeable = useCallback((id: string) => {
    swipeableRefs.current.get(id)?.close();
  }, []);

  const handleDelete = useCallback(
    (transaction: Transaction) => {
      const id = transaction.id;
      if (!id) return;

      const label = categoryIconLabelMap[transaction.transaction_category] ?? 'this transaction';
      const amount = formatCurrency(transaction.amount);

      Alert.alert(
        'Delete transaction?',
        `${label} (${amount}) will be permanently removed.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => closeSwipeable(id),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const previous = transactions;
              setDeletingId(id);
              setTransactions(prev => prev.filter(t => t.id !== id));
              swipeableRefs.current.delete(id);

              try {
                await deleteTransaction(id);
                refreshTransactions().catch(err =>
                  console.warn('Failed to refresh transactions context:', err),
                );
              } catch (error) {
                console.error('Error deleting transaction:', error);
                setTransactions(previous);
                Alert.alert(
                  'Delete failed',
                  'Could not delete the transaction. Please try again.',
                );
              } finally {
                setDeletingId(null);
              }
            },
          },
        ],
        { cancelable: true, onDismiss: () => closeSwipeable(id) },
      );
    },
    [transactions, refreshTransactions, closeSwipeable],
  );

  const groupedTransactions = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }

    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const grouped = sorted.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(grouped)
      .map(([title, data]) => ({ title, data }))
      .sort(
        (a, b) =>
          new Date(b.data[0].date).getTime() - new Date(a.data[0].date).getTime(),
      );
  }, [transactions]);

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderRightActions = (item: Transaction) => () => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => handleDelete(item)}
      activeOpacity={0.8}>
      <FontAwesomeIcon icon={faTrash} size={20} color="#fff" />
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const id = item.id!;
    const isDeleting = deletingId === id;

    return (
      <Swipeable
        ref={ref => {
          swipeableRefs.current.set(id, ref);
        }}
        renderRightActions={renderRightActions(item)}
        overshootRight={false}
        rightThreshold={40}
        enabled={!isDeleting}>
        <View style={[styles.transactionItem, isDeleting && styles.transactionItemDeleting]}>
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
      </Swipeable>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          keyExtractor={item => item.id!}
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
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: '#fff',
  },
  transactionItemDeleting: {
    opacity: 0.5,
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    flexDirection: 'column',
  },
  deleteActionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 4,
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
