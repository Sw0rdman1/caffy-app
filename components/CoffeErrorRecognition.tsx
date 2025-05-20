import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useColors } from '@/constants/Colors'

const CoffeErrorRecognition = () => {
    const { error } = useColors()
    return (
        <View style={[styles.failBox, { backgroundColor: error.surface }]}>
            <Text style={styles.failEmoji}>😞</Text>
            <Text style={[styles.resultText, { color: error.text }]}>No coffee detected</Text>
            <Text style={[styles.subtext, { color: error.text }]}>Try again and make sure your cup is clearly visible!</Text>
            <TouchableOpacity onPress={() => router.back()} style={[styles.retryButton]}>
                <Text style={styles.retryText}>🔁 Retry</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CoffeErrorRecognition

const styles = StyleSheet.create({
    failBox: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        width: '100%',
    },
    failEmoji: {
        fontSize: 44,
        marginBottom: 10,
    },
    resultText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    subtext: {
        fontSize: 16,
        marginTop: 6,
        color: '#777',
        textAlign: 'center',
    },
    retryButton: {
        width: '80%',
        marginTop: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#d24d57',
        borderRadius: 12,
        alignItems: 'center',
    },
    retryText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

})