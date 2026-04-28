import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants/theme';

// Loading spinner global (ActivityIndicator) usado durante operacoes assincronas
export default function Loading({ message = 'Carregando...' }) {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View style={[styles.box, { backgroundColor: c.background }]}>
      <ActivityIndicator size="large" color={c.primary} />
      {message ? <Text style={[styles.label, { color: c.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  label: {
    fontSize: 14,
  },
});
