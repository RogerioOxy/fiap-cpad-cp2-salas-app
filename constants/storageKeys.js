// Chaves do AsyncStorage centralizadas
// Evita strings magicas espalhadas pelo codigo e facilita troca/limpeza
export const STORAGE_KEYS = {
  USERS: '@fiap-salas:users',           // lista de usuarios cadastrados
  SESSION: '@fiap-salas:session',       // email do usuario logado
  RESERVATIONS: '@fiap-salas:reservas', // reservas (agrupadas por email)
  THEME: '@fiap-salas:theme',           // preferencia de tema (light/dark)
};
