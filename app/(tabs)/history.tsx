import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Share,
    Button,
    Platform,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useGroupedImages } from '@/hooks/useGroupedImages';
import CalendarGrid from '@/components/Calendar';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

    const { groupedImages, refresh } = useGroupedImages();
    const { backgroundPrimary } = useColors();

    useEffect(() => {
        refresh();
    }, []);

    const selectedImages = groupedImages[selectedDate.toDateString()] || [];

    const handleImagePress = (uri: string) => {
        setSelectedImageUri(uri);
        setModalVisible(true);
    };

    const handleDownload = async () => {
        if (!selectedImageUri) return;

        try {
            const fileUri = FileSystem.documentDirectory || '' + selectedImageUri.split('/').pop();
            await FileSystem.downloadAsync(selectedImageUri, fileUri);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await MediaLibrary.saveToLibraryAsync(fileUri);
                alert('Image saved to gallery!');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to save image');
        }
    };

    const handleShare = async () => {
        if (selectedImageUri) {
            try {
                await Share.share({ url: selectedImageUri });
            } catch (error) {
                alert('Failed to share image');
            }
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={
                <CalendarGrid
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    groupedImages={groupedImages}
                />
            }
            headerHeight={450}
        >
            <View style={styles.container}>
                <Text style={styles.dateLabel}>
                    {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </Text>

                <FlatList
                    data={selectedImages}
                    horizontal
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleImagePress(item.uri)}
                        >
                            <Image source={{ uri: item.uri }} style={styles.previewImage} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.imageRow}
                    showsHorizontalScrollIndicator={false}
                />

                <Modal visible={modalVisible} transparent animationType="fade">
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />

                    </TouchableOpacity>
                    <View style={styles.modalOverlay}>
                        <Image source={{ uri: selectedImageUri || '' }} style={styles.fullImage} />
                        <View style={styles.iconButtonRow}>
                            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                                <Ionicons name="share-social-outline" size={26} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
                                <Ionicons name="download-outline" size={26} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </ParallaxScrollView>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 14,
    },
    dateLabel: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    imageRow: {
        minWidth: '100%',
        paddingBottom: 20,
    },
    previewImage: {
        width: 140,
        height: 200,
        borderRadius: 10,
        marginRight: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
    fullImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'contain',
        borderRadius: 12,
        marginBottom: 20,
    },
    iconButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    iconButton: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 50,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 50,
        zIndex: 1,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
