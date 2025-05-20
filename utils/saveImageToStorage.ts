import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export const saveImageToStorage = async (imageUri: string, location: string, onSuccess: () => void) => {
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

        onSuccess();
    } catch (err) {
        console.error('Error saving image:', err);
    }
};