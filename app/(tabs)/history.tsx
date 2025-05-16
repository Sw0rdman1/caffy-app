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

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 7 - 8;
const daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HistoryScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { groupedImages, refresh } = useGroupedImages();
    const { backgroundPrimary } = useColors();

    useEffect(() => {
        refresh();
    }, []);

    const handlePrevMonth = () => {
        const prev = new Date(currentMonth);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentMonth(prev);
    };

    const handleNextMonth = () => {
        const next = new Date(currentMonth);
        next.setMonth(next.getMonth() + 1);
        setCurrentMonth(next);
    };

    const selectedImages = groupedImages[selectedDate.toDateString()] || [];

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={<HistoryHeaderComponent />}
            headerHeight={150}
        >
            <View style={styles.container}>
                <View style={styles.navRow}>
                    <TouchableOpacity onPress={handlePrevMonth}><Text style={styles.navText}>{'<'}</Text></TouchableOpacity>
                    <Text style={styles.monthTitle}>{getMonthName(currentMonth)} {currentMonth.getFullYear()}</Text>
                    <TouchableOpacity onPress={handleNextMonth}><Text style={styles.navText}>{'>'}</Text></TouchableOpacity>
                </View>

                <View style={styles.weekHeader}>
                    {daysInWeek.map(day => (
                        <Text key={day} style={styles.weekDay}>{day}</Text>
                    ))}
                </View>

                <CalendarGrid
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    groupedImages={groupedImages}
                    cellSize={cellSize}
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
        padding: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4,
    },
    navText: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 16,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    weekHeader: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 4,
    },
    weekDay: {
        width: cellSize,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
        color: '#444',
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
