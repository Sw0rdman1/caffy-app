import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { getMonthMatrix, getMonthName } from '@/utils/calendarUtils';
import { useColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 7 - 10;

type Props = {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    groupedImages: Record<string, { uri: string; timestamp: string }[]>;
};

const CalendarGrid = ({ selectedDate, onSelectDate, groupedImages }: Props) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const matrix = getMonthMatrix(currentMonth);
    const { backgroundSecondary } = useColors();

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

    return (
        <View style={[styles.calendar, { backgroundColor: backgroundSecondary }]}>
            <View style={styles.navRow}>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{getMonthName(currentMonth)} {currentMonth.getFullYear()}</Text>
                <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.weekHeader}>
                {daysInWeek.map(day => (
                    <Text key={day} style={styles.weekDay}>{day}</Text>
                ))}
            </View>
            <View style={styles.grid}>
                {matrix.map((week, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {week.map((day, colIndex) => {
                            if (!day) {
                                return <View key={`empty-${colIndex}`} style={[styles.cell, { width: cellSize, height: cellSize }]} />;
                            }

                            const dateStr = day.toDateString();
                            const images = groupedImages[dateStr] || [];
                            const firstImage = images[0]?.uri;
                            const extraCount = images.length > 1 ? images.length - 1 : 0;

                            return (
                                <TouchableOpacity
                                    key={dateStr}
                                    onPress={() => onSelectDate(day)}
                                    style={[
                                        styles.cell,
                                        { width: cellSize, height: cellSize },
                                        selectedDate.toDateString() === dateStr && styles.selectedCell,
                                    ]}
                                >
                                    {firstImage ? (
                                        <Image source={{ uri: firstImage }} style={[styles.image, { width: cellSize - 10, height: cellSize - 10 }]} />
                                    ) : (
                                        <Text style={styles.dayNumber}>{day.getDate()}</Text>
                                    )}
                                    {extraCount > 0 && (
                                        <View style={styles.extraBadge}>
                                            <Text style={styles.extraText}>+{extraCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>

    );
};

export default CalendarGrid;

const styles = StyleSheet.create({
    calendar: {
        width: '100%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 8,
        marginBottom: 16,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
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
    grid: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 8,
    },
    selectedCell: {
        borderWidth: 2,
        borderColor: '#6a4e3b',
    },
    dayNumber: {
        fontSize: 14,
        color: '#444',
    },
    image: {
        borderRadius: 6,
    },
    extraBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#000',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 6,
    },
    extraText: {
        fontSize: 10,
        color: '#fff',
    },
});
