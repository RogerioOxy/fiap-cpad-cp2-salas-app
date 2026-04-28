import { Stack } from 'expo-router';

// Layout do grupo de rotas (auth) — telas publicas (login + cadastro)
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
