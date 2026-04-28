import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppDataProvider } from '../context/AppDataContext';
import Loading from '../components/Loading';

// Layout raiz: monta os Providers globais e protege as rotas autenticadas
// Conceitos vistos nas Aulas 6/7 (persistencia + estado global)

function RootStack() {
  const { user, hydrated: authHydrated } = useAuth();
  const { hydrated: themeHydrated } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  // Redirecionamento baseado em autenticacao (auth gate)
  useEffect(() => {
    if (!authHydrated) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, authHydrated, segments]);

  if (!authHydrated || !themeHydrated) {
    return <Loading message="Inicializando..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <ThemedStatusBar />
          <RootStack />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
