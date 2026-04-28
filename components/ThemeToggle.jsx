import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Botao para alternar entre tema claro e escuro
// Usado no header do app
export default function ThemeToggle({ size = 22, color }) {
  const { mode, toggleTheme, theme } = useTheme();
  const iconColor = color || theme.colors.textInverse;

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.btn} accessibilityLabel="Alternar tema">
      <Ionicons
        name={mode === 'dark' ? 'sunny' : 'moon'}
        size={size}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
