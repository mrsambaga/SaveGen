import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';

interface LoadingModalProps {
    visible: boolean;
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
    visible,
    message = 'Loading...',
    size = 'large',
    color = '#201c5c'
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size={size} color={color} />
                    <Text style={styles.loadingText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 150,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
    },
});

export default LoadingModal; 