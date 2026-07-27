'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, FilterState, KPIStats, ColorPaletteKey } from '@/types/property';
import { filterAndSortProperties, calculateKPIs } from '@/lib/scoring';
import { applyColorPalette } from '@/lib/palettes';
import { getUserSettings, saveUserSettings, UserSettings } from '@/lib/userSettings';

interface DashboardContextType {
  allProperties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  kpis: KPIStats;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeState: (theme: 'dark' | 'light') => void;
  colorPalette: ColorPaletteKey;
  setColorPalette: (palette: ColorPaletteKey) => void;
  lastScrapingDate: string;
  isLoading: boolean;
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const initialFilters: FilterState = {
  searchQuery: '',
  cidadeSatelite: 'Todos',
  bairro: 'Todos',
  modalidade: 'Todos',
  leiloeiro: 'Todos',
  fgtsOnly: false,
  minDescontoPct: 0,
  maxPrecoNum: 0,
  veredictoFilter: 'Todos',
  selectedDate: null,
  sortBy: 'score',
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [lastScrapingDate, setLastScrapingDate] = useState<string>('23/07/2026');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Settings do usuário (recuperadas de localStorage/banco ao iniciar)
  const [userSettings, setUserSettingsState] = useState<UserSettings>(defaultUserSettings);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteKey>('citrico');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Restaurar configurações salvas do usuário ao inicializar o app/login
  useEffect(() => {
    const saved = getUserSettings();
    setUserSettingsState(saved);
    if (saved.theme) {
      setTheme(saved.theme);
    }
  }, []);

  // 2. Carregar lista de imóveis da base de dados local
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/properties.json');
        if (res.ok) {
          const payload = await res.json();
          if (payload.properties) {
            setAllProperties(payload.properties);
            if (payload.last_scraping_date) {
              setLastScrapingDate(payload.last_scraping_date);
            }
          } else if (Array.isArray(payload)) {
            setAllProperties(payload);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar imóveis:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // 3. Manter o tema e esquema de cores consistente em TODAS as telas e rotas
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    applyColorPalette(colorPalette, theme);
  }, [theme, colorPalette]);

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    const next = { ...userSettings, ...newSettings };
    setUserSettingsState(next);
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
    await saveUserSettings(next);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    updateUserSettings({ theme: nextTheme });
  };

  const setThemeState = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    updateUserSettings({ theme: newTheme });
  };

  const setColorPalette = (palette: ColorPaletteKey) => {
    setColorPaletteState(palette);
    updateUserSettings({ colorPalette: palette });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredProperties = useMemo(() => {
    return filterAndSortProperties(allProperties, filters);
  }, [allProperties, filters]);

  const kpis = useMemo(() => {
    return calculateKPIs(allProperties, filteredProperties);
  }, [allProperties, filteredProperties]);

  return (
    <DashboardContext.Provider
      value={{
        allProperties,
        filteredProperties,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        selectedPropertyId,
        setSelectedPropertyId,
        hoveredPropertyId,
        setHoveredPropertyId,
        viewMode,
        setViewMode,
        favorites,
        toggleFavorite,
        kpis,
        theme,
        toggleTheme,
        setThemeState,
        colorPalette,
        setColorPalette,
        lastScrapingDate,
        isLoading,
        userSettings,
        updateUserSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

const defaultUserSettings: UserSettings = {
  theme: 'light',
  minPreco: 50000,
  maxPreco: 800000,
  aceitaFGTS: true,
  aceitaFinanciamento: true,
  colorPalette: 'citrico',
};

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
}
