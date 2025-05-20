import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';
import { useColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

const PreviewScreen = () => {
    const { imageUri } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isCoffeeImage, setIsCoffeeImage] = useState(false);
    const [location, setLocation] = useState('');
    const { backgroundSecondary } = useColors();

    useEffect(() => {
        const checkImage = async () => {
            const isCoffee = await checkImageForCoffee(imageUri || '');
            setIsCoffeeImage(isCoffee);
            setLoading(false);
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
                location: location.trim()
            };

            savedImages.push(newEntry);
            await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));

            router.push('/history');
            alert('Image and location saved!');
        } catch (err) {
            console.error('Error saving image:', err);
            alert('Failed to save image.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: backgroundSecondary }}
            behavior="padding"
            enabled
        >
            <Image source={{ uri: imageUri || '' }} style={styles.image} resizeMode="cover" />
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
                        <View style={styles.successBox}>
                            <Text style={styles.resultText}>Coffe detected! ☕</Text>
                            <Text style={styles.subtext}>That brew looks amazing. Post it!</Text>
                        </View>

                        <TouchableOpacity onPress={saveImageToStorage} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>💾 Save This Shot</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.failBox}>
                        <Text style={styles.resultText}>No coffee detected 🚫</Text>
                        <Text style={styles.subtext}>Try snapping your cup again!</Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
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
        gap: 12,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#555',
    },
    successBox: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f1e4d1',
        borderRadius: 16,
        marginBottom: 12,
    },
    failBox: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffe5e5',
        borderRadius: 16,
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
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 16,
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
});
