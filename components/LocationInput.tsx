import { StyleSheet, TextInput, View } from 'react-native'
import { Text } from './Themed';
import { useColors } from '@/constants/Colors';

interface Props {
    location: string;
    setLocation: (location: string) => void;
}

const LocationInput = ({ location, setLocation }: Props) => {
    const { textMuted, surface, textPrimary, highlight } = useColors();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Where are you drinking this coffee?</Text>
            <TextInput
                style={[styles.input, {
                    backgroundColor: surface,
                    color: textPrimary,
                    borderColor: highlight,
                }]}
                placeholder="Coffee Shop, City, Country"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor={textMuted}
            />
        </View>
    )
}

export default LocationInput

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 18,
        fontWeight: '500',
    },
})