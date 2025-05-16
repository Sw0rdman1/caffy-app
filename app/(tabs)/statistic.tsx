import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { useColors } from '@/constants/Colors'
import { StatisticHeaderComponent } from '@/components/HeaderComponent'

const StatisticScreen = () => {
    const { backgroundPrimary, backgroundSecondary } = useColors()
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={<StatisticHeaderComponent />}
            headerHeight={200}
        >
            <View style={{ flex: 1, backgroundColor: backgroundSecondary }}>
                <Text>StatisticScreen</Text>
            </View>
        </ParallaxScrollView>
    )
}

export default StatisticScreen

const styles = StyleSheet.create({})