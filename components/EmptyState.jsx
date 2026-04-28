import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants/theme';

// Componente de "lista vazia" exigido pelos requisitos de UX/UI
export default function EmptyState({ icon = 'information-circle-outline', title, message }) {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View style={styles.box}>
      <Ionicons name={icon} size={48} color={c.textMuted} />
      {title ? <Text style={[styles.title, { color: c.text }]}>{title}</Text> : null}
      {message ? <Text style={[styles.message, { color: c.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl + spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
