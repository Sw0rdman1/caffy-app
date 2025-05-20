import { StyleSheet } from 'react-native'
import { Text, View } from './Themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { isDarkTheme } from '@/constants/Colors'

const HomeHeaderComponent = () => {
    const { top } = useSafeAreaInsets()
    const darkTheme = isDarkTheme()


    return (
        <View style={{ ...styles.container, paddingTop: top - 10 }}>
            <Image
                source={darkTheme ?
                    require('../assets/images/logo_transparent_dark.png') :
                    require('../assets/images/logo_transparent_light.png')
                }
                style={styles.logo}
                contentFit="contain"
                transition={1000}
                cachePolicy='memory-disk'
            />
        </View>
    )
}

const HistoryHeaderComponent = () => {
    const { top } = useSafeAreaInsets()

    return (
        <View style={{ ...styles.historyContainer, paddingTop: top - 10 }}>
            <Text style={styles.title}>Your Coffe Journey</Text>
        </View>
    )
}

const StatisticHeaderComponent = () => {
    const { top } = useSafeAreaInsets()

    return (
        <View style={{ ...styles.historyContainer, paddingTop: top - 10 }}>
            <Text style={styles.title}>Your Coffe Stats</Text>
        </View>
    )
}

export { HomeHeaderComponent, HistoryHeaderComponent, StatisticHeaderComponent }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    historyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    logo: {
        width: 200,
        aspectRatio: 1,
    },
})