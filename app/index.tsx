import HeaderComponent from '@/components/HeaderComponent';
import ParallaxScrollView, { HEADER_HEIGHT } from '@/components/ParallaxScrollView';
import { Text } from '@/components/Themed';
import { useColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
    const { backgroundPrimary, backgroundSecondary, textSecondary, highlight } = useColors();

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: backgroundPrimary, dark: backgroundPrimary }}
            headerComponent={<HeaderComponent />}
        >
            <View style={[styles.contentContainer, { backgroundColor: backgroundSecondary }]}>
                <Text style={styles.title}>
                    Welcome to Your
                </Text>
                <Text style={styles.title}>
                    Coffee Journal!
                </Text>
                <Text style={{ ...styles.subtitle, color: textSecondary }}>
                    Track your coffee journey.
                </Text>
                <TouchableOpacity style={{ ...styles.buttonContainer, backgroundColor: backgroundPrimary }}>
                    <Ionicons name='camera' size={62} color={highlight} />
                    <Text style={{ ...styles.buttonText, color: highlight }}>
                        Snap your daily brew
                    </Text>
                </TouchableOpacity>

            </View>
        </ParallaxScrollView >
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 40,
        height: height - HEADER_HEIGHT,
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Quicksand',
        width: '80%',

    },
    subtitle: {
        fontSize: 26,
        textAlign: 'center',
        marginVertical: 16,
        fontFamily: 'Caveat',
        width: '80%',
    },
    buttonContainer: {
        width: '60%',
        aspectRatio: 1,
        padding: 16,
        borderRadius: 24,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Quicksand',
    },

});
