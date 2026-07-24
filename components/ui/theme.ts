export const Palette = {
  light: {
    background: '#F7F6F2',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    surfaceMuted: '#EFEDE6',
    textPrimary: '#171714',
    textSecondary: '#75746D',
    textTertiary: '#98968E',
    borderSubtle: '#E6E3D9',
    divider: '#ECEAE3',
    accent: '#FF5A36',
    accentPressed: '#D94122',
    accentSoft: '#FFF0EC',
    success: '#198754',
    successSoft: '#E9F7EF',
    warning: '#C97900',
    warningSoft: '#FFF5DE',
    danger: '#C9342F',
    mapOverlay: 'rgba(247,246,242,0.92)',
  },
  dark: {
    background: '#11110F',
    surface: '#1B1B18',
    surfaceRaised: '#22221E',
    surfaceMuted: '#292925',
    textPrimary: '#F4F2EB',
    textSecondary: '#B0AEA5',
    textTertiary: '#85837C',
    borderSubtle: '#34342F',
    divider: '#2C2C28',
    accent: '#FF7558',
    accentPressed: '#FF5A36',
    accentSoft: '#3B211B',
    success: '#49B77A',
    successSoft: '#163524',
    warning: '#F2B542',
    warningSoft: '#3B2E12',
    danger: '#FF6C64',
    mapOverlay: 'rgba(17,17,15,0.90)',
  },
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
};

export const ThemeTokens = Palette;
