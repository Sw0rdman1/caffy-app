import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';
import { useColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@/context/ToastContext';

const PreviewScreen = () => {
    const { imageUri } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isCoffeeImage, setIsCoffeeImage] = useState(false);
    const [location, setLocation] = useState('');
    const { showToast } = useToast();
    const { backgroundSecondary } = useColors();

    useEffect(() => {
        const checkImage = async () => {
            const isCoffee = await checkImageForCoffee(imageUri || '');
            setIsCoffeeImage(isCoffee);
            setLoading(false);

            if (isCoffee) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                showToast('Coffee detected! Looks great!', 'success');
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                showToast('No coffee detected.', 'error');
            }
        };

        checkImage();
    }, [imageUri]);

    const saveImageToStorage = async () => {
        if (!imageUri) return;

        try {
            const fileName = imageUri.split('/').pop();
            const newPath = FileSystem.documentDirectory + 'saved/' + fileName;

            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'saved', { intermediates: true });
            await FileSystem.moveAsync({ from: imageUri, to: newPath });

            const json = await AsyncStorage.getItem('savedImages');
            const savedImages = json ? JSON.parse(json) : [];

            const newEntry = {
                uri: newPath,
                timestamp: new Date().toISOString(),
                location: location.trim(),
            };

            savedImages.push(newEntry);
            await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));

            router.push('/history');
            showToast('Image and location saved!', 'success');
        } catch (err) {
            console.error('Error saving image:', err);
            showToast('Failed to save image.', 'error');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: backgroundSecondary }}>
            <Image source={{ uri: imageUri || '' }} style={styles.image} resizeMode="cover" />

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.resultContainer}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color="#8B4513" />
                        <Text style={styles.loadingText}>Analyzing your coffee shot…</Text>
                    </>
                ) : isCoffeeImage ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Where are you drinking this coffee?"
                            value={location}
                            onChangeText={setLocation}
                            placeholderTextColor="#999"
                        />

                        <TouchableOpacity onPress={saveImageToStorage} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>💾 Save This Shot</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.failBox}>
                        <Text style={styles.failEmoji}>😞</Text>
                        <Text style={styles.resultText}>No coffee detected</Text>
                        <Text style={styles.subtext}>Try again and make sure your cup is clearly visible!</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
                            <Text style={styles.retryText}>🔁 Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

export default PreviewScreen;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#555',
    },
    failBox: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffe5e5',
        borderRadius: 16,
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
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 20,
        color: '#333',
        backgroundColor: '#fff',
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#6a4e3b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#d24d57',
        borderRadius: 10,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        padding: 8,
    },
});
