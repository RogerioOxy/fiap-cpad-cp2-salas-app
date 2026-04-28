import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { spacing, radius } from '../../constants/theme';

// Tela de listagem das reservas do usuario logado
// Reservas sao persistidas no AsyncStorage por email (ver AppDataContext)
export default function Reservas() {
  const { reservations, removeReservation, loading } = useAppData();
  const { theme } = useTheme();
  const c = theme.colors;
  const router = useRouter();

  const [confirmId, setConfirmId] = useState(null);
  const [removing, setRemoving] = useState(false);

  const handleConfirmCancel = async () => {
    if (!confirmId) return;
    setRemoving(true);
    await removeReservation(confirmId);
    setRemoving(false);
    setConfirmId(null);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.primary} size="large" />
        <Text style={[styles.loadingText, { color: c.textMuted }]}>
          Carregando suas reservas...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {reservations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="calendar-outline"
            title="Nenhuma reserva ainda"
            message="Reserve uma sala disponível na aba Salas e ela aparecerá aqui."
          />
          <Button
            label="Ver salas disponíveis"
            icon="grid-outline"
            onPress={() => router.push('/(tabs)/salas')}
            style={{ marginHorizontal: spacing.xl, marginTop: spacing.md }}
          />
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: c.surface, shadowColor: c.shadow },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: c.primarySoft }]}>
                  <Ionicons name="calendar" size={20} color={c.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: c.text }]}>{item.roomName}</Text>
                  <Text style={[styles.cardSlot, { color: c.textMuted }]}>{item.slot}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.cancelBtn, { backgroundColor: c.dangerSoft }]}
                  onPress={() => setConfirmId(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color={c.danger} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.cardCreated, { color: c.textMuted }]}>
                Reservado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
        />
      )}

      {/* Modal de confirmacao de cancelamento */}
      <Modal
        visible={!!confirmId}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmId(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: c.surface }]}>
            <Ionicons name="alert-circle" size={40} color={c.warning} />
            <Text style={[styles.modalTitle, { color: c.text }]}>Cancelar reserva?</Text>
            <Text style={[styles.modalText, { color: c.textMuted }]}>
              A reserva será removida e o horário liberado para outros usuários.
            </Text>
            <View style={styles.modalActions}>
              <Button
                label="Voltar"
                variant="secondary"
                onPress={() => setConfirmId(null)}
                style={{ flex: 1 }}
              />
              <Button
                label="Cancelar"
                icon="trash-outline"
                onPress={handleConfirmCancel}
                loading={removing}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { fontSize: 14 },
  emptyWrap: { flex: 1, justifyContent: 'center' },
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSlot: { fontSize: 13, marginTop: 2 },
  cancelBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCreated: {
    fontSize: 12,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginTop: spacing.sm },
  modalText: { fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
  modalActions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
});
