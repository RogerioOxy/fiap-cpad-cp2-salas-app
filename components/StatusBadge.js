import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Componente reutilizavel para exibir o status de uma sala
// As cores de feedback (verde/vermelho/amarelo) sao consistentes em ambos os temas
export default function StatusBadge({ status }) {
  const { theme } = useTheme();
  const c = theme.colors;

  const getStatusInfo = () => {
    switch (status) {
      case 'disponivel':
        return { label: 'Disponivel', color: c.success, bg: c.successSoft };
      case 'ocupada':
        return { label: 'Ocupada', color: c.danger, bg: c.dangerSoft };
      case 'manutencao':
        return { label: 'Manutencao', color: c.warning, bg: c.warningSoft };
      default:
        return { label: 'Indefinido', color: c.textMuted, bg: c.surfaceMuted };
    }
  };

  const info = getStatusInfo();

  return (
    <View style={[styles.badge, { backgroundColor: info.bg }]}>
      <View style={[styles.dot, { backgroundColor: info.color }]} />
      <Text style={[styles.text, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
