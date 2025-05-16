import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';
import { useColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { TouchableOpacity } from 'react-native';



const PreviewScreen = () => {
    const { imageUri } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isCoffeeImage, setIsCoffeeImage] = useState(false);
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

            // Ensure directory exists
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'saved', { intermediates: true });

            // Move the image to permanent location
            await FileSystem.moveAsync({ from: imageUri, to: newPath });

            // Get current saved items
            const json = await AsyncStorage.getItem('savedImages');
            const savedImages = json ? JSON.parse(json) : [];

            // Add new entry
            const newEntry = {
                uri: newPath,
                timestamp: new Date().toISOString()
            };

            savedImages.push(newEntry);
            await AsyncStorage.setItem('savedImages', JSON.stringify(savedImages));

            alert('Image and timestamp saved!');
        } catch (err) {
            console.error('Error saving image:', err);
            alert('Failed to save image.');
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: backgroundSecondary }}>
            <Image source={{ uri: imageUri || '' }} style={styles.image} resizeMode="cover" />

            <View style={styles.resultContainer}>
                {loading ? (
                    <>
                        <ActivityIndicator size="large" color="#8B4513" />
                        <Text style={styles.loadingText}>Analyzing your coffee shot…</Text>
                    </>
                ) : isCoffeeImage ? (
                    <View style={styles.successBox}>
                        <Text style={styles.resultText}> Coffe detected! ☕</Text>
                        <Text style={styles.subtext}>That brew looks amazing. Post it!</Text>
                    </View>
                ) : (
                    <View style={styles.failBox}>
                        <Text style={styles.resultText}>No coffee detected 🚫</Text>
                        <Text style={styles.subtext}>Try snapping your cup again!</Text>
                    </View>
                )}
                <TouchableOpacity onPress={saveImageToStorage} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>💾 Save This Shot</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PreviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        flex: 1,
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
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
