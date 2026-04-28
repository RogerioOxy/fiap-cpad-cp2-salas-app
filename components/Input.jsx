import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius } from '../constants/theme';

// Input com label visivel, icone opcional e mensagem de erro inline
// Erros aparecem ABAIXO do campo em vermelho (sem alert/modal)
export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  icon,
  error,
}) {
  const { theme } = useTheme();
  const c = theme.colors;

  const borderColor = error ? c.danger : c.border;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: c.inputBg,
            borderColor,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={error ? c.danger : c.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: c.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
      </View>
      {error ? <Text style={[styles.errorText, { color: c.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs + 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
});
