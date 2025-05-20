import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';
import { useColors } from '@/constants/Colors';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
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
    const { showToast, displayConfetti } = useToast();
    const { backgroundSecondary, highlight } = useColors();

    useEffect(() => {
        const checkImage = async () => {
            const isCoffee = await checkImageForCoffee(imageUri || '');
            setIsCoffeeImage(isCoffee);
            setLoading(false);

            if (isCoffee) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        };

        checkImage();
    }, [imageUri]);

    const onSaveImageSuccess = () => {
        router.push('/history');
        showToast('Image saved successfully!', 'success');
        displayConfetti();
    };

    const saveImageToStorageHandler = async () => {
        await saveImageToStorage(
            imageUri || '',
            location,
            onSaveImageSuccess,
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text style={styles.loadingText}>Analyzing your coffee shot…</Text>
                </View>
            );
        }

        if (isCoffeeImage) {
            return (
                <>
                    <LocationInput location={location} setLocation={setLocation} />
                    <TouchableOpacity onPress={saveImageToStorageHandler} style={[styles.saveButton, { backgroundColor: highlight }]}>
                        <Text style={styles.saveButtonText}>💾 Save This Shot</Text>
                    </TouchableOpacity>
                </>
            );
        }

        return (
            <CoffeErrorRecognition />
        );
    }



    return (
        <View style={{ flex: 1, backgroundColor: backgroundSecondary }}>
            <BackButton />
            <Image source={{ uri: imageUri || '' }} style={styles.image} resizeMode="cover" />
            <View style={styles.resultContainer}>
                {renderContent()}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
