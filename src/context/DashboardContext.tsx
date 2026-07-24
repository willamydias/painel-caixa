'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, FilterState, KPIStats, ColorPaletteKey } from '@/types/property';
import { filterAndSortProperties, calculateKPIs } from '@/lib/scoring';
import { applyColorPalette } from '@/lib/palettes';

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
  colorPalette: ColorPaletteKey;
  setColorPalette: (palette: ColorPaletteKey) => void;
  lastScrapingDate: string;
  isLoading: boolean;
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // Padrão de cor alterado para "Cítrico Quente" (citrico)
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteKey>('citrico');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial properties from /data/properties.json
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

  // Sync Theme and Color Palette
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    applyColorPalette(colorPalette, theme);
  }, [theme, colorPalette]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorPalette = (palette: ColorPaletteKey) => {
    setColorPaletteState(palette);
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
  }, [allProperties, filters]);

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
        colorPalette,
        setColorPalette,
        lastScrapingDate,
        isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
}
