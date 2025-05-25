import React from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { categoryIconLabelMap } from "../../constants/const";
import CategoryModal from "./CategoryModal";
import { createTransaction } from "../../service/transactionService";
import { CreateTransactionRequestDTO } from "../../constants/dto";
import { NewTransactionProps } from "../../constants/props";
import LoadingModal from "../../components/LoadingModal";

const NewTransactionScreen: React.FC<NewTransactionProps> = ({ navigation }) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('other');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!amount || parseFloat(amount) === 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            setIsLoading(true);
            const requestDTO: CreateTransactionRequestDTO = {
                user_id: 1,
                amount: Math.abs(parseFloat(amount)),
                date: date.toISOString(),
                detail: description,
                transaction_type: parseFloat(amount) > 0 ? 'credit' : 'debit',
                transaction_category: category
            };

            await createTransaction(requestDTO);

            setAmount('');
            setDescription('');
            setCategory('other');
            setDate(new Date());

            navigation.navigate('CashFlow', { shouldRefresh: true });
        } catch (error) {
            Alert.alert('Error', 'Failed to save transaction. Please try again.');
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
        return date.getDate() == new Date().getDate() ? 'Today' : date.toLocaleDateString();
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>New Transaction</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>{renderDateText()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                onChange={onDateChange}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter description"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category</Text>
                        <TouchableOpacity onPress={() => setShowCategoryModal(true)}
                            style={styles.categoryButton}>
                            <Text style={styles.label}>{categoryIconLabelMap[category]}</Text>
                        </TouchableOpacity>
                        {showCategoryModal && <CategoryModal {...{ showCategoryModal, setShowCategoryModal, category, setCategory }} />}
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <LoadingModal
                visible={isLoading}
                message="Saving transaction..."
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    formContainer: {
        padding: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#201c5c',
        fontFamily: 'Montserrat-SemiBold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontFamily: 'Montserrat-SemiBold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#201c5c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-SemiBold',
    },
    dateText: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
    categoryButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
});

export default NewTransactionScreen;