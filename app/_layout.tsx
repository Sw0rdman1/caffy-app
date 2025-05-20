import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/context/ToastContext';

export {
  ErrorBoundary,
} from 'expo-router';


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
    <ToastProvider>
      <AppProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </AppProvider>
    </ToastProvider>
  );
}

