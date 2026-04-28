import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../../components/RoomCard';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import rooms, { TIME_SLOTS } from '../../data/rooms';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../constants/theme';

// Tela de listagem de salas com filtro por andar, busca em tempo real
// e modal de reserva (CRUD persistido via AppDataContext)
export default function Salas() {
  const { addReservation, reservations } = useAppData();
  const { theme } = useTheme();
  const c = theme.colors;

  const [selectedFloor, setSelectedFloor] = useState(0); // 0 = todos
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Modal de reserva
  const [modalRoom, setModalRoom] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const floors = [...new Set(rooms.map((r) => r.floor))].sort();

  // Carregamento inicial (simulado)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Filtragem combinada: andar + busca em tempo real (diferencial 2)
  const filteredRooms = useMemo(() => {
    let list = rooms;
    if (selectedFloor !== 0) list = list.filter((r) => r.floor === selectedFloor);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          (r.currentClass || '').toLowerCase().includes(q) ||
          (r.nextClass || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedFloor, search]);

  const handleRoomPress = (room) => {
    if (selectedRoom && selectedRoom.id === room.id) {
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
    }
  };

  const openReserveModal = (room) => {
    setModalRoom(room);
    setSelectedSlot(null);
    setFeedback({ type: null, message: '' });
  };

  const closeModal = () => {
    setModalRoom(null);
    setSelectedSlot(null);
    setFeedback({ type: null, message: '' });
  };

  const handleConfirmReserve = async () => {
    if (!selectedSlot) {
      setFeedback({ type: 'error', message: 'Escolha um horario para reservar.' });
      return;
    }
    setReserving(true);
    const result = await addReservation({
      roomId: modalRoom.id,
      roomName: modalRoom.name,
      slot: selectedSlot,
    });
    setReserving(false);

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }
    setFeedback({ type: 'success', message: 'Reserva confirmada!' });
    setTimeout(closeModal, 1200);
  };

  // Verifica se ja existe reserva para um par sala+slot (visual no modal)
  const isSlotTaken = (slot) =>
    modalRoom &&
    reservations.some((r) => r.roomId === modalRoom.id && r.slot === slot);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Busca em tempo real (diferencial 2) */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar sala, tipo ou aula..."
      />

      {/* Filtros por andar */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: c.text }]}>Filtrar por andar:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: c.surface, borderColor: c.border },
                selectedFloor === 0 && { backgroundColor: c.primary, borderColor: c.primary },
              ]}
              onPress={() => setSelectedFloor(0)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: c.textMuted },
                  selectedFloor === 0 && { color: '#fff' },
                ]}
              >
                Todos os andares
              </Text>
            </TouchableOpacity>

            {floors.map((floor) => (
              <TouchableOpacity
                key={floor}
                style={[
                  styles.filterButton,
                  { backgroundColor: c.surface, borderColor: c.border },
                  selectedFloor === floor && { backgroundColor: c.primary, borderColor: c.primary },
                ]}
                onPress={() => setSelectedFloor(floor)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: c.textMuted },
                    selectedFloor === floor && { color: '#fff' },
                  ]}
                >
                  {floor}º Andar
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text style={[styles.resultCount, { color: c.textMuted }]}>
        {filteredRooms.length} sala{filteredRooms.length !== 1 ? 's' : ''} encontrada
        {filteredRooms.length !== 1 ? 's' : ''}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={c.primary} />
            <Text style={[styles.loadingText, { color: c.textMuted }]}>Carregando...</Text>
          </View>
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Nenhuma sala encontrada"
            message="Tente ajustar os filtros ou a busca"
          />
        ) : (
          filteredRooms.map((room) => (
            <View key={room.id}>
              <RoomCard room={room} onPress={() => handleRoomPress(room)} />

              {selectedRoom && selectedRoom.id === room.id && (
                <View style={[styles.detailCard, { backgroundColor: c.surface, borderColor: c.primary }]}>
                  <Text style={[styles.detailTitle, { color: c.primary }]}>Detalhes da sala</Text>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={18} color={c.primary} />
                    <Text style={[styles.detailText, { color: c.text }]}>
                      {room.name} — {room.floor}º Andar
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={18} color={c.primary} />
                    <Text style={[styles.detailText, { color: c.text }]}>
                      Capacidade: {room.capacity} pessoas
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="bookmark-outline" size={18} color={c.primary} />
                    <Text style={[styles.detailText, { color: c.text }]}>Tipo: {room.type}</Text>
                  </View>

                  {room.currentClass && (
                    <View style={styles.detailRow}>
                      <Ionicons name="book-outline" size={18} color={c.danger} />
                      <Text style={[styles.detailText, { color: c.danger }]}>
                        Em uso: {room.currentClass}
                      </Text>
                    </View>
                  )}

                  {room.nextClass && (
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={18} color={c.success} />
                      <Text style={[styles.detailText, { color: c.success }]}>
                        Próxima: {room.nextClass}
                      </Text>
                    </View>
                  )}

                  {room.status === 'manutencao' ? (
                    <View style={[styles.warningBox, { backgroundColor: c.warningSoft }]}>
                      <Ionicons name="warning-outline" size={18} color={c.warning} />
                      <Text style={[styles.warningText, { color: c.warning }]}>
                        Esta sala está em manutenção e não pode ser reservada.
                      </Text>
                    </View>
                  ) : (
                    <Button
                      label="Reservar esta sala"
                      icon="calendar-outline"
                      onPress={() => openReserveModal(room)}
                      style={{ marginTop: spacing.sm }}
                    />
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal
        visible={!!modalRoom}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: c.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.text }]}>
                Reservar {modalRoom?.name}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={c.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: c.textMuted }]}>
              Escolha o horário:
            </Text>

            <ScrollView style={styles.slotsScroll}>
              {TIME_SLOTS.map((slot) => {
                const taken = isSlotTaken(slot);
                const selected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    disabled={taken}
                    style={[
                      styles.slotItem,
                      { borderColor: c.border, backgroundColor: c.surfaceMuted },
                      selected && { backgroundColor: c.primary, borderColor: c.primary },
                      taken && { opacity: 0.45 },
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={selected ? '#fff' : c.textMuted}
                    />
                    <Text
                      style={[
                        styles.slotText,
                        { color: c.text },
                        selected && { color: '#fff', fontWeight: 'bold' },
                      ]}
                    >
                      {slot} {taken ? '(já reservado)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {feedback.type === 'error' ? (
              <View style={[styles.feedback, { backgroundColor: c.dangerSoft }]}>
                <Ionicons name="alert-circle" size={16} color={c.danger} />
                <Text style={[styles.feedbackText, { color: c.danger }]}>{feedback.message}</Text>
              </View>
            ) : null}
            {feedback.type === 'success' ? (
              <View style={[styles.feedback, { backgroundColor: c.successSoft }]}>
                <Ionicons name="checkmark-circle" size={16} color={c.success} />
                <Text style={[styles.feedbackText, { color: c.success }]}>{feedback.message}</Text>
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="secondary"
                onPress={closeModal}
                style={{ flex: 1 }}
              />
              <Button
                label="Confirmar"
                icon="checkmark"
                onPress={handleConfirmReserve}
                loading={reserving}
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
  container: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  filterSection: { marginTop: spacing.sm },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  filterText: { fontSize: 14, fontWeight: '500' },
  resultCount: { fontSize: 13, marginBottom: spacing.sm },
  center: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  loadingText: { fontSize: 14 },
  detailCard: {
    borderRadius: radius.md,
    borderLeftWidth: 4,
    padding: spacing.lg,
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
    gap: 10,
  },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailText: { fontSize: 14 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: 4,
  },
  warningText: { flex: 1, fontSize: 13 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalBox: {
    width: '100%',
    maxWidth: 460,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalSubtitle: { fontSize: 13, marginBottom: spacing.md },
  slotsScroll: { maxHeight: 260, marginBottom: spacing.md },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  slotText: { fontSize: 14 },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm + 2,
    borderRadius: 8,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: { flex: 1, fontSize: 13 },
  modalActions: { flexDirection: 'row', gap: spacing.sm },
});
