import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoryIcons from "../../components/CategoryIcons";
import { categoryIconLabelMap } from "../../constants/const";

const NewTransactionScreen: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('other');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const handleSave = () => {
        console.log({
            amount: parseFloat(amount),
            date,
            description,
            category
        });
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

    const renderCategoryModal = () => {
        const categories = Object.keys(categoryIconLabelMap);
        const rows = [];

        for (let i = 0; i < categories.length; i += 3) {
            const row = categories.slice(i, i + 3);
            rows.push(row);
        }

        return (
            <Modal
                visible={showCategoryModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.categoriesContainer}>
                            {rows.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.categoryRow}>
                                    {row.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryItem,
                                                category === category && styles.selectedCategory
                                            ]}
                                            onPress={() => {
                                                setCategory(category);
                                                setShowCategoryModal(false);
                                            }}
                                        >
                                            <CategoryIcons iconName={category} />
                                            <Text style={styles.categoryText}>
                                                {categoryIconLabelMap[category]}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
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
                    {showCategoryModal && renderCategoryModal()}
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    categoryItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        width: '30%',
    },
    categoryButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: '#201c5c',
    },
    closeButton: {
        fontSize: 20,
        color: '#666',
        padding: 5,
    },
    categoriesContainer: {
        maxHeight: '80%',
        marginBottom: 50,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    selectedCategory: {
        backgroundColor: '#f0f0f0',
    },
    categoryText: {
        marginTop: 8,
        fontSize: 11,
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        color: '#201c5c',
    },
});

export default NewTransactionScreen;