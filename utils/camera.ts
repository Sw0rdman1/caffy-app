import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const getCameraPermissionsAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
        Alert.alert(
            'Permission Denied',
            'Camera access is required to take photos.',
            [{ text: 'OK' }]
        );
        return;
    }
}
