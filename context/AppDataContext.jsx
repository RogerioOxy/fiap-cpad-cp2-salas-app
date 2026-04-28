import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from './AuthContext';

// Gerencia dados funcionais persistidos (reservas de salas)
// Estrutura no AsyncStorage:
//   { "usuario@dominio.com": [ { id, roomId, roomName, slot, createdAt }, ... ] }
const AppDataContext = createContext(null);

async function readAll() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  return raw ? JSON.parse(raw) : {};
}

async function writeAll(data) {
  await AsyncStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(data));
}

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sempre que o usuario muda (login/logout), recarrega as reservas dele
  useEffect(() => {
    if (!user) {
      setReservations([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const all = await readAll();
        if (!cancelled) {
          setReservations(all[user.email] || []);
        }
      } catch (err) {
        console.warn('Falha ao ler reservas', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const addReservation = useCallback(
    async ({ roomId, roomName, slot }) => {
      if (!user) return { ok: false, error: 'Usuario nao autenticado.' };
      const all = await readAll();
      const userReservations = all[user.email] || [];
      const duplicate = userReservations.find(
        (r) => r.roomId === roomId && r.slot === slot
      );
      if (duplicate) {
        return { ok: false, error: 'Voce ja reservou essa sala neste horario.' };
      }
      const newReservation = {
        id: `${Date.now()}-${roomId}`,
        roomId,
        roomName,
        slot,
        createdAt: new Date().toISOString(),
      };
      const updated = [...userReservations, newReservation];
      all[user.email] = updated;
      await writeAll(all);
      setReservations(updated);
      return { ok: true, reservation: newReservation };
    },
    [user]
  );

  const removeReservation = useCallback(
    async (id) => {
      if (!user) return { ok: false };
      const all = await readAll();
      const userReservations = all[user.email] || [];
      const updated = userReservations.filter((r) => r.id !== id);
      all[user.email] = updated;
      await writeAll(all);
      setReservations(updated);
      return { ok: true };
    },
    [user]
  );

  const value = useMemo(
    () => ({ reservations, loading, addReservation, removeReservation }),
    [reservations, loading, addReservation, removeReservation]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  }
  return ctx;
}
