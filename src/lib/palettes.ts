import { ColorPaletteKey } from '@/types/property';

export interface ColorPaletteConfig {
  key: ColorPaletteKey;
  name: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  dark: {
    bgPage: string;
    bgCard: string;
    bgSub: string;
    bgHeader: string;
    textMain: string;
    textMuted: string;
    border: string;
  };
  light: {
    bgPage: string;
    bgCard: string;
    bgSub: string;
    bgHeader: string;
    textMain: string;
    textMuted: string;
    border: string;
  };
}

export const COLOR_PALETTES: Record<ColorPaletteKey, ColorPaletteConfig> = {
  azul_classico: {
    key: 'azul_classico',
    name: 'Azul Clássico Escuro (Padrão)',
    primaryHex: '#178582',
    secondaryHex: '#0A1828',
    accentHex: '#BFA181',
    dark: {
      bgPage: '#0A1828',
      bgCard: '#112236',
      bgSub: '#0E1E31',
      bgHeader: '#0A1828',
      textMain: '#F8FAFC',
      textMuted: '#94A3B8',
      border: '#1E3A5F',
    },
    light: {
      bgPage: '#F8FAFC',
      bgCard: '#FFFFFF',
      bgSub: '#F1F5F9',
      bgHeader: '#FFFFFF',
      textMain: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
    },
  },
  azul_royal: {
    key: 'azul_royal',
    name: 'Azul Claro & Royal',
    primaryHex: '#4A8BDF',
    secondaryHex: '#A0006D',
    accentHex: '#EFFAFD',
    dark: {
      bgPage: '#0D1527',
      bgCard: '#16233B',
      bgSub: '#111C30',
      bgHeader: '#0D1527',
      textMain: '#EFFAFD',
      textMuted: '#94A3B8',
      border: '#23385D',
    },
    light: {
      bgPage: '#EFFAFD',
      bgCard: '#FFFFFF',
      bgSub: '#E2F4FA',
      bgHeader: '#FFFFFF',
      textMain: '#0D1527',
      textMuted: '#475569',
      border: '#CBD5E1',
    },
  },
  carmim: {
    key: 'carmim',
    name: 'Carmim & Frutas Escuras',
    primaryHex: '#8E0D3C',
    secondaryHex: '#EF3B33',
    accentHex: '#FDA1A2',
    dark: {
      bgPage: '#1D1842',
      bgCard: '#2A245C',
      bgSub: '#231E4F',
      bgHeader: '#1D1842',
      textMain: '#FDA1A2',
      textMuted: '#CBD5E1',
      border: '#433A82',
    },
    light: {
      bgPage: '#FFF5F5',
      bgCard: '#FFFFFF',
      bgSub: '#FFE8E8',
      bgHeader: '#FFFFFF',
      textMain: '#1D1842',
      textMuted: '#64748B',
      border: '#FECDD3',
    },
  },
  pastel: {
    key: 'pastel',
    name: 'Pastel & Petróleo',
    primaryHex: '#FF78AC',
    secondaryHex: '#A8D5E3',
    accentHex: '#F2F0EA',
    dark: {
      bgPage: '#1A2930',
      bgCard: '#273C47',
      bgSub: '#20333D',
      bgHeader: '#1A2930',
      textMain: '#F2F0EA',
      textMuted: '#94A3B8',
      border: '#385564',
    },
    light: {
      bgPage: '#F2F0EA',
      bgCard: '#FFFFFF',
      bgSub: '#E6E3D8',
      bgHeader: '#FFFFFF',
      textMain: '#1A2930',
      textMuted: '#64748B',
      border: '#D1CDBF',
    },
  },
  citrico: {
    key: 'citrico',
    name: 'Cítrico Quente',
    primaryHex: '#FF921C',
    secondaryHex: '#ECA427',
    accentHex: '#FF921C',
    dark: {
      bgPage: '#1C150C',
      bgCard: '#2E2214',
      bgSub: '#241B0F',
      bgHeader: '#1C150C',
      textMain: '#FFFBF5',
      textMuted: '#A89F91',
      border: '#4D3921',
    },
    light: {
      bgPage: '#FFFBF5',
      bgCard: '#FFFFFF',
      bgSub: '#FFF3E0',
      bgHeader: '#FFFFFF',
      textMain: '#1C150C',
      textMuted: '#64748B',
      border: '#FFE0B2',
    },
  },
  verde_vermelho: {
    key: 'verde_vermelho',
    name: 'Verde & Vermelho',
    primaryHex: '#205A28',
    secondaryHex: '#C72B32',
    accentHex: '#FFFFFF',
    dark: {
      bgPage: '#0F2414',
      bgCard: '#183820',
      bgSub: '#132E1A',
      bgHeader: '#0F2414',
      textMain: '#FFFFFF',
      textMuted: '#94A3B8',
      border: '#285C34',
    },
    light: {
      bgPage: '#F4FBF5',
      bgCard: '#FFFFFF',
      bgSub: '#E2F5E5',
      bgHeader: '#FFFFFF',
      textMain: '#0F2414',
      textMuted: '#475569',
      border: '#C8E6C9',
    },
  },
};

export function applyColorPalette(paletteKey: ColorPaletteKey, theme: 'dark' | 'light' = 'dark') {
  const pal = COLOR_PALETTES[paletteKey] || COLOR_PALETTES.azul_classico;
  const root = document.documentElement;
  const mode = theme === 'dark' ? pal.dark : pal.light;

  root.style.setProperty('--color-primary', pal.primaryHex);
  root.style.setProperty('--color-secondary', pal.secondaryHex);
  root.style.setProperty('--color-accent', pal.accentHex);

  root.style.setProperty('--bg-page', mode.bgPage);
  root.style.setProperty('--bg-card', mode.bgCard);
  root.style.setProperty('--bg-sub', mode.bgSub);
  root.style.setProperty('--bg-header', mode.bgHeader);
  root.style.setProperty('--text-main', mode.textMain);
  root.style.setProperty('--text-muted', mode.textMuted);
  root.style.setProperty('--border-main', mode.border);
}
