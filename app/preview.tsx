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
import LocationInput from '@/components/LocationInput';
import CoffeErrorRecognition from '@/components/CoffeErrorRecognition';
import BackButton from '@/components/BackButton';
import { saveImageToStorage } from '@/utils/saveImageToStorage';

const PreviewScreen = () => {
    const { imageUri } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isCoffeeImage, setIsCoffeeImage] = useState(false);
    const [location, setLocation] = useState('');
    const { showToast } = useToast();
    const { backgroundSecondary, highlight } = useColors();

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

    const onSaveImageSuccess = () => {
        showToast('Image saved successfully!', 'success');
        router.back();
    }

    const saveImageToStorageHandler = async () => {
        await saveImageToStorage(
            imageUri || '',
            location,
            onSaveImageSuccess,
        );
    };



    return (
        <View style={{ flex: 1, backgroundColor: backgroundSecondary }}>
            <BackButton />
            <Image source={{ uri: imageUri || '' }} style={styles.image} resizeMode="cover" />
            <View style={styles.resultContainer}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color="#8B4513" />
                        <Text style={styles.loadingText}>Analyzing your coffee shot…</Text>
                    </>
                ) : isCoffeeImage ? (
                    <>
                        <LocationInput location={location} setLocation={setLocation} />

                        <TouchableOpacity onPress={saveImageToStorageHandler} style={[styles.saveButton, { backgroundColor: highlight }]}>
                            <Text style={styles.saveButtonText}>💾 Save This Shot</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <CoffeErrorRecognition />
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
        paddingTop: 30,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#555',
    },
    saveButton: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
