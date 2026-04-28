import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

// Rota raiz — redireciona com base no estado de autenticacao
// Evita "tela em branco" enquanto a sessao e hidratada do AsyncStorage
export default function Index() {
  const { user, hydrated } = useAuth();

  if (!hydrated) return <Loading message="Inicializando..." />;
  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/login" />;
}
