import { Image, StyleSheet } from 'react-native'
import { Text, View } from './Themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const HomeHeaderComponent = () => {
    const { top } = useSafeAreaInsets()

    return (
        <View style={{ ...styles.container, paddingTop: top - 10 }}>
            <Image
                source={require('../assets/images/logo_transparent.png')}
                style={styles.logo}
                resizeMode="contain"
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

export { HomeHeaderComponent, HistoryHeaderComponent }

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
        fontSize: 30,
        fontWeight: 'bold',
    },
    logo: {
        width: 200,
        aspectRatio: 1,
    },
})