import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
    style?: any;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    message,
    size = 'small',
    color = '#201c5c',
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.loadingText}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default LoadingIndicator; 