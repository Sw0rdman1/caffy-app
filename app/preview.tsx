import { Image, StyleSheet, Text, View } from 'react-native'
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { checkImageForCoffee } from '@/utils/checkImageForCoffe';

const PreviewScreen = () => {
    const { imageUri } = useAppContext()
    const [loading, setLoading] = useState(true)
    const [isCoffeeImage, setIsCoffeeImage] = useState(false)


    useEffect(() => {
        const checkImage = async () => {
            const isCoffeOnImage = await checkImageForCoffee(imageUri || '')
            setIsCoffeeImage(isCoffeOnImage)
            setLoading(false)
        };

        checkImage();
    }, [imageUri]);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imageUri || '' }}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.content}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <Text>{isCoffeeImage ? 'This image contains coffee!' : 'No coffee detected.'}</Text>
                )}
            </View>
        </View>
    )
}

export default PreviewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})