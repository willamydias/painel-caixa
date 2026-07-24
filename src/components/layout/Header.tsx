'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { COLOR_PALETTES } from '@/lib/palettes';
import { Landmark, Search, Sun, Moon, Database, Sparkles, Palette, Check } from 'lucide-react';

export function Header() {
  const {
    filters,
    updateFilter,
    theme,
    toggleTheme,
    colorPalette,
    setColorPalette,
    lastScrapingDate,
    allProperties,
  } = useDashboard();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPaletteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-main)] bg-[var(--bg-header)]/95 backdrop-blur transition-colors">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Commercial Minimalist Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 border border-white/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-[var(--text-main)] font-sans">
                Painel <span className="text-[var(--color-primary)]">Imobiliário</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                <Sparkles className="h-3 w-3" /> By WMSD
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Plataforma Analítica de Oportunidades CAIXA
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por bairro, endereço, ID Caixa..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full rounded-xl border border-[var(--border-main)] bg-[var(--bg-sub)] pl-10 pr-4 py-2 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Right: Scraping Date Badge, Palette Dropdown & Theme Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic Scraping Date Version Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-2.5 py-1.5 text-xs">
            <Database className="h-3.5 w-3.5 text-emerald-500" />
            <span className="rounded bg-[var(--border-main)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--text-main)]">
              {lastScrapingDate}
            </span>
            <span className="rounded bg-[var(--border-main)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--text-main)]">
              {allProperties.length} lotes
            </span>
          </div>

          {/* Color Palette Selector Dropdown (Texto "Cor 🔽" quando retraído) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] px-3 py-1.5 text-xs font-extrabold text-[var(--text-main)] shadow-sm hover:border-[var(--color-primary)] transition-colors"
              title="Escolha a Paleta de Cores"
            >
              <Palette className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>Cor 🔽</span>
            </button>

            {isPaletteOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] px-2.5 py-1">
                  Selecione a Paleta de Cores
                </div>
                <div className="space-y-1 mt-1">
                  {Object.values(COLOR_PALETTES).map((pal) => {
                    const isSelected = colorPalette === pal.key;
                    return (
                      <button
                        key={pal.key}
                        onClick={() => {
                          setColorPalette(pal.key);
                          setIsPaletteOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold text-left transition-all ${
                          isSelected
                            ? 'bg-[var(--color-primary)] text-white shadow-sm'
                            : 'text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                        }`}
                      >
                        <span className="truncate pr-2">{pal.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: pal.primaryHex }} />
                          <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: pal.secondaryHex }} />
                          {isSelected && <Check className="h-3.5 w-3.5 ml-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar Tema Claro/Escuro"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-main)] bg-[var(--bg-sub)] text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

        </div>

      </div>
    </header>
  );
}
