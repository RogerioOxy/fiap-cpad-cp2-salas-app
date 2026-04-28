import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius } from '../constants/theme';

// Botao reutilizavel com 3 variantes (primary, secondary, ghost),
// suporte a icone e estado de loading
export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const { theme } = useTheme();
  const c = theme.colors;

  const palette = {
    primary: {
      bg: disabled ? c.textMuted : c.primary,
      text: c.textInverse,
      border: 'transparent',
    },
    secondary: {
      bg: c.surface,
      text: c.primary,
      border: c.primary,
    },
    ghost: {
      bg: 'transparent',
      text: c.primary,
      border: 'transparent',
    },
  }[variant];

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={palette.text} />}
          <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    gap: spacing.sm,
    minHeight: 48,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
