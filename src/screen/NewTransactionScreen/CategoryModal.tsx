import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { categoryIconLabelMap } from "../../constants/const";
import CategoryIcons from "../../components/CategoryIcons";
import { useState } from "react";

interface CategoryModalProps {
    showCategoryModal: boolean;
    setShowCategoryModal: (showCategoryModal: boolean) => void;
    category: string;
    setCategory: (category: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ showCategoryModal, setShowCategoryModal, category, setCategory }) => {
    const categories = Object.keys(categoryIconLabelMap);
    const CATEGORY_PER_ROW = 3;
    const rows = [];

    for (let i = 0; i < categories.length; i += CATEGORY_PER_ROW) {
        const row = categories.slice(i, i + CATEGORY_PER_ROW);
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

const styles = StyleSheet.create({
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
    categoryItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        width: '30%',
    },
});

export default CategoryModal;