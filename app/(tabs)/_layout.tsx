import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons size={28} style={{ marginBottom: 0 }} {...props} />;
}

export default function TabLayout() {
    const { highlight, backgroundPrimary, textMuted } = useColors();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: highlight,
                tabBarInactiveTintColor: textMuted,
                tabBarStyle: {
                    backgroundColor: backgroundPrimary
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
                }}
            />
        </Tabs>
    );
}