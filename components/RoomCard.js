import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius } from '../constants/theme';

// Componente reutilizavel para exibir informacoes de uma sala
// Adaptado ao tema dinamico (light/dark) no CP2
export default function RoomCard({ room, onPress }) {
  const { theme } = useTheme();
  const c = theme.colors;

  const getIcon = () => {
    switch (room.type) {
      case 'Laboratorio':
        return 'desktop-outline';
      case 'Auditorio':
        return 'megaphone-outline';
      default:
        return 'school-outline';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.surface, shadowColor: c.shadow }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: c.primarySoft }]}>
          <Ionicons name={getIcon()} size={24} color={c.primary} />
        </View>
        <View style={styles.titleArea}>
          <Text style={[styles.name, { color: c.text }]}>{room.name}</Text>
          <Text style={[styles.type, { color: c.textMuted }]}>{room.type}</Text>
        </View>
        <StatusBadge status={room.status} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={c.textMuted} />
          <Text style={[styles.detailText, { color: c.textMuted }]}>{room.capacity} lugares</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="layers-outline" size={16} color={c.textMuted} />
          <Text style={[styles.detailText, { color: c.textMuted }]}>{room.floor}º andar</Text>
        </View>
      </View>

      {room.currentClass && (
        <View style={[styles.classInfo, { borderTopColor: c.borderSoft }]}>
          <Ionicons name="book-outline" size={14} color={c.danger} />
          <Text style={[styles.classText, { color: c.danger }]}>Agora: {room.currentClass}</Text>
        </View>
      )}

      {room.nextClass && room.status === 'disponivel' && (
        <View style={[styles.classInfo, { borderTopColor: c.borderSoft }]}>
          <Ionicons name="time-outline" size={14} color={c.success} />
          <Text style={[styles.classText, { color: c.success }]}>Próxima: {room.nextClass}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleArea: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 12,
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 13,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  classText: {
    fontSize: 13,
  },
});
