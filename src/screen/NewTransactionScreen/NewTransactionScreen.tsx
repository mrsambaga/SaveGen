import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {categoryIconLabelMap} from '../../constants/const';
import CategoryIcons from '../../components/CategoryIcons';
import CategoryModal from './CategoryModal';
import {createTransaction} from '../../service/transactionService';
import {CreateTransactionRequestDTO} from '../../constants/dto';
import {NewTransactionProps} from '../../constants/props';
import LoadingModal from '../../components/LoadingModal';

type TransactionKind = 'spending' | 'income';

const COLORS = {
  primary: '#2D2A6E',
  primaryDark: '#201c5c',
  accent: '#7C5DFC',
  lavender: '#F1EEFF',
  bg: '#F7F6FB',
  card: '#FFFFFF',
  border: '#ECEAF5',
  textMuted: '#8B8AA3',
  income: '#10B981',
  spending: '#EF4444',
};

const NewTransactionScreen: React.FC<NewTransactionProps> = ({navigation}) => {
  const [transactionKind, setTransactionKind] =
    useState<TransactionKind>('spending');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const accentColor =
    transactionKind === 'income' ? COLORS.income : COLORS.spending;

  const handleAmountChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    setAmount(digitsOnly);
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('other');
    setDate(new Date());
    setTransactionKind('spending');
  };

  const handleSave = async () => {
    if (!/^\d+$/.test(amount)) {
      Alert.alert(
        'Invalid amount',
        'Amount must be a whole number greater than 0. Decimals and negative numbers are not allowed.',
      );
      return;
    }

    const parsed = parseInt(amount, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert('Invalid amount', 'Please enter an amount greater than 0.');
      return;
    }

    try {
      setIsLoading(true);
      const requestDTO: CreateTransactionRequestDTO = {
        amount: parsed,
        date: date.toISOString(),
        detail: description,
        transaction_type: transactionKind === 'income' ? 'credit' : 'debit',
        transaction_category: category,
      };

      await createTransaction(requestDTO);

      const savedKind = transactionKind;
      resetForm();

      Alert.alert(
        'Transaction saved',
        `Your ${savedKind === 'income' ? 'income' : 'spending'} of Rp ${parsed.toLocaleString('id-ID')} was added successfully.`,
        [
          {
            text: 'View Transactions',
            onPress: () =>
              navigation.navigate('CashFlow', {
                screen: 'Transactions',
                params: {shouldRefresh: true},
              } as any),
          },
          {text: 'Add Another', style: 'cancel'},
        ],
      );
    } catch (error) {
      Alert.alert(
        'Save failed',
        'We could not save your transaction. Please check your connection and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const renderDateText = () => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    return isToday
      ? 'Today'
      : date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>New Transaction</Text>
        <Text style={styles.subtitle}>
          Track where your money is going in seconds.
        </Text>

        <View style={styles.kindToggle}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.kindOption,
              transactionKind === 'spending' && {
                backgroundColor: COLORS.spending,
              },
            ]}
            onPress={() => setTransactionKind('spending')}>
            <Text
              style={[
                styles.kindOptionText,
                transactionKind === 'spending' && styles.kindOptionTextActive,
              ]}>
              − Spending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.kindOption,
              transactionKind === 'income' && {
                backgroundColor: COLORS.income,
              },
            ]}
            onPress={() => setTransactionKind('income')}>
            <Text
              style={[
                styles.kindOptionText,
                transactionKind === 'income' && styles.kindOptionTextActive,
              ]}>
              + Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.amountCard, {borderColor: accentColor}]}>
          <Text style={styles.amountLabel}>
            {transactionKind === 'income' ? 'Amount Received' : 'Amount Spent'}
          </Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amountPrefix, {color: accentColor}]}>Rp</Text>
            <TextInput
              style={[styles.amountInput, {color: accentColor}]}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              maxLength={12}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => setShowCategoryModal(true)}>
            <View style={styles.fieldIconWrapper}>
              <CategoryIcons
                iconName={category}
                size={20}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.fieldTextWrapper}>
              <Text style={styles.fieldLabel}>Category</Text>
              <Text style={styles.fieldValue}>
                {categoryIconLabelMap[category]}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(true)}>
            <View style={styles.fieldIconWrapper}>
              <Text style={styles.iconEmoji}>📅</Text>
            </View>
            <View style={styles.fieldTextWrapper}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldValue}>{renderDateText()}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.fieldRow}>
            <View style={styles.fieldIconWrapper}>
              <Text style={styles.iconEmoji}>📝</Text>
            </View>
            <View style={styles.fieldTextWrapper}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a note (optional)"
                placeholderTextColor={COLORS.textMuted}
                multiline
              />
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onDateChange}
          />
        )}

        {showCategoryModal && (
          <CategoryModal
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            category={category}
            setCategory={setCategory}
          />
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>
            Save {transactionKind === 'income' ? 'Income' : 'Spending'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingModal visible={isLoading} message="Saving transaction..." />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    color: COLORS.primaryDark,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 4,
    marginBottom: 20,
  },
  kindToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  kindOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindOptionText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    fontFamily: 'Montserrat-SemiBold',
  },
  kindOptionTextActive: {
    color: '#FFFFFF',
  },
  amountCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountPrefix: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'bold',
    padding: 0,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  fieldIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 18,
  },
  fieldTextWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.primaryDark,
    fontFamily: 'Montserrat-SemiBold',
  },
  descriptionInput: {
    fontSize: 15,
    color: COLORS.primaryDark,
    fontFamily: 'Montserrat-SemiBold',
    padding: 0,
    minHeight: 20,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#A8A6C2',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: 'bold',
  },
});

export default NewTransactionScreen;
