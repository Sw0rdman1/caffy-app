import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMonthMatrix, getMonthName } from '@/utils/calendarUtils';
import { useGroupedImages } from '@/hooks/useGroupedImages';
import CalendarGrid from '@/components/Calendar';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HistoryHeaderComponent, HomeHeaderComponent } from '@/components/HeaderComponent';
import { useColors } from '@/constants/Colors';


const HistoryScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { groupedImages, refresh } = useGroupedImages();
    const { backgroundPrimary } = useColors();

    useEffect(() => {
        refresh();
    }, []);



    const selectedImages = groupedImages[selectedDate.toDateString()] || [];

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={<HistoryHeaderComponent />}
            headerHeight={150}
        >
            <View style={styles.container}>


                <CalendarGrid
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    groupedImages={groupedImages}
                />

                <Text style={styles.dateLabel}>{selectedDate.toDateString()}</Text>

                <FlatList
                    data={selectedImages}
                    horizontal
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item.uri }} style={styles.previewImage} />
                    )}
                    contentContainerStyle={styles.imageRow}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ParallaxScrollView>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    dateLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    imageRow: {
        paddingBottom: 20,
    },
    previewImage: {
        width: 120,
        height: 180,
        borderRadius: 10,
        marginRight: 12,
    },
});
