import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius } from '../constants/theme';

// Diferencial 2: Busca em tempo real
// Campo de texto controlado que dispara filtragem dinamica em listas
export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...' }) {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: c.surface, borderColor: c.border },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={c.textMuted} />
      <TextInput
        style={[styles.input, { color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={c.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: spacing.sm + 2,
  },
});
