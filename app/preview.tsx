import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/constants/Colors';

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
});
