import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Playfair: require('../assets/fonts/PlayfairDisplay.ttf'),
    Quicksand: require('../assets/fonts/Quicksand.ttf'),
    Caveat: require('../assets/fonts/Caveat.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </Stack>
    </ThemeProvider>
  );
}

