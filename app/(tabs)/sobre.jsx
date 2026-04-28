import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import Button from '../../components/Button';
import { spacing, radius } from '../../constants/theme';

// Tela Sobre — informacoes do projeto, integrantes, sessao do usuario e logout
export default function Sobre() {
  const { user, logout } = useAuth();
  const { reservations } = useAppData();
  const { theme, mode } = useTheme();
  const c = theme.colors;

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    // O AuthGate no _layout.js redireciona para /(auth)/login
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={{ padding: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Card de sessao do usuario */}
      {user && (
        <View
          style={[
            styles.userCard,
            { backgroundColor: c.surface, borderColor: c.borderSoft },
          ]}
        >
          <View style={[styles.userAvatar, { backgroundColor: c.primary }]}>
            <Text style={styles.userAvatarText}>
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: c.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: c.textMuted }]}>{user.email}</Text>
            <Text style={[styles.userExtra, { color: c.primary }]}>
              {reservations.length} reserva{reservations.length === 1 ? '' : 's'} ativa{reservations.length === 1 ? '' : 's'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.logoutIconBtn, { backgroundColor: c.dangerSoft }]}
            onPress={() => setConfirmLogout(true)}
          >
            <Ionicons name="log-out-outline" size={20} color={c.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Header do app */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: c.primarySoft }]}>
          <Ionicons name="school" size={48} color={c.primary} />
        </View>
        <Text style={[styles.appName, { color: c.text }]}>FIAP Salas</Text>
        <Text style={[styles.version, { color: c.textMuted }]}>Versao 2.0.0 (CP2)</Text>
        <Text style={[styles.themeHint, { color: c.textMuted }]}>
          Tema atual: {mode === 'dark' ? 'Escuro' : 'Claro'}
        </Text>
      </View>

      {/* Sobre o projeto */}
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Sobre o Projeto</Text>
        <Text style={[styles.description, { color: c.textMuted }]}>
          O FIAP Salas e um aplicativo mobile que permite aos alunos da FIAP
          consultar e reservar salas de aula, laboratorios e auditorios.
        </Text>
        <Text style={[styles.description, { color: c.textMuted }]}>
          Esta versao (CP2) evolui o MVP do CP1 adicionando autenticacao com
          AsyncStorage, gerenciamento de estado global via Context API,
          formularios validados, persistencia de reservas, busca em tempo real
          e suporte a tema claro/escuro.
        </Text>
      </View>

      {/* Funcionalidades */}
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Funcionalidades</Text>
        {[
          'Cadastro e login com persistencia (AsyncStorage)',
          'Sessao lembrada — login automatico ao reabrir o app',
          'Reservas de salas com CRUD persistido por usuario',
          'Busca em tempo real e filtro por andar',
          'Validacao inline de todos os formularios',
          'Tema claro/escuro com preferencia salva',
          'Navegacao protegida (rotas privadas)',
        ].map((label) => (
          <View key={label} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={c.success} />
            <Text style={[styles.featureText, { color: c.textMuted }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Tecnologias */}
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Tecnologias</Text>
        <View style={styles.techRow}>
          {[
            'React Native',
            'Expo',
            'Expo Router',
            'Context API',
            'AsyncStorage',
            'useState',
            'useEffect',
            'useContext',
            'StyleSheet',
          ].map((t) => (
            <View key={t} style={[styles.techBadge, { backgroundColor: c.primarySoft }]}>
              <Text style={[styles.techText, { color: c.primary }]}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Integrantes */}
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Integrantes do Grupo</Text>

        <View style={[styles.memberCard, { backgroundColor: c.surfaceMuted }]}>
          <View style={[styles.memberAvatar, { backgroundColor: c.primary }]}>
            <Text style={styles.avatarText}>RD</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={[styles.memberName, { color: c.text }]}>
              Rogerio Deligi Ferreira Filho
            </Text>
            <Text style={[styles.memberRm, { color: c.textMuted }]}>RM561942</Text>
          </View>
        </View>

        <View style={[styles.memberCard, { backgroundColor: c.surfaceMuted }]}>
          <View style={[styles.memberAvatar, { backgroundColor: c.primary }]}>
            <Text style={styles.avatarText}>MF</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={[styles.memberName, { color: c.text }]}>
              Maria Fernanda Garavelli Dantas
            </Text>
            <Text style={[styles.memberRm, { color: c.textMuted }]}>RM562686</Text>
          </View>
        </View>
      </View>

      {/* Disciplina */}
      <View style={[styles.section, { backgroundColor: c.surface }]}>
        <Text style={[styles.sectionTitle, { color: c.primary }]}>Informacoes Academicas</Text>
        {[
          ['Disciplina:', 'Cross-Platform Application Development'],
          ['Professor:', 'Hercules Ramos'],
          ['Curso:', 'Ciencia da Computacao - 2o Ano'],
          ['Instituicao:', 'FIAP'],
          ['Checkpoint:', '02 (CP2) - 2026'],
        ].map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: c.text }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: c.textMuted }]}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Link FIAP */}
      <TouchableOpacity
        style={[styles.linkButton, { backgroundColor: c.primary }]}
        onPress={() => Linking.openURL('https://www.fiap.com.br')}
      >
        <Ionicons name="globe-outline" size={20} color="#fff" />
        <Text style={styles.linkText}>Visitar site da FIAP</Text>
      </TouchableOpacity>

      <Button
        label="Sair da minha conta"
        variant="secondary"
        icon="log-out-outline"
        onPress={() => setConfirmLogout(true)}
        style={{ marginTop: spacing.md }}
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: c.textMuted }]}>
          FIAP - Checkpoint 2 - CPAD - 2026
        </Text>
      </View>

      {/* Modal de confirmacao de logout */}
      <Modal
        visible={confirmLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmLogout(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: c.surface }]}>
            <Ionicons name="log-out" size={40} color={c.primary} />
            <Text style={[styles.modalTitle, { color: c.text }]}>Sair da conta?</Text>
            <Text style={[styles.modalDesc, { color: c.textMuted }]}>
              Voce precisara fazer login novamente para acessar suas reservas.
            </Text>
            <View style={styles.modalActions}>
              <Button
                label="Voltar"
                variant="secondary"
                onPress={() => setConfirmLogout(false)}
                style={{ flex: 1 }}
              />
              <Button
                label="Sair"
                icon="log-out-outline"
                onPress={handleLogout}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  userName: { fontSize: 15, fontWeight: 'bold' },
  userEmail: { fontSize: 12, marginTop: 2 },
  userExtra: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  logoutIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: { alignItems: 'center', marginBottom: spacing.xxl, paddingTop: spacing.sm },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: { fontSize: 24, fontWeight: 'bold' },
  version: { fontSize: 14, marginTop: 4 },
  themeHint: { fontSize: 12, marginTop: 2 },

  section: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.md },
  description: { fontSize: 14, lineHeight: 22, marginBottom: spacing.sm },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: spacing.sm,
  },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: { fontSize: 13, fontWeight: '600' },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontWeight: '600' },
  memberRm: { fontSize: 13, marginTop: 2 },

  infoRow: { flexDirection: 'row', marginBottom: spacing.sm, gap: 4 },
  infoLabel: { fontSize: 14, fontWeight: '600' },
  infoValue: { flex: 1, fontSize: 14 },

  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md + 2,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  linkText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  footer: { alignItems: 'center', paddingVertical: spacing.xl },
  footerText: { fontSize: 12 },

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
  modalDesc: { fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
  modalActions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
});
