import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const BackButton = () => {
    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
        >
            <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
    )
}

export default BackButton

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        padding: 8,
    },
})