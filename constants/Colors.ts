import { useColorScheme } from "react-native";

const CaffyColors = {
  light: {
    // Backgrounds
    backgroundPrimary: '#F5E9DC', // Latte Beige
    backgroundSecondary: '#FFF9F3', // Foam White
    surface: '#FFFFFF', // clean surface for cards/containers

    // Text
    textPrimary: '#6F4E37', // Caffy Brown
    textSecondary: '#A47149', // Mocha Accent
    textMuted: '#9E9086', // Soft brown-gray
    textOnSurface: '#1A120B', // Very dark coffee

    // Accents
    accent: '#B5D2C0', // Mint Foam
    highlight: '#A47149', // Mocha Accent
    border: '#E0D3C5', // subtle border color
  },

  dark: {
    // Backgrounds
    backgroundPrimary: '#1A120B', // Dark Brew
    backgroundSecondary: '#2B1F17', // Rich coffee tone
    surface: '#3E2D25', // Card surfaces, darker than bg

    // Text
    textPrimary: '#F5E9DC', // Latte Beige
    textSecondary: '#D8BBA5', // Lighter mocha
    textMuted: '#B0A69E', // Soft neutral
    textOnSurface: '#FFF9F3', // Foam White

    // Accents
    accent: '#B5D2C0', // Mint Foam
    highlight: '#A47149', // Mocha Accent
    border: '#4D3C34', // Soft dark border
  },
};

export default CaffyColors;

export const useColors = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return CaffyColors[colorScheme];
}
