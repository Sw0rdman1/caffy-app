import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const SCREEN_WIDTH = Dimensions.get('window').width;

type SavedImage = {
    uri: string;
    timestamp: string;
};

const HistoryScreen = () => {
    const [groupedImages, setGroupedImages] = useState<Record<string, SavedImage[]>>({});
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
    const [calendarMarkedDates, setCalendarMarkedDates] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadImages = async () => {
            const json = await AsyncStorage.getItem('savedImages');
            const saved: SavedImage[] = json ? JSON.parse(json) : [];

            const grouped: Record<string, SavedImage[]> = {};
            const marked: Record<string, any> = {};

            for (const item of saved) {
                const dateKey = new Date(item.timestamp).toDateString();
                if (!grouped[dateKey]) grouped[dateKey] = [];
                grouped[dateKey].push(item);
            }

            // Convert date keys to 'YYYY-MM-DD' for calendar
            for (const dateStr in grouped) {
                const isoDate = new Date(dateStr).toISOString().split('T')[0];
                const image = grouped[dateStr][0];
                const count = grouped[dateStr].length;

                marked[isoDate] = {
                    customStyles: {
                        container: {
                            borderRadius: 20,
                            overflow: 'hidden',
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        text: {
                            color: 'transparent',
                        },
                    },
                    thumbnail: image.uri,
                    extraCount: count > 1 ? count - 1 : 0,
                };
            }

            setGroupedImages(grouped);
            setCalendarMarkedDates(marked);
        };

        loadImages();
    }, []);

    const getImagesForSelectedDate = () => {
        return groupedImages[selectedDate] || [];
    };

    const renderDay = ({ date, state }) => {
        const iso = date.dateString;
        const fullDateStr = new Date(iso).toDateString();
        const mark = calendarMarkedDates[iso];

        if (mark) {
            return (
                <View style={styles.dayContainer}>
                    <Image source={{ uri: mark.thumbnail }} style={styles.thumbnail} />
                    {mark.extraCount > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>+{mark.extraCount}</Text>
                        </View>
                    )}
                </View>
            );
        } else {
            return (
                <View style={styles.emptyDay}>
                    <Text style={{ fontSize: 10, color: '#ccc' }}>{date.day}</Text>
                </View>
            );
        }
    };

    const onDateSelect = (day: { dateString: string }) => {
        const dateStr = new Date(day.dateString).toDateString();
        setSelectedDate(dateStr);
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDateSelect}
                markingType={'custom'}
                dayComponent={({ date, state }) =>
                    renderDay({ date, state })
                }
                style={styles.calendar}
            />

            <Text style={styles.dateText}>
                {selectedDate}
            </Text>

            <FlatList
                horizontal
                data={getImagesForSelectedDate()}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item.uri }}
                        style={styles.scrollImage}
                        resizeMode="cover"
                    />
                )}
                contentContainerStyle={styles.imageScroll}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
    },
    calendar: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    imageScroll: {
        paddingHorizontal: 16,
    },
    scrollImage: {
        width: 120,
        height: 180,
        borderRadius: 12,
        marginRight: 12,
    },
    dayContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    countBadge: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        backgroundColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    countText: {
        color: '#fff',
        fontSize: 10,
    },
    emptyDay: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
