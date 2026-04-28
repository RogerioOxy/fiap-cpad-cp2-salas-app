import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ThemeToggle from '../../components/ThemeToggle';
import { spacing } from '../../constants/theme';

// Tela de Cadastro com validacao inline (campo a campo)
// Persiste o novo usuario no AsyncStorage e ja loga em seguida
export default function CadastroScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'O nome completo é obrigatório.';
    else if (name.trim().split(/\s+/).length < 2)
      next.name = 'Informe nome e sobrenome.';

    if (!email.trim()) next.email = 'O e-mail é obrigatório.';
    else if (!isValidEmail(email.trim())) next.email = 'Formato de e-mail inválido.';

    if (!password) next.password = 'A senha é obrigatória.';
    else if (password.length < 6) next.password = 'A senha deve ter no mínimo 6 caracteres.';

    if (!confirm) next.confirm = 'Confirme a senha.';
    else if (confirm !== password) next.confirm = 'As senhas não coincidem.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');
    if (!validate()) return;

    setLoading(true);
    const result = await register({ name, email, password });
    setLoading(false);

    if (!result.ok) {
      setSubmitError(result.error || 'Falha ao cadastrar.');
      return;
    }
    setSubmitSuccess('Cadastro realizado! Redirecionando...');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.toggleRow}>
          <ThemeToggle color={c.text} />
        </View>

        <View style={[styles.logoCircle, { backgroundColor: c.primarySoft }]}>
          <Ionicons name="person-add" size={40} color={c.primary} />
        </View>

        <Text style={[styles.title, { color: c.text }]}>Criar Conta</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          Preencha os dados abaixo para começar
        </Text>

        <View style={styles.form}>
          <Input
            label="Nome completo"
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Seu nome completo"
            autoCapitalize="words"
            icon="person-outline"
            error={errors.name}
          />

          <Input
            label="E-mail"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors({ ...errors, password: undefined });
              if (errors.confirm && confirm === v) setErrors({ ...errors, confirm: undefined });
            }}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />

          <Input
            label="Confirmar senha"
            value={confirm}
            onChangeText={(v) => {
              setConfirm(v);
              if (errors.confirm) setErrors({ ...errors, confirm: undefined });
            }}
            placeholder="Repita a senha"
            secureTextEntry
            icon="shield-checkmark-outline"
            error={errors.confirm}
          />

          {submitError ? (
            <View style={[styles.feedback, { backgroundColor: c.dangerSoft }]}>
              <Ionicons name="alert-circle" size={18} color={c.danger} />
              <Text style={[styles.feedbackText, { color: c.danger }]}>{submitError}</Text>
            </View>
          ) : null}

          {submitSuccess ? (
            <View style={[styles.feedback, { backgroundColor: c.successSoft }]}>
              <Ionicons name="checkmark-circle" size={18} color={c.success} />
              <Text style={[styles.feedbackText, { color: c.success }]}>{submitSuccess}</Text>
            </View>
          ) : null}

          <Button
            label="Cadastrar"
            icon="checkmark-outline"
            onPress={handleSubmit}
            loading={loading}
            disabled={hasErrors}
          />

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: c.textMuted }]}>Já tem conta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: c.primary }]}>Fazer login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  toggleRow: { width: '100%', alignItems: 'flex-end' },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: { width: '100%', maxWidth: 420 },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: { flex: 1, fontSize: 13 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { fontSize: 14 },
  linkText: { fontSize: 14, fontWeight: 'bold' },
});
