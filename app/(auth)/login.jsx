import { useState } from 'react';
import {
  View,
  Text,
  Image,
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

// Tela de Login com validacao inline e persistencia via AsyncStorage
export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Regex simples para validar formato de e-mail (usuario@dominio.com)
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'O e-mail é obrigatório.';
    else if (!isValidEmail(email.trim())) next.email = 'Formato de e-mail inválido.';

    if (!password) next.password = 'A senha é obrigatória.';
    else if (password.length < 6) next.password = 'A senha deve ter no mínimo 6 caracteres.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');
    if (!validate()) return;

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (!result.ok) {
      setSubmitError(result.error || 'Falha ao entrar.');
      return;
    }
    setSubmitSuccess('Login realizado! Redirecionando...');
    // O AuthGate no _layout.js faz o redirect automatico
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
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.title, { color: c.text }]}>FIAP Salas</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          Entre para reservar e gerenciar suas salas
        </Text>

        <View style={styles.form}>
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
            }}
            placeholder="Sua senha"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
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
            label="Entrar"
            icon="log-in-outline"
            onPress={handleSubmit}
            loading={loading}
            disabled={hasErrors}
          />

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: c.textMuted }]}>
              Ainda não tem conta?{' '}
            </Text>
            <Link href="/(auth)/cadastro" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: c.primary }]}>Cadastre-se</Text>
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
  toggleRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: { fontSize: 14 },
  linkText: { fontSize: 14, fontWeight: 'bold' },
});
