import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import rooms from '../../data/rooms';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/Loading';
import { spacing, radius } from '../../constants/theme';

// Tela inicial — exibe saudacao personalizada + estatisticas + acesso rapido
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { reservations } = useAppData();
  const { theme } = useTheme();
  const c = theme.colors;

  const [stats, setStats] = useState({ total: 0, disponiveis: 0, ocupadas: 0 });
  const [loading, setLoading] = useState(true);

  // useEffect simulando carregamento (Aula 04) — calcula estatisticas das salas
  useEffect(() => {
    const t = setTimeout(() => {
      const disponiveis = rooms.filter((r) => r.status === 'disponivel').length;
      const ocupadas = rooms.filter((r) => r.status === 'ocupada').length;
      setStats({ total: rooms.length, disponiveis, ocupadas });
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loading message="Carregando salas..." />;

  const firstName = user?.name?.split(' ')[0] || 'aluno';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ padding: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner principal com saudacao personalizada */}
      <View style={[styles.banner, { backgroundColor: c.primary }]}>
        <Text style={styles.bannerHi}>Ola, {firstName}!</Text>
        <Text style={styles.bannerTitle}>FIAP Salas</Text>
        <Text style={styles.bannerSubtitle}>
          Consulte a disponibilidade e reserve salas em tempo real
        </Text>
      </View>

      {/* Cards de estatisticas */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: c.successSoft }]}>
          <Text style={[styles.statNumber, { color: c.success }]}>{stats.disponiveis}</Text>
          <Text style={[styles.statLabel, { color: c.text }]}>Disponiveis</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.dangerSoft }]}>
          <Text style={[styles.statNumber, { color: c.danger }]}>{stats.ocupadas}</Text>
          <Text style={[styles.statLabel, { color: c.text }]}>Ocupadas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.primarySoft }]}>
          <Text style={[styles.statNumber, { color: c.primary }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: c.text }]}>Total</Text>
        </View>
      </View>

      {/* Card minhas reservas (resumo rapido) */}
      <TouchableOpacity
        style={[styles.reservasCard, { backgroundColor: c.surface, borderColor: c.borderSoft }]}
        onPress={() => router.push('/(tabs)/reservas')}
        activeOpacity={0.7}
      >
        <View style={[styles.reservasIcon, { backgroundColor: c.primarySoft }]}>
          <Ionicons name="calendar" size={22} color={c.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.reservasTitle, { color: c.text }]}>Minhas reservas</Text>
          <Text style={[styles.reservasSubtitle, { color: c.textMuted }]}>
            {reservations.length === 0
              ? 'Voce ainda nao tem reservas. Toque para agendar!'
              : `${reservations.length} reserva${reservations.length === 1 ? '' : 's'} ativa${reservations.length === 1 ? '' : 's'}.`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
      </TouchableOpacity>

      {/* CTA para listagem de salas */}
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: c.primary }]}
        onPress={() => router.push('/(tabs)/salas')}
      >
        <Ionicons name="search" size={20} color="#fff" />
        <Text style={styles.ctaText}>Ver todas as salas</Text>
      </TouchableOpacity>

      {/* Info cards - como funciona */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: c.text }]}>Como funciona?</Text>

        <View style={[styles.infoCard, { backgroundColor: c.surface }]}>
          <Ionicons name="eye-outline" size={24} color={c.primary} />
          <View style={styles.infoTextArea}>
            <Text style={[styles.infoCardTitle, { color: c.text }]}>Consulte</Text>
            <Text style={[styles.infoCardDesc, { color: c.textMuted }]}>
              Veja quais salas estao livres agora
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: c.surface }]}>
          <Ionicons name="bookmark-outline" size={24} color={c.primary} />
          <View style={styles.infoTextArea}>
            <Text style={[styles.infoCardTitle, { color: c.text }]}>Reserve</Text>
            <Text style={[styles.infoCardDesc, { color: c.textMuted }]}>
              Agende sua sala em poucos toques
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: c.surface }]}>
          <Ionicons name="time-outline" size={24} color={c.primary} />
          <View style={styles.infoTextArea}>
            <Text style={[styles.infoCardTitle, { color: c.text }]}>Planeje</Text>
            <Text style={[styles.infoCardDesc, { color: c.textMuted }]}>
              Veja a proxima aula agendada em cada sala
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
  },
  bannerHi: {
    fontSize: 14,
    color: '#FFD1DC',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFD1DC',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  reservasCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  reservasIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reservasTitle: { fontSize: 15, fontWeight: 'bold' },
  reservasSubtitle: { fontSize: 13, marginTop: 2 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  infoSection: { marginBottom: spacing.xl },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  infoTextArea: { flex: 1 },
  infoCardTitle: { fontSize: 14, fontWeight: 'bold' },
  infoCardDesc: { fontSize: 12, marginTop: 2 },
});
