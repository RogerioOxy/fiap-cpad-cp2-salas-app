import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Gerencia o estado de autenticacao globalmente
// - usuario logado (ou null)
// - funcao de login, registro, logout
// - hidratacao da sessao no startup (lembrar usuario logado)
const AuthContext = createContext(null);

async function readUsers() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

async function writeUsers(users) {
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Hidratacao inicial: ao abrir o app, restaura sessao salva
  useEffect(() => {
    (async () => {
      try {
        const sessionEmail = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
        if (sessionEmail) {
          const users = await readUsers();
          const found = users.find((u) => u.email === sessionEmail);
          if (found) {
            setUser({ name: found.name, email: found.email });
          }
        }
      } catch (err) {
        console.warn('Falha ao restaurar sessao', err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await readUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'Ja existe uma conta com este e-mail.' };
    }
    const newUser = { name: name.trim(), email: normalizedEmail, password };
    await writeUsers([...users, newUser]);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, normalizedEmail);
    setUser({ name: newUser.name, email: newUser.email });
    return { ok: true };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await readUsers();
    const found = users.find((u) => u.email === normalizedEmail);
    if (!found) {
      return { ok: false, error: 'E-mail nao cadastrado.' };
    }
    if (found.password !== password) {
      return { ok: false, error: 'Senha incorreta.' };
    }
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, normalizedEmail);
    setUser({ name: found.name, email: found.email });
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, register, login, logout, isAuthenticated: !!user }),
    [user, hydrated, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
