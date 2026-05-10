import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { formatCurrency } from '../utils/Formatter';

type BudgetModalProps = {
  visible: boolean;
  initialBudget?: number | null;
  onClose: () => void;
  onSave: (amount: number) => Promise<void> | void;
};

const BudgetModal: React.FC<BudgetModalProps> = ({
  visible,
  initialBudget,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmount(
        initialBudget != null && initialBudget > 0
          ? String(Math.round(initialBudget))
          : '',
      );
      setError(null);
      setIsSaving(false);
    }
  }, [visible, initialBudget]);

  const handleAmountChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    setAmount(digitsOnly);
    if (error) setError(null);
  };

  const previewAmount = amount ? parseInt(amount, 10) : 0;

  const handleSubmit = async () => {
    if (!/^\d+$/.test(amount)) {
      setError('Please enter a whole number greater than 0.');
      return;
    }
    const parsed = parseInt(amount, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Budget must be greater than 0.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(parsed);
      onClose();
    } catch (e) {
      setError('Could not save your budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {initialBudget && initialBudget > 0
              ? 'Edit monthly budget'
              : 'Set your monthly budget'}
          </Text>
          <Text style={styles.subtitle}>
            We'll use this as your spending target every month and warn you
            when you go over.
          </Text>

          <View style={styles.inputRow}>
            <Text style={styles.prefix}>Rp</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor="#A8A6C2"
              keyboardType="number-pad"
              maxLength={12}
              autoFocus
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSaving}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isSaving && styles.saveDisabled]}
              onPress={handleSubmit}
              disabled={isSaving}
              activeOpacity={0.85}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#8B8AA3',
    marginBottom: 18,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECEAF5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  prefix: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#8290ed',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    color: '#8290ed',
    padding: 0,
  },
  preview: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
  },
  error: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    color: '#e74c3c',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1EEFF',
  },
  cancelText: {
    fontSize: 15,
    color: '#201c5c',
    fontFamily: 'Montserrat-SemiBold',
  },
  saveButton: {
    backgroundColor: '#201c5c',
  },
  saveDisabled: {
    backgroundColor: '#A8A6C2',
  },
  saveText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default BudgetModal;
