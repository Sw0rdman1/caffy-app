import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useColors } from '@/constants/Colors';
import { HistoryHeaderComponent } from '@/components/HeaderComponent';

type SavedImage = {
    uri: string;
    timestamp: string;
};

const HistoryScreen = () => {
    const [todayImages, setTodayImages] = useState<SavedImage[]>([]);
    const { backgroundPrimary, backgroundSecondary, textSecondary } = useColors();

    useEffect(() => {
        const loadTodayImages = async () => {
            try {
                const json = await AsyncStorage.getItem('savedImages');
                const saved: SavedImage[] = json ? JSON.parse(json) : [];

                const todayDate = new Date().toDateString();

                const todays = saved.filter(img => {
                    const imgDate = new Date(img.timestamp).toDateString();
                    return imgDate === todayDate;
                });

                setTodayImages(todays);
            } catch (err) {
                console.error('Failed to load saved images:', err);
            }
        };

        loadTodayImages();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={<HistoryHeaderComponent />}
            headerHeight={150}
        >
            <View style={[styles.container, { backgroundColor: backgroundSecondary }]}>
                <Text style={styles.title}>Today's Coffee Journal</Text>
                {todayImages.length === 0 ? (
                    <Text style={styles.empty}>No images saved for today.</Text>
                ) : (
                    todayImages.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img.uri }}
                            style={styles.image}
                        />
                    ))
                )}
            </View>
        </ParallaxScrollView >

    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    empty: {
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
});
