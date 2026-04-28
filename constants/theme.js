// Tokens visuais do app (tema claro e escuro)
// Centraliza cores, espaçamentos e tipografia para garantir consistência
// e suportar o diferencial de tema dinamico (dark mode)

const palette = {
  primary: '#ED145B',       // Magenta FIAP
  primaryDark: '#B30D45',
  primarySoft: '#FDE8EF',
  success: '#4CAF50',
  successSoft: '#E8F5E9',
  danger: '#F44336',
  dangerSoft: '#FFEBEE',
  warning: '#FF9800',
  warningSoft: '#FFF3E0',
  white: '#FFFFFF',
  black: '#000000',
};

export const lightTheme = {
  mode: 'light',
  colors: {
    ...palette,
    background: '#F0F0F5',
    surface: '#FFFFFF',
    surfaceMuted: '#F8F8FA',
    border: '#E0E0E0',
    borderSoft: '#F0F0F5',
    text: '#2D2D3A',
    textMuted: '#8E8E9A',
    textInverse: '#FFFFFF',
    inputBg: '#FFFFFF',
    placeholder: '#B0B0B0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    ...palette,
    background: '#15151C',
    surface: '#1E1E27',
    surfaceMuted: '#2A2A36',
    border: '#3A3A47',
    borderSoft: '#2A2A36',
    text: '#F0F0F5',
    textMuted: '#9A9AA8',
    textInverse: '#FFFFFF',
    inputBg: '#2A2A36',
    placeholder: '#6A6A78',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: 'bold' },
  heading: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
};
