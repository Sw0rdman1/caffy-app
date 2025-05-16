import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedImage = {
    uri: string;
    timestamp: string;
};

type GroupedImages = Record<string, SavedImage[]>;

export const useGroupedImages = () => {
    const [groupedImages, setGroupedImages] = useState<GroupedImages>({});

    const refresh = async () => {
        try {
            const json = await AsyncStorage.getItem('savedImages');
            const saved: SavedImage[] = json ? JSON.parse(json) : [];

            const grouped: GroupedImages = {};

            for (const item of saved) {
                const dateKey = new Date(item.timestamp).toDateString();
                if (!grouped[dateKey]) grouped[dateKey] = [];
                grouped[dateKey].push(item);
            }

            setGroupedImages(grouped);
        } catch (err) {
            console.error('Failed to load saved images:', err);
        }
    };

    return { groupedImages, refresh };
};
