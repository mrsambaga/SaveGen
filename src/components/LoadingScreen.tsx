import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingScreenProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Loading...',
    size = 'large',
    color = '#201c5c'
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            <Text style={styles.loadingText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default LoadingScreen; 