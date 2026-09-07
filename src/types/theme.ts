export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  bgBase: string;
  bgContainer: string;
  bgLayout: string;
  bgElevated: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  shadowCard: string;
  shadowCardHover: string;
  btnBg: string;
  btnBgHover: string;
  btnBorder: string;
  btnText: string;
  cardBg: string;
  cardBorder: string;
  menuBg: string;
  menuItemSelectedBg: string;
  menuItemHoverBg: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}
