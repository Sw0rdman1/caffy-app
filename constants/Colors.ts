import { useColorScheme } from "react-native";

const CaffyColors = {
  light: {
    // Backgrounds
    backgroundPrimary: '#F5E9DC',
    backgroundSecondary: '#FFF9F3',
    surface: '#FFFFFF',

    // Text
    textPrimary: '#6F4E37',
    textSecondary: '#A47149',
    textMuted: '#9E9086',
    textOnSurface: '#1A120B',

    // Accents
    accent: '#B5D2C0',
    highlight: '#A47149',
    border: '#E0D3C5',

    // Status
    success: {
      text: '#2E5E4E',
      surface: '#D7E7DD',
    },
    error: {
      text: '#7A3B3F',
      surface: '#F8D7DA',
    },
  },

  dark: {
    // Backgrounds
    backgroundPrimary: '#1A120B',
    backgroundSecondary: '#2B1F17',
    surface: '#3E2D25',

    // Text
    textPrimary: '#F5E9DC',
    textSecondary: '#D8BBA5',
    textMuted: '#B0A69E',
    textOnSurface: '#FFF9F3',

    // Accents
    accent: '#B5D2C0',
    highlight: '#A47149',
    border: '#4D3C34',

    // Status
    success: {
      text: '#B5D2C0',
      surface: '#2E5E4E',
    },
    error: {
      text: '#F8D7DA',
      surface: '#7A3B3F',
    },
  },
};


export default CaffyColors;

export const useColors = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return CaffyColors[colorScheme];
}

export const isDarkTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark';
}
