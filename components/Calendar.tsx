import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getMonthMatrix } from '@/utils/calendarUtils';

type Props = {
    currentMonth: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    groupedImages: Record<string, { uri: string; timestamp: string }[]>;
    cellSize: number;
};

const CalendarGrid = ({
    currentMonth,
    selectedDate,
    onSelectDate,
    groupedImages,
    cellSize,
}: Props) => {
    const matrix = getMonthMatrix(currentMonth);

    return (
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
    );
};

export default CalendarGrid;

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
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
