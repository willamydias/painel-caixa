'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, FilterState, KPIStats, ColorPaletteKey } from '@/types/property';
import { filterAndSortProperties, calculateKPIs } from '@/lib/scoring';
import { applyColorPalette } from '@/lib/palettes';
import { getUserSettings, saveUserSettings, UserSettings } from '@/lib/userSettings';
import { useUser } from '@/context/UserContext';
import { UserNoteDB } from '@/lib/db';

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
  propertyNotes: Record<string, UserNoteDB>;
  updatePropertyNote: (propertyId: string, noteData: Partial<UserNoteDB>) => Promise<void>;
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
  activeNoteProperty: Property | null;
  setActiveNoteProperty: (prop: Property | null) => void;
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
  const { currentUser } = useUser();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [lastScrapingDate, setLastScrapingDate] = useState<string>('23/07/2026');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Dados Isolados do Usuário Ativo
  const [favorites, setFavorites] = useState<string[]>([]);
  const [propertyNotes, setPropertyNotes] = useState<Record<string, UserNoteDB>>({});
  const [activeNoteProperty, setActiveNoteProperty] = useState<Property | null>(null);

  // Settings do usuário
  const [userSettings, setUserSettingsState] = useState<UserSettings>(defaultUserSettings);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteKey>('citrico');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Carregar lista global de imóveis da base de dados local
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

  // 2. Carregar dados do Banco de Dados ao trocar de Usuário Ativo (Multiusuário)
  useEffect(() => {
    if (!currentUser?.id) return;

    async function loadUserData() {
      try {
        // A. Preferências & Configurações
        const stRes = await fetch(`/api/user-settings?userId=${currentUser.id}`);
        if (stRes.ok) {
          const stData = await stRes.json();
          if (stData.preferences) {
            const pref = stData.preferences;
            setUserSettingsState({
              theme: pref.theme || 'light',
              colorPalette: pref.color_palette || pref.colorPalette || 'citrico',
              minPreco: pref.min_preco || pref.minPreco || 50000,
              maxPreco: pref.max_preco || pref.maxPreco || 800000,
              aceitaFGTS: pref.aceita_fgts ?? pref.aceitaFGTS ?? true,
              aceitaFinanciamento: pref.aceita_financiamento ?? pref.aceitaFinanciamento ?? true,
            });
            if (pref.theme) setTheme(pref.theme);
            if (pref.color_palette || pref.colorPalette) setColorPaletteState((pref.color_palette || pref.colorPalette) as ColorPaletteKey);
          }
        }

        // B. Imóveis Favoritos
        const favRes = await fetch(`/api/favorites?userId=${currentUser.id}`);
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavorites(favData.favorites || []);
        }

        // C. Anotações Personalizadas & Status Kanban
        const notesRes = await fetch(`/api/notes?userId=${currentUser.id}`);
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          setPropertyNotes(notesData.notes || {});
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do usuário:', err);
      }
    }
    loadUserData();
  }, [currentUser]);

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
    if (newSettings.theme) setTheme(newSettings.theme);
    if (newSettings.colorPalette) setColorPaletteState(newSettings.colorPalette as ColorPaletteKey);

    await saveUserSettings(next);
    try {
      await fetch('/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, ...next }),
      });
    } catch (err) {
      console.warn('Sincronização em background:', err);
    }
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

  const toggleFavorite = async (propertyId: string) => {
    const isFav = favorites.includes(propertyId);
    const updatedFavs = isFav ? favorites.filter((id) => id !== propertyId) : [...favorites, propertyId];
    setFavorites(updatedFavs);

    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, propertyId }),
      });
    } catch (err) {
      console.warn('Erro ao atualizar favorito no banco:', err);
    }
  };

  const updatePropertyNote = async (propertyId: string, noteData: Partial<UserNoteDB>) => {
    const current = propertyNotes[propertyId] || {
      user_id: currentUser.id,
      property_id: propertyId,
      kanban_status: 'Interessante',
      note_text: '',
      tags: [],
      updated_at: new Date().toISOString(),
    };

    const nextNote: UserNoteDB = {
      ...current,
      ...noteData,
      user_id: currentUser.id,
      property_id: propertyId,
      updated_at: new Date().toISOString(),
    };

    setPropertyNotes((prev) => ({ ...prev, [propertyId]: nextNote }));

    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          propertyId,
          kanbanStatus: nextNote.kanban_status,
          noteText: nextNote.note_text,
          maxLance: nextNote.max_lance,
          tags: nextNote.tags,
        }),
      });
    } catch (err) {
      console.warn('Erro ao salvar nota no banco:', err);
    }
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
        propertyNotes,
        updatePropertyNote,
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
        activeNoteProperty,
        setActiveNoteProperty,
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
